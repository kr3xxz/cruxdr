from fastapi import APIRouter

from app.data.graph_store import graph_store

router = APIRouter()


@router.get("/graph")
async def get_graph():

    return graph_store[-1] if graph_store else {}
