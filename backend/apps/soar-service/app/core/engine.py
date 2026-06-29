from app.data.store import responses_store
from app.services.firewall import FirewallService
from shared.seed_data import lookup_user, lookup_host


class SOAREngine:

    @staticmethod
    async def execute(incident):
        actions = []
        title = incident.get("title", "").lower()

        username = incident.get("user") or incident.get("username") or ""
        hostname = incident.get("host") or ""
        source_ip = incident.get("source_ip") or incident.get("iocs", [None])[0] if incident.get("iocs") else ""

        user_info = lookup_user.get(username, {})
        host_info = lookup_host.get(hostname, {})

        identity = {}
        if user_info:
            identity["user"] = {
                "name": user_info.get("username", ""),
                "department": user_info.get("department", ""),
                "role": user_info.get("role", ""),
                "domain": user_info.get("domain", ""),
            }
        if host_info:
            identity["host"] = {
                "name": host_info["hostname"],
                "department": host_info.get("department", ""),
                "role": host_info.get("role", ""),
                "ip": host_info["ip"],
                "os": host_info.get("os", ""),
            }

        if "ransomware" in title:
            actions = [
                {"action": "isolate_host", "target": hostname or source_ip, "status": "executed"},
                {"action": "disable_user", "target": username, "status": "executed"},
            ]
        elif "brute" in title:
            target_ip = source_ip or "unknown"
            await FirewallService.block_ip(target_ip)
            actions = [
                {"action": "block_ip", "target": target_ip, "status": "executed"},
            ]
        elif "exfiltration" in title:
            actions = [
                {"action": "terminate_connection", "target": hostname or source_ip, "status": "executed"},
            ]

        response = {
            "incident": incident.get("title"),
            "actions": actions,
        }
        if identity:
            response["identity"] = identity

        responses_store.append(response)
        responses_store[:] = responses_store[-50:]

        return response
