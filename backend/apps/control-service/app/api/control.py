from fastapi import APIRouter

from app.core.kafka import (
    producer,
)

from app.core.attacks import (
    generate_attack,
)

router = APIRouter()


@router.post(
    "/launch/{attack_type}"
)
async def launch_attack(
    attack_type: str
):

    attack = generate_attack(
        attack_type
    )

    producer.send(
        "cruxdr-logs",
        attack,
    )

    return {
        "status":
        "launched",

        "attack":
        attack,
    }


@router.post(
    "/response/block-ip"
)
async def block_ip():

    return {
        "action":
        "IP blocked",

        "status":
        "success",
    }


@router.post(
    "/response/isolate-host"
)
async def isolate_host():

    return {
        "action":
        "Host isolated",

        "status":
        "success",
    }


@router.post(
    "/response/disable-user"
)
async def disable_user():

    return {
        "action":
        "User disabled",

        "status":
        "success",
    }
