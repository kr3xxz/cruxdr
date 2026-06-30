import json
from datetime import datetime


ECS_EVENT_TYPE_MAP = {
    "credential_access": "credential_access",
    "execution": "execution",
    "persistence": "persistence",
    "privilege_escalation": "privilege_escalation",
    "defense_evasion": "defense_evasion",
    "lateral_movement": "lateral_movement",
    "exfiltration": "data_exfiltration",
}

TACTIC_CATEGORY_MAP = {
    "credential_access": "Credential Access",
    "execution": "Execution",
    "persistence": "Persistence",
    "privilege_escalation": "Privilege Escalation",
    "defense_evasion": "Defense Evasion",
    "lateral_movement": "Lateral Movement",
    "exfiltration": "Exfiltration",
}


def parse_logs(raw_logs: str):
    events = []

    for line in raw_logs.splitlines():
        line = line.strip()
        if not line:
            continue

        if line.startswith("{"):
            try:
                parsed = json.loads(line)
            except json.JSONDecodeError:
                continue

            raw_str = parsed.get("raw", line)
            event_type = parsed.get("event_type", "")
            tactic = parsed.get("threat", {}).get("tactic", "")

            event = {
                "event_type": ECS_EVENT_TYPE_MAP.get(event_type, event_type),
                "tactic": tactic or TACTIC_CATEGORY_MAP.get(event_type, ""),
                "technique_id": parsed.get("threat", {}).get("technique_id", ""),
                "technique_name": parsed.get("threat", {}).get("technique_name", ""),
                "attack_type": parsed.get("attack_type", ""),
                "mitre_technique": parsed.get("mitre_technique", ""),
                "severity_score": parsed.get("severity", 0),
                "confidence": parsed.get("confidence", 0),
                "category": parsed.get("category", ""),
                "action": parsed.get("action", ""),
                "process_name": parsed.get("process", {}).get("name", ""),
                "process_path": parsed.get("process", {}).get("path", ""),
                "process_pid": parsed.get("process", {}).get("pid", 0),
                "parent_process_name": parsed.get("parent", {}).get("name", ""),
                "parent_process_path": parsed.get("parent", {}).get("path", ""),
                "target_process_name": parsed.get("target", {}).get("name", ""),
                "target_process_path": parsed.get("target", {}).get("path", ""),
                "target_process_pid": parsed.get("target", {}).get("pid", 0),
                "username": parsed.get("user", {}).get("name", ""),
                "user_domain": parsed.get("user", {}).get("domain", ""),
                "host": parsed.get("host", {}).get("name", ""),
                "host_ip": parsed.get("host", {}).get("ip", ""),
                "source_ip": (
                    parsed.get("network", {}).get("src_ip", "")
                    or parsed.get("source", {}).get("ip", "")
                ),
                "dest_ip": (
                    parsed.get("network", {}).get("dest_ip", "")
                    or parsed.get("destination", {}).get("ip", "")
                ),
                "dest_port": (
                    parsed.get("network", {}).get("dest_port", 0)
                    or parsed.get("destination", {}).get("port", 0)
                ),
                "registry_path": parsed.get("registry", {}).get("path", ""),
                "registry_value": parsed.get("registry", {}).get("value", ""),
                "registry_data": parsed.get("registry", {}).get("data", ""),
                "file_name": parsed.get("file", {}).get("name", ""),
                "file_path": parsed.get("file", {}).get("path", ""),
                "dns_query": parsed.get("dns", {}).get("query", ""),
                "command_line": parsed.get("command_line", "") or parsed.get("process", {}).get("command_line", ""),
                "message": parsed.get("message", ""),
                "timestamp": parsed.get("ts") or datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "raw": raw_str,
            }
            events.append(event)

    return events
