from fastapi import FastAPI
from app.core.attack_chain import ATTACK_CHAINS

app = FastAPI()

MITRE_NAMES = {
    "T1110": "Credential Access",
    "T1078": "Valid Accounts",
    "T1021": "Lateral Movement",
    "T1041": "Exfiltration",
    "T1486": "Ransomware Impact"
}

@app.get("/graph")
def graph():

    nodes = []

    for ip, chain in ATTACK_CHAINS.items():

        nodes.append({
            "type": "source",
            "id": ip
        })

        for technique in chain:

            nodes.append({
                "type": "attack",
                "id": MITRE_NAMES.get(
                    technique,
                    technique
                )
            })

    return {
        "nodes": nodes
    }
