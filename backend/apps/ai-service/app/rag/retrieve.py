from app.core.qdrant import client
from app.core.embeddings import model

COLLECTION = "soc-incidents"


def retrieve_context(
    query: str,
):

    vector = model.encode(
        query
    ).tolist()

    results = client.search(
        collection_name=COLLECTION,
        query_vector=vector,
        limit=3,
    )

    return [
        r.payload
        for r in results
    ]
