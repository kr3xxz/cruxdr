from collections import Counter


def detect_threats(events):
    alerts = []

    failed_logins_by_ip = Counter()
    credential_access_events = []
    execution_events = []
    persistence_events = []
    privilege_escalation_events = []
    lateral_movement_events = []
    exfiltration_events = []
    defense_evasion_events = []

    for event in events:
        etype = event.get("event_type", "")
        if etype == "failed_login":
            failed_logins_by_ip[event.get("source_ip", "unknown")] += 1
        elif etype == "credential_access":
            credential_access_events.append(event)
        elif etype == "execution":
            execution_events.append(event)
        elif etype == "persistence":
            persistence_events.append(event)
        elif etype == "privilege_escalation":
            privilege_escalation_events.append(event)
        elif etype == "lateral_movement":
            lateral_movement_events.append(event)
        elif etype == "data_exfiltration":
            exfiltration_events.append(event)
        elif etype == "defense_evasion":
            defense_evasion_events.append(event)

    for ip, count in failed_logins_by_ip.items():
        if count >= 5:
            alerts.append({
                "alert_type": "SSH Brute Force",
                "severity": "high",
                "source_ip": ip,
                "failed_attempts": count,
                "mitre_attack": "T1110",
                "confidence": 85,
                "message": f"Brute force attack detected: {count} failed logins from {ip}",
            })

    for event in credential_access_events:
        technique_id = event.get("technique_id", "T1003")
        technique_name = event.get("technique_name", "")
        process = event.get("process_name", "")
        target = event.get("target_process_name", "")
        user = event.get("username", "unknown")
        host = event.get("host", "unknown")

        if not technique_name:
            technique_name = f"Credential Access via {process}" if process else "Credential Dumping"

        severity = "critical"
        if "SAM" in (event.get("registry_path", "") or target):
            severity = "critical"
        elif "kerberos" in (technique_id or "").lower():
            severity = "high"

        alerts.append({
            "alert_type": technique_name,
            "severity": severity,
            "mitre_attack": technique_id,
            "technique_name": technique_name,
            "tactic": event.get("tactic", "Credential Access"),
            "confidence": event.get("confidence", 80),
            "raw": event.get("raw", ""),
            "username": user,
            "host": host,
            "source_ip": event.get("source_ip", ""),
            "process": process,
            "target_process": target,
            "message": event.get("message", f"Credential access detected: {technique_name} on {host} by {user}"),
        })

    for event in execution_events:
        technique_id = event.get("technique_id", "")
        technique_name = event.get("technique_name", "")
        process = event.get("process_name", "")
        user = event.get("username", "unknown")
        host = event.get("host", "unknown")

        if not technique_id and process.lower() in ("svchost.exe", "notepad.exe", "explorer.exe", "chrome.exe", "msiexec.exe"):
            continue

        if not technique_name:
            technique_name = f"Suspicious {process}" if process else "Suspicious Process Execution"
            if not technique_id:
                technique_id = "T1204"

        severity = "high"
        if "powershell" in process.lower() and "download" in (event.get("command_line", "") + event.get("message", "")).lower():
            severity = "critical"
            technique_id = "T1059.001"
            technique_name = "Malicious PowerShell Remote Download"

        alerts.append({
            "alert_type": technique_name,
            "severity": severity,
            "mitre_attack": technique_id,
            "technique_name": technique_name,
            "tactic": event.get("tactic", "Execution"),
            "confidence": event.get("confidence", 75),
            "raw": event.get("raw", ""),
            "username": user,
            "host": host,
            "process": process,
            "command_line": event.get("command_line", ""),
            "message": event.get("message", f"Execution detected: {process} ran by {user} on {host}"),
        })

    for event in persistence_events:
        technique_id = event.get("technique_id", "T1547")
        technique_name = event.get("technique_name", "")
        process = event.get("process_name", "")
        user = event.get("username", "unknown")
        host = event.get("host", "unknown")

        if not technique_name:
            technique_name = f"Persistence via {process}" if process else "Persistence Detected"

        alerts.append({
            "alert_type": technique_name,
            "severity": "high",
            "mitre_attack": technique_id,
            "technique_name": technique_name,
            "tactic": event.get("tactic", "Persistence"),
            "confidence": event.get("confidence", 80),
            "raw": event.get("raw", ""),
            "username": user,
            "host": host,
            "process": process,
            "registry_path": event.get("registry_path", ""),
            "message": event.get("message", f"Persistence mechanism detected: {technique_name} on {host}"),
        })

    for event in privilege_escalation_events:
        technique_id = event.get("technique_id", "T1548")
        technique_name = event.get("technique_name", "")
        process = event.get("process_name", "")
        user = event.get("username", "unknown")
        host = event.get("host", "unknown")

        if not technique_name:
            technique_name = f"Privilege Escalation via {process}" if process else "Privilege Escalation Detected"

        alerts.append({
            "alert_type": technique_name,
            "severity": "high",
            "mitre_attack": technique_id,
            "technique_name": technique_name,
            "tactic": event.get("tactic", "Privilege Escalation"),
            "confidence": event.get("confidence", 80),
            "raw": event.get("raw", ""),
            "username": user,
            "host": host,
            "process": process,
            "message": event.get("message", f"Privilege escalation detected: {technique_name} on {host}"),
        })

    for event in lateral_movement_events:
        technique_id = event.get("technique_id", "T1021")
        technique_name = event.get("technique_name", "")
        process = event.get("process_name", "")
        user = event.get("username", "unknown")
        host = event.get("host", "unknown")
        src_ip = event.get("source_ip", "")
        dst_ip = event.get("dest_ip", "")

        if not technique_name:
            technique_name = f"Lateral Movement via {process}" if process else "Lateral Movement Detected"

        alerts.append({
            "alert_type": technique_name,
            "severity": "high",
            "mitre_attack": technique_id,
            "technique_name": technique_name,
            "tactic": event.get("tactic", "Lateral Movement"),
            "confidence": event.get("confidence", 80),
            "raw": event.get("raw", ""),
            "username": user,
            "host": host,
            "process": process,
            "source_ip": src_ip,
            "dest_ip": dst_ip,
            "message": event.get("message", f"Lateral movement detected: {technique_name} from {src_ip} to {dst_ip}"),
        })

    for event in exfiltration_events:
        technique_id = event.get("technique_id", "T1048")
        technique_name = event.get("technique_name", "")
        host = event.get("host", "unknown")

        if not technique_name:
            dns = event.get("dns_query", "")
            technique_name = f"Data Exfiltration via {dns}" if dns else "Data Exfiltration Detected"

        alerts.append({
            "alert_type": technique_name,
            "severity": "critical",
            "mitre_attack": technique_id,
            "technique_name": technique_name,
            "tactic": event.get("tactic", "Exfiltration"),
            "confidence": event.get("confidence", 85),
            "raw": event.get("raw", ""),
            "host": host,
            "dns_query": event.get("dns_query", ""),
            "message": event.get("message", f"Data exfiltration detected: {technique_name} from {host}"),
        })

    for event in defense_evasion_events:
        technique_id = event.get("technique_id", "T1562")
        technique_name = event.get("technique_name", "")
        process = event.get("process_name", "")
        host = event.get("host", "unknown")

        if not technique_name:
            technique_name = f"Defense Evasion via {process}" if process else "Defense Evasion Detected"

        alerts.append({
            "alert_type": technique_name,
            "severity": "critical",
            "mitre_attack": technique_id,
            "technique_name": technique_name,
            "tactic": event.get("tactic", "Defense Evasion"),
            "confidence": event.get("confidence", 85),
            "raw": event.get("raw", ""),
            "host": host,
            "process": process,
            "message": event.get("message", f"Defense evasion detected: {technique_name} on {host}"),
        })

    return alerts
