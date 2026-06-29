import uuid
import random

from shared.seed_data import lookup_user, lookup_host

from app.models.graph_state import (
    graph_nodes,
    graph_edges,
)


class AttackGraphEngine:

    @staticmethod
    def process_attack(attack):
        node_id = str(uuid.uuid4())

        atype = attack.get("attack_type") or attack.get("event_type") or "unknown"
        sev = attack.get("severity", "medium")
        mitre = attack.get("mitre_technique") or attack.get("technique_id") or ""

        username = attack.get("username") or attack.get("user") or ""
        host = attack.get("host") or ""

        user_info = lookup_user.get(username, {})
        host_info = lookup_host.get(host, {})

        node_data = {
            "label": atype,
            "severity": sev,
            "mitre": mitre,
        }
        if user_info:
            node_data["user"] = user_info.get("username", "")
            node_data["department"] = user_info.get("department", "")
            node_data["role"] = user_info.get("role", "")
        if host_info:
            node_data["host"] = host_info["hostname"]
            node_data["host_ip"] = host_info["ip"]
            node_data["host_department"] = host_info.get("department", "")
            node_data["host_role"] = host_info.get("role", "")

        node = {
            "id": node_id,
            "type": atype,
            "data": node_data,
            "position": {
                "x": random.randint(0, 900),
                "y": random.randint(0, 600),
            },
        }

        graph_nodes.append(node)

        if len(graph_nodes) > 1:
            previous = graph_nodes[-2]

            prev_data = previous.get("data", {})
            curr_data = node_data

            prev_dept = prev_data.get("host_department") or prev_data.get("department", "")
            curr_dept = curr_data.get("host_department") or curr_data.get("department", "")

            label_parts = []
            if prev_dept and curr_dept and prev_dept != curr_dept:
                label_parts.append(f"{prev_dept} → {curr_dept}")
            elif prev_dept:
                label_parts.append(prev_dept)

            if curr_data.get("user") or curr_data.get("host"):
                parts = []
                if curr_data.get("user"):
                    parts.append(curr_data["user"])
                if curr_data.get("host"):
                    parts.append(f"@{curr_data['host']}")
                if parts:
                    label_parts.append(" → ".join(parts))

            edge = {
                "id": str(uuid.uuid4()),
                "source": previous["id"],
                "target": node_id,
                "animated": True,
            }
            if label_parts:
                edge["label"] = " · ".join(label_parts)

            graph_edges.append(edge)

        return {
            "nodes": graph_nodes[-30:],
            "edges": graph_edges[-30:],
        }
