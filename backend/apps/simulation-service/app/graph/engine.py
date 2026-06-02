import uuid
import random

from app.models.graph_state import (
    graph_nodes,
    graph_edges,
)


class AttackGraphEngine:

    @staticmethod
    def process_attack(
        attack,
    ):

        node_id = str(
            uuid.uuid4()
        )

        node = {
            "id": node_id,

            "type":
            attack["attack_type"],

            "data": {
                "label":
                attack["attack_type"],

                "severity":
                attack["severity"],

                "mitre":
                attack["mitre_technique"],
            },

            "position": {
                "x":
                random.randint(0, 900),

                "y":
                random.randint(0, 600),
            },
        }

        graph_nodes.append(
            node
        )

        if len(graph_nodes) > 1:

            previous = graph_nodes[-2]

            edge = {
                "id":
                str(uuid.uuid4()),

                "source":
                previous["id"],

                "target":
                node_id,

                "animated":
                True,
            }

            graph_edges.append(
                edge
            )

        return {
            "nodes":
            graph_nodes[-30:],

            "edges":
            graph_edges[-30:],
        }
