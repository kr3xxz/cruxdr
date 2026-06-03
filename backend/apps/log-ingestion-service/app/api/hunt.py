from fastapi import APIRouter
from app.core.indexer import client, INDEX_NAME

router = APIRouter()

@router.get("/hunt")
async def hunt(q: str):

    result = client.search(
        index=INDEX_NAME,
        body={
            "query": {
                "query_string": {
                    "query": q
                }
            }
        }
    )

    return [
        hit["_source"]
        for hit in result["hits"]["hits"]
    ]
