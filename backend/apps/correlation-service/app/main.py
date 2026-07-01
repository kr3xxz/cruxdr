import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.incidents import router
from app.api.graph import router as graph_router

from app.core.processor import IncidentProcessor

app = FastAPI(
    title="CruXDR Correlation Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(graph_router)


@app.on_event("startup")
async def startup():
    print("[*] CORRELATION STARTUP EVENT FIRED", flush=True)
    asyncio.ensure_future(
        IncidentProcessor.start()
    )
    print("[*] CORRELATION TASK SCHEDULED", flush=True)


@app.get("/")
async def root():

    return {
        "service":
            "correlation-service"
    }
