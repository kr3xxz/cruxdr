from fastapi import APIRouter

router = APIRouter()

@router.get("/alerts")
async def get_alerts():

    return [
        {
            "title": "Suspicious PowerShell",
            "severity": "high",
        },
        {
            "title": "Ransomware Activity",
            "severity": "critical",
        },
    ]
