print("DETECTION SERVICE STARTED")
from app.core.incidents import save_incident
from app.core.attack_chain import ATTACK_CHAINS
from app.core.state import FAILED_LOGINS, INCIDENTS
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "cruxdr-logs",
    bootstrap_servers="crux-kafka:9092",
    value_deserializer=lambda m:
        json.loads(m.decode("utf-8")),
    auto_offset_reset="earliest",
    group_id="cruxdr-detection"
)

for message in consumer:

    event = message.value
    if event.get("event_type") == "failed_login":
        technique = "T1110"
    elif event.get("event_type") == "successful_login":
        technique = "T1078"
    else:
        technique = "UNKNOWN"

    print(
        "[DETECTION EVENT]",
        event
    )


    ip = event.get("source_ip")
    ATTACK_CHAINS.setdefault(ip, []).append(technique)

    if "T1110" in ATTACK_CHAINS[ip] and "T1078" in ATTACK_CHAINS[ip]:

        incident = {
            "incident_type": "Account Compromise",
            "source_ip": ip,
            "severity": "CRITICAL",
            "mitre_attack": ["T1110","T1078"]
        }

        save_incident(incident)

        print(f"[ACCOUNT COMPROMISE] {ip}", flush=True)

    if event.get("event_type") == "failed_login":

        FAILED_LOGINS[ip] = FAILED_LOGINS.get(ip, 0) + 1

        print(
            f"[FAILED LOGIN COUNT] {ip} -> {FAILED_LOGINS[ip]}",
            flush=True
        )

        if FAILED_LOGINS[ip] >= 5:

            incident = {
                "incident_type": "Brute Force Incident",
                "source_ip": ip,
                "count": FAILED_LOGINS[ip],
                "severity": "HIGH",
                "mitre_attack": "T1110"
            }

            INCIDENTS.append(incident)
            save_incident(incident)

            print(
                f"[INCIDENT CREATED] {incident}",
                flush=True
            )

    if len(set(ATTACK_CHAINS[ip])) >= 2:

        print(
            f"[ATTACK CHAIN] {ip} -> {ATTACK_CHAINS[ip]}",
            flush=True
        )
