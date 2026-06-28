from app.data.graph_store import graph_store


class GraphBuilder:

    @staticmethod
    def build(alert):

        event = alert["event"]

        user = (
            event.get("user")
            or event.get("username")
            or "unknown-user"
        )

        host = (
            event.get("host")
            or "unknown-host"
        )

        victim = (
            event.get("target_user")
            or event.get("username")
            or user
        )

        source_ip = (
            event.get("source_ip")
            or ""
        )

        process = (
            event.get("process_name")
            or event.get("file_name")
            or event.get("command_line")
            or event.get("message")
            or "unknown-process"
        )

        severity = alert.get("severity", "medium")

        mitre = alert.get("mitre_attack") or ""

        nodes = [
            {
                "id": victim,
                "type": "victim",
                "label": "Victim",
                "severity": severity,
                "mitre": mitre,
            },
            {
                "id": host,
                "type": "host",
                "label": "Host",
                "severity": severity,
                "mitre": mitre,
            },
            {
                "id": process,
                "type": "process",
                "label": "Process",
                "severity": severity,
                "mitre": mitre,
            },
        ]

        if source_ip:
            nodes.insert(0, {
                "id": source_ip,
                "type": "source",
                "label": "Source IP",
                "severity": severity,
                "mitre": mitre,
            })

        edges = [
            {"source": nodes[0]["id"], "target": nodes[1]["id"]},
            {"source": nodes[1]["id"], "target": nodes[2]["id"]},
        ]

        if source_ip and len(nodes) > 3:
            edges.append({
                "source": source_ip,
                "target": victim,
            })

        graph = {
            "title": alert.get("title"),
            "nodes": nodes,
            "edges": edges,
            "severity": severity,
            "mitre": mitre,
        }

        graph_store.append(graph)
        graph_store[:] = graph_store[-30:]

        return graph
