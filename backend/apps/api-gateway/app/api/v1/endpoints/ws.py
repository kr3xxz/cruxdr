from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.websocket.manager import (
    manager,
)

router = APIRouter()


@router.websocket("/alerts")
async def websocket_alerts(
    websocket: WebSocket,
):

    await manager.connect(websocket)

    try:

        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:

        manager.disconnect(websocket)
