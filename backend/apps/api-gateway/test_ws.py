import asyncio
import websockets
import json


async def main():

    uri = "ws://localhost:8000/ws/alerts"

    async with websockets.connect(
        uri
    ) as websocket:

        print(
            "Connected to websocket..."
        )

        while True:

            data = await websocket.recv()

            print(
                json.loads(data)
            )


asyncio.run(main())
