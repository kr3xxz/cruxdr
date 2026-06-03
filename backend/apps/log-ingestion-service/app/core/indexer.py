from opensearchpy import OpenSearch

client = OpenSearch(
    hosts=[{
        "host": "opensearch",
        "port": 9200
    }],
    http_compress=True,
    use_ssl=False,
    verify_certs=False
)

INDEX_NAME = "cruxdr-telemetry"

def index_event(event):

    client.index(
        index=INDEX_NAME,
        body=event
    )
