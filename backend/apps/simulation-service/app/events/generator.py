import asyncio
import random

from app.simulations.bruteforce import (
    generate_bruteforce,
)

from app.simulations.ransomware import (
    generate_ransomware,
)

from app.simulations.phishing import (
    generate_phishing,
)

from app.core.kafka import producer

from app.websocket.manager import (
    manager,
)

from app.graph.engine import (
    AttackGraphEngine,
)

from app.websocket.graph_manager import (
    graph_manager,
)


class AttackGenerator:

    @staticmethod
    async def start():

        attacks = [
            generate_bruteforce,
            generate_ransomware,
            generate_phishing,
        ]

        while True:

            try:

                attack = random.choice(
                    attacks
                )()

                producer.send(
                    "siem-events",
                    attack,
                )

                graph = (
                    AttackGraphEngine
                    .process_attack(
                        attack
                    )
                )

                await manager.broadcast(
                    attack
                )

                await graph_manager.broadcast(
                    graph
                )

                print(
                    f"[ATTACK] {attack}",
                    flush=True,
                )

            except Exception as e:

                print(
                    f"[ERROR] {e}",
                    flush=True,
                )

            await asyncio.sleep(2)
