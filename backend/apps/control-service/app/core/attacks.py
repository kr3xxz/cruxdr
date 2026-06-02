import random
import uuid


def generate_attack(
    attack_type: str
):

    severities = [
        "medium",
        "high",
        "critical",
    ]

    mitre_map = {
        "ransomware": "T1486",
        "phishing": "T1566",
        "brute_force": "T1110",
        "lateral_movement": "T1021",
        "exfiltration": "T1041",
    }

    return {
        "id":
        str(uuid.uuid4()),

        "attack_type":
        attack_type,

        "severity":
        random.choice(
            severities
        ),

        "message":
        f"{attack_type} attack detected",

        "mitre_technique":
        mitre_map.get(
            attack_type,
            "Unknown"
        ),

        "source_ip":
        f"192.168.1.{random.randint(1,254)}",

        "target_user":
        random.choice([
            "admin",
            "john",
            "alice",
            "root",
        ]),
    }
