from app.data.graph_store import graph_store


class GraphBuilder:

    @staticmethod
    def build(alert):

        event = alert["event"]

        user = event.get(
            "user",
            "unknown-user"
        )

        host = event.get(
            "host",
            "unknown-host"
        )

        process = (
            event.get("process_name")
            or event.get("file_name")
            or event.get("command_line")
            or event.get("message")
            or "unknown-process"
        )

        nodes = [
            {
                "id": user,
                "type": "user"
            },

            {
                "id": host,
                "type": "host"
            },

            {
                "id": process,
                "type": "process"
            }
        ]

        edges = [
            {
                "source": user,
                "target": host
            },

            {
                "source": host,
                "target": process
            }
        ]

        graph = {
            "title": alert.get("title"),
            "nodes": nodes,
            "edges": edges,
        }

        graph_store.append(graph)

        graph_store[:] = graph_store[-30:]

        return graph
