from fastapi import APIRouter
from opensearchpy import OpenSearch

router = APIRouter()

client = OpenSearch(
    hosts=[{
        "host": "crux-opensearch",
        "port": 9200
    }],
    use_ssl=False,
    verify_certs=False
)

@router.get("/incidents")
async def get_incidents():

    result = client.search(
        index="cruxdr-incidents",
        body={"query":{"match_all":{}}}
    )

    return [
        hit["_source"]
        for hit in result["hits"]["hits"]
    ]
