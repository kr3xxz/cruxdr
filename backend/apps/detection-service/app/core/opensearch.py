import time

from opensearchpy import OpenSearch

client = None

while client is None:

    try:

        client = OpenSearch(
            hosts=[
                {
                    "host": "opensearch",
                    "port": 9200,
                }
            ],
            http_compress=True,
            use_ssl=False,
            verify_certs=False,
            ssl_assert_hostname=False,
            ssl_show_warn=False,
        )

        client.info()

        print(
            "[*] Connected to OpenSearch",
            flush=True
        )

    except Exception:

        print(
            "[!] OpenSearch not ready, retrying...",
            flush=True
        )

        time.sleep(5)
