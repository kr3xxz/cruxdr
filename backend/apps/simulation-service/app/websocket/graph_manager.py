from typing import List

from fastapi import WebSocket


class GraphConnectionManager:

    def __init__(self):

        self.connections: List[
            WebSocket
        ] = []

    async def connect(
        self,
        websocket: WebSocket,
    ):

        await websocket.accept()

        self.connections.append(
            websocket
        )

    def disconnect(
        self,
        websocket: WebSocket,
    ):

        self.connections.remove(
            websocket
        )

    async def broadcast(
        self,
        payload,
    ):

        for connection in (
            self.connections
        ):

            await connection.send_json(
                payload
            )


graph_manager = (
    GraphConnectionManager()
)
