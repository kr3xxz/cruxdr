from app.websocket.manager import (
    manager,
)


class RealtimeService:

    @staticmethod
    async def broadcast_alert(
        alert_data: dict,
    ):

        await manager.broadcast(
            {
                "type": "alert",
                "data": alert_data,
            }
        )

    @staticmethod
    async def broadcast_incident(
        incident_data: dict,
    ):

        await manager.broadcast(
            {
                "type": "incident",
                "data": incident_data,
            }
        )

    @staticmethod
    async def broadcast_metric(
        metric_data: dict,
    ):

        await manager.broadcast(
            {
                "type": "metric",
                "data": metric_data,
            }
        )
