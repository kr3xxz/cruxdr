from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CruXDR UEBA Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "CruXDR UEBA Service"
    }

@app.get("/risks")
async def risks():

    return [
        {
            "user": "admin",
            "risk_score": 92,
        },
        {
            "user": "guest",
            "risk_score": 77,
        },
    ]

@app.get("/anomalies")
async def anomalies():

    return [
        {
            "user": "john",
            "anomaly": "Impossible Travel",
        },
        {
            "user": "alice",
            "anomaly": "Abnormal Login Time",
        },
    ]
