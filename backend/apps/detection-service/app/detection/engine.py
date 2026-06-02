from datetime import datetime

from app.core.opensearch import client
from app.core.kafka import producer


class DetectionEngine:

    @staticmethod
    def execute_rule(rule):

        event_action = (
            rule["detection"]["event_action"]
        )

        threshold = (
            rule["detection"]["threshold"]
        )

        query = {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "event.action.keyword":
                                event_action
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "by_ip": {
                    "terms": {
                        "field": "source.ip",
                        "min_doc_count": threshold,
                    }
                }
            }
        }

        response = client.search(
            index="siem-logs-*",
            body=query,
        )

        print(response, flush=True)
        
        

        aggregations = response.get(
            "aggregations",
            {}
        )

        if not aggregations:

            print(
                "[!] No aggregations returned",
                flush=True
            )

            return

        buckets = aggregations.get(
            "by_ip",
            {}
        ).get(
            "buckets",
            []
        )

        for bucket in buckets:

            alert = {
                "title": rule["title"],
                "severity": rule["severity"],
                "source_ip": bucket["key"],
                "count": bucket["doc_count"],
                "technique":
                rule["mitre"]["technique"],
                "tactic":
                rule["mitre"]["tactic"],
                "timestamp":
                datetime.utcnow().isoformat(),
            }

            producer.send(
                "siem-alerts",
                alert,
            )

            print(
                f"[ALERT] {alert}"
            )
