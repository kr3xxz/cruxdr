from app.core.opensearch import client

def save_incident(incident):
    client.index(
        index="cruxdr-incidents",
        body=incident
    )
