from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.control import router as control_router
from app.api.alerts import router as alerts_router

app = FastAPI(
    title="CruXDR Control Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    control_router,
    prefix="/api",
)

app.include_router(
    alerts_router,
    prefix="/api",
)

@app.get("/")
async def root():

    return {
        "service": "control-service"
    }
