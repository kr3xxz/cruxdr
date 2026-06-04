import re

def parse_logs(raw_logs: str):

    events = []

    for line in raw_logs.splitlines():

        line = line.strip()

        failed_match = re.search(
            r"Failed password for (.+?) from ([0-9.]+)",
            line
        )

        if failed_match:

            events.append({
                "event_type": "failed_login",
                "username": failed_match.group(1),
                "source_ip": failed_match.group(2),
                "raw": line
            })

        elif "Accepted password" in line:

            parts = line.split()

            events.append({
                "event_type": "successful_login",
                "username": parts[3],
                "source_ip": parts[-1],
                "raw": line
            })

        elif "mimikatz" in line.lower():

            events.append({
                "event_type": "credential_access",
                "raw": line
            })

        elif "psexec" in line.lower():

            events.append({
                "event_type": "lateral_movement",
                "raw": line
            })

        elif "encryptor" in line.lower():

            events.append({
                "event_type": "ransomware",
                "raw": line
            })

        elif "transferred" in line.lower():

            events.append({
                "event_type": "data_exfiltration",
                "raw": line
            })

        elif "sudo" in line.lower():

            events.append({
                "event_type": "privilege_escalation",
                "raw": line
            })

    return events
