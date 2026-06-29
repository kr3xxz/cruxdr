import httpx
from fastapi import APIRouter, Body
from app.core.log_generator import LogGenerator
from app.websocket.manager import manager
from app.graph.engine import AttackGraphEngine
from app.websocket.graph_manager import graph_manager
from app.models.graph_state import graph_nodes, graph_edges
from kafka import KafkaProducer
import json
import traceback

router = APIRouter()


@router.get("/graph")
async def get_graph():
    return {
        "nodes": graph_nodes[-30:],
        "edges": graph_edges[-30:],
    }


def get_producer():

    return KafkaProducer(
        bootstrap_servers="kafka:9092",
        value_serializer=lambda v:
            json.dumps(v).encode("utf-8")
    )


def to_ecs(log):
    ecs = {
        "ts": log.get("ts", ""),
        "event_type": log.get("event_type", ""),
        "category": log.get("category", ""),
        "action": log.get("action", ""),
        "severity": log.get("severity", 0),
        "confidence": log.get("confidence", 0),
        "message": log.get("message", ""),
        "command_line": log.get("command_line", "") or log.get("command_line", ""),
        "attack_type": log.get("attack_type", ""),
        "mitre_technique": log.get("mitre_technique", ""),
        "threat": {
            "technique_id": log.get("technique_id", ""),
            "technique_name": log.get("technique_name", ""),
            "tactic": log.get("tactic", ""),
        },
    }
    name = log.get("process_name") or log.get("process", {}).get("name", "")
    if name:
        proc = {"name": name}
        path = log.get("process_path") or log.get("process", {}).get("path", "")
        if path:
            proc["path"] = path
        pid = log.get("process_pid") or log.get("process", {}).get("pid", 0)
        if pid:
            proc["pid"] = str(pid)
        cl = log.get("command_line") or log.get("process", {}).get("command_line", "")
        if cl:
            proc["command_line"] = cl
        ecs["process"] = proc
    parent_name = log.get("parent_process_name") or log.get("parent", {}).get("name", "")
    if parent_name:
        par = {"name": parent_name}
        parent_path = log.get("parent_process_path") or log.get("parent", {}).get("path", "")
        if parent_path:
            par["path"] = parent_path
        ecs["parent"] = par
    uname = log.get("username") or log.get("user", {}).get("name", "")
    if uname:
        u = {"name": uname}
        dom = log.get("user_domain") or log.get("user", {}).get("domain", "")
        if dom:
            u["domain"] = dom
        ecs["user"] = u
    hname = log.get("host")
    if isinstance(hname, dict):
        h = {k: v for k, v in hname.items() if v}
        ecs["host"] = h
    elif hname:
        ecs["host"] = {"name": str(hname)}
    hip = log.get("host_ip")
    if hip and isinstance(hip, str):
        ecs.setdefault("host", {})["ip"] = hip
    sip = log.get("source_ip") or log.get("source", {}).get("ip", "")
    if sip and isinstance(sip, str):
        ecs["source"] = {"ip": sip}
    dip = log.get("dest_ip") or log.get("destination", {}).get("ip", "")
    dport = log.get("dest_port") or log.get("destination", {}).get("port", 0)
    if dip and isinstance(dip, str):
        dest = {"ip": dip}
        if dport:
            dest["port"] = str(dport)
        ecs["destination"] = dest
    rpath = log.get("registry_path") or log.get("registry", {}).get("path", "")
    if rpath:
        reg = {"path": rpath}
        rval = log.get("registry_value") or log.get("registry", {}).get("value", "")
        if rval:
            reg["value"] = str(rval)
        rdata = log.get("registry_data") or log.get("registry", {}).get("data", "")
        if rdata:
            reg["data"] = rdata
        ecs["registry"] = reg
    fname = log.get("file_name") or log.get("file", {}).get("name", "")
    if fname:
        f = {"name": fname}
        fpath = log.get("file_path") or log.get("file", {}).get("path", "")
        if fpath:
            f["path"] = fpath
        ecs["file"] = f
    dns = log.get("dns_query") or log.get("dns", {}).get("query", "")
    if dns:
        ecs["dns"] = {"query": dns}
    return ecs


