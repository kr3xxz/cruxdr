from datetime import datetime
import random


class LogGenerator:

    @staticmethod
    def ransomware():

        return [
            {
                "timestamp": str(datetime.utcnow()),
                "host": "FINANCE-PC-01",
                "user": "john.doe",
                "event_id": 4688,
                "process_name": "winword.exe",
                "parent_process": "explorer.exe",
                "severity": "medium",
                "message": "Microsoft Word opened suspicious document",
            },

            {
                "timestamp": str(datetime.utcnow()),
                "host": "FINANCE-PC-01",
                "user": "john.doe",
                "event_id": 4688,
                "process_name": "powershell.exe",
                "parent_process": "winword.exe",
                "command_line": "Invoke-WebRequest malware.exe",
                "severity": "high",
                "message": "PowerShell spawned from Word",
            },

            {
                "timestamp": str(datetime.utcnow()),
                "host": "FINANCE-PC-01",
                "user": "john.doe",
                "event_id": 11,
                "file_name": "invoice_data.locked",
                "severity": "critical",
                "message": "Mass file encryption detected",
            },
        ]

    @staticmethod
    def brute_force():

        logs = []

        for i in range(10):

            logs.append(
                {
                    "timestamp": str(datetime.utcnow()),
                    "host": "DC-01",
                    "user": "administrator",
                    "event_id": 4625,
                    "source_ip": f"192.168.1.{random.randint(10,200)}",
                    "severity": "high",
                    "message": "Failed login attempt",
                }
            )

        return logs

    @staticmethod
    def exfiltration():

        return [
            {
                "timestamp": str(datetime.utcnow()),
                "host": "HR-PC-03",
                "user": "alice",
                "event_id": 3,
                "destination_ip": "185.220.101.45",
                "bytes_sent": 500000000,
                "severity": "critical",
                "message": "Large outbound transfer detected",
            }
        ]
