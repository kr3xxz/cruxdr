import asyncio
import json
import traceback

from kafka import KafkaConsumer

from app.data.store import (
    logs_store,
    alerts_store,
)

from app.core.matcher import SigmaMatcher
from app.core.producer import get_producer


def _merge_alerts(alerts: list) -> list:
    merged = {}
    for a in alerts:
        key = a.get("title", "Sigma Match")
        if key not in merged:
            merged[key] = {
                "title": a.get("title", "Sigma Match"),
                "severity": a.get("severity", "medium"),
                "mitre_attack": a.get("mitre_attack", ""),
                "alert_type": a.get("alert_type", a.get("title", "Sigma Match")),
                "event_count": 0,
                "hosts": set(),
                "users": set(),
                "event": None,
            }
        entry = merged[key]
        entry["event_count"] += 1
        ev = a.get("event", {})
        if entry["event"] is None:
            entry["event"] = ev
        host = ev.get("host", "")
        user = ev.get("username", "")
        if host:
            entry["hosts"].add(host)
        if user:
            entry["users"].add(user)

    result = []
    for entry in merged.values():
        entry["hosts"] = list(entry["hosts"])
        entry["users"] = list(entry["users"])
        result.append(entry)
    return result


def _dedup_store(existing: list, new_alerts: list) -> list:
    combined = existing + new_alerts
    seen = {}
    for a in combined:
        key = a.get("title", "Sigma Match")
        if key not in seen or a.get("event_count", 1) > seen[key].get("event_count", 0):
            seen[key] = a
    return list(seen.values())


async def _create_consumer():
    for attempt in range(10):
        try:
            consumer = KafkaConsumer(
                "cruxdr-logs",
                bootstrap_servers="crux-kafka:9092",
                value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                auto_offset_reset="earliest",
                group_id="sigma-service"
            )
            print("[*] KAFKA CONNECTED")
            return consumer
        except Exception as e:
            print(f"[KAFKA] consumer attempt {attempt + 1}/10: {e}", flush=True)
            if attempt < 9:
                await asyncio.sleep(3)
    raise RuntimeError("Could not connect to Kafka after 10 attempts")


class SigmaProcessor:

    @staticmethod
    async def start():
        print("[*] SIGMA PROCESSOR STARTED")

        consumer = None
        producer = get_producer()

        while True:
            try:
                if consumer is None:
                    consumer = await _create_consumer()
                    print("[*] SIGMA PROCESSOR ENTERING LOOP")

                messages = consumer.poll(timeout_ms=100)

                batch_alerts = []

                for tp, records in messages.items():
                    for message in records:
                        try:
                            event = message.value
                            logs_store.append(event)
                            logs_store[:] = logs_store[-200:]
                            alerts = SigmaMatcher.match(event)
                            batch_alerts.extend(alerts)
                        except Exception as e:
                            print(f"[SIGMA EVENT ERROR] {e}", flush=True)

                if batch_alerts:
                    merged = _merge_alerts(batch_alerts)

                    for alert in merged:
                        print(f"[ALERT] {alert}")
                        producer.send("alerts", alert)
                    producer.flush()

                    alerts_store[:] = _dedup_store(
                        alerts_store[:], merged
                    )
                    alerts_store[:] = alerts_store[-100:]

                await asyncio.sleep(0.5)

            except Exception as e:
                print("[!!!] SIGMA PROCESSOR CRASHED")
                print(str(e), flush=True)
                traceback.print_exc()
                consumer = None
                print("[*] SIGMA PROCESSOR WILL RETRY IN 5s", flush=True)
                await asyncio.sleep(5)