def build_summary_event(logs, attack_type):
    if not logs:
        return None
    first = logs[0]
    max_sev = max(log.get("severity", 0) for log in logs)
    hosts = set()
    users = set()
    src_ips = set()
    for log in logs:
        h = log.get("host", "")
        if h:
            hosts.add(str(h))
        u = log.get("username", "")
        if u:
            users.add(str(u))
        s = log.get("source_ip", "")
        if s:
            src_ips.add(str(s))
    host_str = ", ".join(sorted(hosts)) if hosts else first.get("host", "unknown")
    user_str = ", ".join(sorted(users)) if users else first.get("username", "unknown")
    return {
        "ts": first.get("ts", ""),
        "event_type": first.get("event_type", "attack"),
        "attack_type": attack_type,
        "severity": max_sev,
        "mitre_technique": first.get("mitre_technique", first.get("technique_id", "")),
        "technique_id": first.get("technique_id", ""),
        "technique_name": first.get("technique_name", ""),
        "tactic": first.get("tactic", ""),
        "message": f"{attack_type.replace('_', ' ').title()} detected — {len(logs)} events",
        "host": host_str,
        "username": user_str,
        "source_ip": ", ".join(sorted(src_ips)) if src_ips else first.get("source_ip", ""),
        "count": len(logs),
    }


async def send_logs(logs, attack_type=None):

    for log in logs:
        if attack_type:
            log["attack_type"] = attack_type
        if "technique_id" in log and "mitre_technique" not in log:
            log["mitre_technique"] = log["technique_id"]

    producer = get_producer()

    for log in logs:

        producer.send(
            "cruxdr-logs",
            log
        )

    producer.flush()

    if logs and attack_type:
        summary = build_summary_event(logs, attack_type)
        if summary:
            await manager.broadcast(summary)
        graph = AttackGraphEngine.process_attack(logs[0])
        await graph_manager.broadcast(graph)

    try:
        ecs_logs = [to_ecs(log) for log in logs]
        ndjson_content = "\n".join(json.dumps(el) for el in ecs_logs)
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(
                "http://cruxdr-log-ingestion-service:8000/upload",
                files={"file": ("simulation.ndjson", ndjson_content, "application/octet-stream")},
            )
    except Exception as e:
        print(f"[INGEST ERROR] {e}", flush=True)

    context = {"status": "success", "logs_generated": len(logs)}
    if logs and attack_type:
        first = logs[0]
        context["attack_type"] = attack_type
        context["username"] = first.get("username", "")
        context["host"] = first.get("host", "")
        context["source_ip"] = first.get("source_ip", "")
    return context


@router.post("/ransomware")
async def ransomware(
    username: str = Body(None),
    host: str = Body(None),
    source_ip: str = Body(None),
):
    try:
        return await send_logs(
            LogGenerator.ransomware(
                override_username=username,
                override_host=host,
                override_source_ip=source_ip,
            ),
            attack_type="ransomware",
        )
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}


@router.post("/brute_force")
async def brute_force(
    username: str = Body(None),
    host: str = Body(None),
    source_ip: str = Body(None),
):
    try:
        return await send_logs(
            LogGenerator.brute_force(
                override_username=username,
                override_host=host,
                override_source_ip=source_ip,
            ),
            attack_type="brute_force",
        )
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}


@router.post("/phishing")
async def phishing(
    username: str = Body(None),
    host: str = Body(None),
    source_ip: str = Body(None),
):
    try:
        return await send_logs(
            LogGenerator.phishing(
                override_username=username,
                override_host=host,
                override_source_ip=source_ip,
            ),
            attack_type="phishing",
        )
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}


@router.post("/lateral_movement")
async def lateral_movement(
    username: str = Body(None),
    host: str = Body(None),
    source_ip: str = Body(None),
):
    try:
        return await send_logs(
            LogGenerator.lateral_movement(
                override_username=username,
                override_host=host,
                override_source_ip=source_ip,
            ),
            attack_type="lateral_movement",
        )
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}


@router.post("/exfiltration")
async def exfiltration(
    username: str = Body(None),
    host: str = Body(None),
    source_ip: str = Body(None),
):
    try:
        return await send_logs(
            LogGenerator.exfiltration(
                override_username=username,
                override_host=host,
                override_source_ip=source_ip,
            ),
            attack_type="exfiltration",
        )
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
