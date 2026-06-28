import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.rules import router
from app.api.logs import router as logs_router
from app.api.upload import router as upload_router
from app.api.clear_rules import router as clear_rules_router
from app.api.detect import router as detect_router

from app.core.processor import SigmaProcessor
from app.core.loader import SigmaLoader


app = FastAPI(
    title="CruXDR Sigma Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(logs_router)
app.include_router(upload_router)
app.include_router(clear_rules_router)
app.include_router(detect_router)


@app.on_event("startup")
async def startup():

    print("[*] STARTUP EVENT FIRED")

    SigmaLoader.load_rules()

    asyncio.create_task(
        SigmaProcessor.start()
    )

    print("[*] SIGMA TASK CREATED")


@app.get("/")
async def root():

    return {
        "service": "sigma-service"
    }
