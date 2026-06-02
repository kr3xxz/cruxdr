from fastapi import APIRouter

from app.services.realtime_service import (
    RealtimeService,
)

router = APIRouter()


@router.post("/test-alert")
async def send_test_alert():

    alert = {
        "severity": "high",
        "title": "Brute Force Detected",
        "source_ip": "192.168.1.50",
        "technique": "T1110",
    }

    await RealtimeService.broadcast_alert(
        alert
    )

    return {
        "message": "Alert broadcasted"
    }
