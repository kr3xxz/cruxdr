from fastapi import APIRouter

router = APIRouter()

@router.get("/rules")
async def get_rules():

    return [
        {
            "name": "Ransomware Detection",
            "severity": "critical",
        },
        {
            "name": "Phishing Detection",
            "severity": "high",
        },
    ]
