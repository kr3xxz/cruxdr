import re

def parse_logs(raw_logs: str):
    events = []

    for line in raw_logs.splitlines():

        failed_match = re.search(
            r"Failed password for (.+?) from ([0-9.]+)",
            line
        )

        if failed_match:

            user = failed_match.group(1)
            ip = failed_match.group(2)

            events.append({
                "event_type": "failed_login",
                "username": user,
                "source_ip": ip,
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

    return events
