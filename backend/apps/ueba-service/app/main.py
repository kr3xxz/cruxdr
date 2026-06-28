import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ueba import router as ueba_router

from app.core.processor import (
    UEBAProcessor,
)

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

app.include_router(ueba_router)


@app.get("/")
async def root():
    return {
        "service": "CruXDR UEBA Service"
    }


@app.on_event("startup")
async def startup():
    asyncio.create_task(
        UEBAProcessor.start()
    )
    print("[UEBA] Processor started")
