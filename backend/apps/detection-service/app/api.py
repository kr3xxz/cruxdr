from fastapi import FastAPI
from app.core.state import INCIDENTS

app = FastAPI()

@app.get("/incidents")
async def get_incidents():
    return INCIDENTS
