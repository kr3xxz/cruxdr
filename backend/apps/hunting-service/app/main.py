from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.hunt import router as hunt_router

app = FastAPI(
    title="CruXDR Hunting Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hunt_router)

@app.get("/")
async def root():
    return {
        "service": "CruXDR Hunting Service"
    }

