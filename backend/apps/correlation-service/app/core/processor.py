import asyncio
import requests

from app.core.consumer import consumer
from app.data.store import incidents_store
from app.core.graph_builder import GraphBuilder


class IncidentProcessor:

    @staticmethod
    async def start():

        print("[*] INCIDENT PROCESSOR STARTED")

        while True:

            try:

                messages = consumer.poll(
                    timeout_ms=100
                )

                for tp, records in messages.items():

                    for message in records:

                        alert = message.value

                        title = (
                            alert.get("title")
                            or alert.get("alert_type")
                            or "Unknown Alert"
                        )

                        incident = {

                            "title": title,

                            "severity": alert.get(
                                "severity",
                                "medium"
                            ),

                            "host": (
                                alert.get(
                                    "event",
                                    {}
                                ).get(
                                    "host",
                                    "N/A"
                                )
                            ),

                            "user": (
                                alert.get(
                                    "event",
                                    {}
                                ).get(
                                    "user"
                                )
                                or alert.get(
                                    "event",
                                    {}
                                ).get(
                                    "username"
                                )
                                or alert.get(
                                    "username"
                                )
                                or "unknown"
                            ),

                            "mitre": (
                                alert.get(
                                    "mitre_attack"
                                )
                                or IncidentProcessor.map_mitre(
                                    alert
                                )
                            ),

                            "timeline": [
                                {
                                    "step": "Detection",

                                    "description": (
                                        alert.get(
                                            "event",
                                            {}
                                        ).get(
                                            "message",
                                            title
                                        )
                                    )
                                }
                            ],

                            "iocs": [
                                (
                                    alert.get("source_ip")
                                    or alert.get("event", {}).get("source_ip")
                                    or "N/A"
                                ),

                                (
                                    alert.get("destination_ip")
                                    or alert.get("event", {}).get("destination_ip")
                                    or alert.get("event", {}).get("dest_ip")
                                    or "N/A"
                                ),
                            ],
                        }

                        found = None
                        for x in incidents_store:
                            if x.get("title") == incident["title"] and x.get("host") == incident["host"] and x.get("user") == incident["user"]:
                                found = x
                                break

                        if found:
                            found["alert_count"] = found.get("alert_count", 1) + 1
                            found["last_seen"] = incident.get("timestamp", "")
                            incoming_sev = incident.get("severity", "medium")
                            sev_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
                            if sev_order.get(incoming_sev, 0) > sev_order.get(found.get("severity", "low"), 0):
                                found["severity"] = incoming_sev
                            existing_iocs = set(found.get("iocs", []))
                            for ioc in incident.get("iocs", []):
                                if ioc and ioc != "N/A":
                                    existing_iocs.add(ioc)
                            found["iocs"] = list(existing_iocs)
                            incidents_store.remove(found)
                            incidents_store.append(found)
                            incident = found
                        else:
                            incident["alert_count"] = 1
                            incident["last_seen"] = incident.get("timestamp", "")
                            incidents_store.append(incident)
                            incidents_store[:] = incidents_store[-100:]

                        try:

                            GraphBuilder.build(
                                {
                                    "title": title,

                                    "severity":
                                        incident.get(
                                            "severity",
                                            "medium"
                                        ),

                                    "mitre_attack":
                                        incident.get(
                                            "mitre",
                                            ""
                                        ),

                                    "event": {
                                        "host":
                                        incident["host"],

                                        "user":
                                        incident["user"],

                                        "username":
                                        incident["user"],

                                        "source_ip":
                                        incident.get(
                                            "iocs",
                                            []
                                        )[0] if incident.get(
                                            "iocs"
                                        ) else "",

                                        "message":
                                        incident["title"],
                                    }
                                }
                            )

                        except Exception as e:

                            print(
                                f"[GRAPH ERROR] {e}"
                            )

                        try:

                            requests.post(
                                "http://soar-service:8000/responses",
                                json=incident,
                                timeout=3,
                            )

                        except Exception as e:

                            print(
                                f"[SOAR ERROR] {e}"
                            )

                        print(
                            f"[INCIDENT] {incident}",
                            flush=True
                        )

            except Exception as e:

                print(
                    f"[PROCESSOR ERROR] {e}",
                    flush=True
                )

            await asyncio.sleep(0.5)

    @staticmethod
    def map_mitre(alert):

        mitre = alert.get("mitre_attack") or ""
        if mitre:
            return mitre

        title = (
            alert.get("title")
            or alert.get("alert_type")
            or ""
        ).lower()

        mappings = {

            "ssh brute force":
                "T1110",

            "account compromise":
                "T1078",

            "credential dumping":
                "T1003",

            "privilege escalation":
                "T1068",

            "lateral movement":
                "T1021",

            "data exfiltration":
                "T1041",

            "ransomware":
                "T1486",

            "lsass memory dumping":
                "T1003.001",

            "mimikatz":
                "T1003.001",

            "sam registry":
                "T1003.002",

            "dcsync":
                "T1003.006",

            "kerberos":
                "T1003.008",

            "powershell":
                "T1059.001",

            "wmi":
                "T1047",

            "scheduled task":
                "T1053.005",

            "registry run key":
                "T1547.001",

            "service installation":
                "T1543.003",

            "startup folder":
                "T1547.001",

            "uac bypass":
                "T1548.002",

            "token manipulation":
                "T1134",

            "dll search order":
                "T1574.001",

            "defender disable":
                "T1562.001",

            "process hollowing":
                "T1055.012",

            "event log clearing":
                "T1070.001",

            "psexec":
                "T1021.002",

            "rdp brute force":
                "T1110.001",

            "smb admin share":
                "T1021.002",

            "dns tunneling":
                "T1572",

            "procdump":
                "T1003.001",

            "phishing":
                "T1566",

            "exfiltration":
                "T1048",
        }

        for key, value in mappings.items():

            if key in title:

                return value

        return ""
