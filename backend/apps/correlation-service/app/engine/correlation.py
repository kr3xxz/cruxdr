import time
import uuid

from app.models.entity_tracker import (
    entity_events,
    correlated_incidents,
)

from app.engine.risk_engine import (
    RiskEngine,
)

from app.engine.mitre_chain import (
    MitreChainEngine,
)


class CorrelationEngine:

    @staticmethod
    def process(event):

        event = (
            MitreChainEngine.enrich(
                event
            )
        )

        entity = (
            event.get("source_ip")
            or event.get("target_user")
            or "unknown"
        )

        if entity not in entity_events:

            entity_events[entity] = []

        entity_events[entity].append(
            {
                "timestamp":
                time.time(),

                "event":
                event,
            }
        )

        recent = []

        now = time.time()

        for item in (
            entity_events[entity]
        ):

            if (
                now
                - item["timestamp"]
            ) < 120:

                recent.append(
                    item["event"]
                )

        entity_events[entity] = [
            {
                "timestamp":
                now,

                "event":
                e,
            }
            for e in recent
        ]

        attack_types = [
            e["attack_type"]
            for e in recent
        ]

        incident = None

        if (
            "brute_force"
            in attack_types
            and len(recent) >= 3
        ):

            incident = {
                "id":
                str(uuid.uuid4()),

                "title":
                "Credential Attack Campaign",

                "entity":
                entity,

                "severity":
                "critical",

                "risk_score":
                RiskEngine.calculate(
                    recent
                ),

                "events":
                recent,

                "mitre_tactics":
                list(set([
                    e["mitre_tactic"]
                    for e in recent
                ])),
            }

        elif (
            "phishing"
            in attack_types
            and "ransomware"
            in attack_types
        ):

            incident = {
                "id":
                str(uuid.uuid4()),

                "title":
                "Phishing to Ransomware Chain",

                "entity":
                entity,

                "severity":
                "critical",

                "risk_score":
                95,

                "events":
                recent,

                "mitre_tactics":
                list(set([
                    e["mitre_tactic"]
                    for e in recent
                ])),
            }

        if incident:

            correlated_incidents.insert(
                0,
                incident,
            )

            del correlated_incidents[100:]

            return incident

        return None
