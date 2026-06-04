from fastapi import APIRouter
from app.store.rules import sigma_rules
import os

router = APIRouter()

@router.delete("/rules")

async def clear_rules():

    rules_dir = "app/rules"

    for file in os.listdir(rules_dir):

        if file.endswith(".yaml"):

            os.remove(
                os.path.join(
                    rules_dir,
                    file
                )
            )

    sigma_rules.clear()

    return {
        "message": "All Sigma rules removed"
    }
