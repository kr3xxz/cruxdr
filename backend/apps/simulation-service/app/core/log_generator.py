from datetime import datetime
import random


class LogGenerator:

    @staticmethod
    def ransomware():

        return [
            {
                "timestamp": str(datetime.utcnow()),
                "attack_type": "ransomware",
                "mitre_technique": "T1486",
                "host": "FINANCE-PC-01",
                "user": "john.doe",
                "event_id": 4688,
                "process_name": "winword.exe",
                "parent_process": "explorer.exe",
                "severity": "medium",
                "message": "Microsoft Word opened suspicious document (T1003.001-lsass detection)",
                "raw": "EventID=4688 procdump lsass detection",
            },
            {
                "timestamp": str(datetime.utcnow()),
                "attack_type": "ransomware",
                "mitre_technique": "T1486",
                "host": "FINANCE-PC-01",
                "user": "john.doe",
                "event_id": 4688,
                "process_name": "powershell.exe",
                "parent_process": "winword.exe",
                "command_line": "Invoke-WebRequest malware.exe",
                "severity": "high",
                "message": "DownloadString http://malicious-payload.xyz detected",
                "raw": "EventID=4688 PowerShell DownloadString execution",
            },
            {
                "timestamp": str(datetime.utcnow()),
                "attack_type": "ransomware",
                "mitre_technique": "T1486",
                "host": "FINANCE-PC-01",
                "user": "john.doe",
                "event_id": 11,
                "file_name": "invoice_data.locked",
                "severity": "critical",
                "message": "Mass file encryption detected via procdump",
                "raw": "EventID=11 procdump T1003.001-lsass file encryption",
            },
        ]

    @staticmethod
    def brute_force():

        logs = []

        for i in range(10):

            logs.append(
                {
                    "timestamp": str(datetime.utcnow()),
                    "attack_type": "brute_force",
                    "mitre_technique": "T1110",
                    "host": "DC-01",
                    "user": "administrator",
                    "event_id": 4625,
                    "source_ip": f"192.168.1.{random.randint(10,200)}",
                    "severity": "high",
                    "message": f"RDP brute force authentication failure from 192.168.1.{random.randint(10,200)}",
                    "raw": "EventID=4625 T1021.001-rdp RDP brute authentication failure",
                }
            )

        return logs

    @staticmethod
    def phishing():

        return [
            {
                "timestamp": str(datetime.utcnow()),
                "attack_type": "phishing",
                "mitre_technique": "T1566",
                "host": "MAIL-SERVER-01",
                "user": "victim.user",
                "event_id": 4104,
                "severity": "high",
                "message": "User clicked malicious phishing link via Outlook Web Access",
                "raw": "EventID=4104 phishing link click detected",
                "url": "http://evil-phishing-site.com",
            }
        ]

    @staticmethod
    def lateral_movement():

        return [
            {
                "timestamp": str(datetime.utcnow()),
                "attack_type": "lateral_movement",
                "mitre_technique": "T1021",
                "host": "SERVER-01",
                "user": "administrator",
                "event_id": 4624,
                "severity": "high",
                "message": "PsExec service remote execution detected on SERVER-01",
                "tool": "PsExec",
                "raw": "EventID=4624 T1021.002-psexec PsExec service lateral movement",
            }
        ]

    @staticmethod
    def exfiltration():

        return [
            {
                "timestamp": str(datetime.utcnow()),
                "attack_type": "exfiltration",
                "mitre_technique": "T1048",
                "host": "HR-PC-03",
                "user": "alice",
                "event_id": 3,
                "destination_ip": "185.220.101.45",
                "bytes_sent": 500000000,
                "severity": "critical",
                "message": "Large outbound transfer detected via DNS tunnel exfiltration",
                "raw": "EventID=3 T1048.003-dns DNS tunnel data exfiltration",
            }
        ]

    @staticmethod
    def phishing():

        return [
            {
                "timestamp": str(datetime.utcnow()),
                "host": "MAIL-SERVER-01",
                "user": "victim.user",
                "event_id": 4104,
                "severity": "high",
                "message": "User clicked malicious phishing link",
                "url": "http://evil-phishing-site.com",
            }
        ]

    @staticmethod
    def lateral_movement():

        return [
            {
                "timestamp": str(datetime.utcnow()),
                "host": "SERVER-01",
                "user": "administrator",
                "event_id": 4624,
                "severity": "high",
                "message": "PsExec remote execution detected",
                "tool": "PsExec",
            }
        ]
