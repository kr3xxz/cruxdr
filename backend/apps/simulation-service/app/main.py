import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.simulate import router
from app.api.ws import router as ws_router
from app.events.generator import AttackGenerator


@asynccontextmanager
async def lifespan(app: FastAPI):
    # task = asyncio.create_task(AttackGenerator.start())
    yield
    # task.cancel()
    # try:
    #     await task
    # except asyncio.CancelledError:
    #     pass


app = FastAPI(
    title="CruXDR Simulation Service",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(ws_router)

@app.get("/")
async def root():

    return {
        "service": "simulation-service"
    }
