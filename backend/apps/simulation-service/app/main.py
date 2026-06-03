from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.simulate import router

app = FastAPI(
    title="CruXDR Simulation Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():

    return {
        "service": "simulation-service"
    }
