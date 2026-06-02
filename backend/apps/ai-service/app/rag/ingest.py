import uuid

from app.core.qdrant import client
from app.core.embeddings import model


COLLECTION = "soc-incidents"


def ingest_incident(
    incident,
):

    text = (
        f"Incident: {incident['title']} "
        f"IP: {incident['source_ip']} "
        f"Risk: {incident['risk_score']}"
    )

    vector = model.encode(
        text
    ).tolist()

    client.upsert(
        collection_name=COLLECTION,
        points=[
            {
                "id": str(uuid.uuid4()),
                "vector": vector,
                "payload": incident,
            }
        ],
    )
