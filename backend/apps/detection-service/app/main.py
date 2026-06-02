from fastapi.middleware.cors import CORSMiddleware
import time
import schedule

from app.detection.rule_loader import (
    load_rules,
)

from app.detection.engine import (
    DetectionEngine,
)

rules = load_rules()


def run_detection_cycle():

    print(
        "[*] Running detection cycle...",flush=True
    )

    for rule in rules:

        try:

            DetectionEngine.execute_rule(
                rule
            )

        except Exception as e:

            print(
                f"[ERROR] {e}",flush=True
            )


schedule.every(30).seconds.do(
    run_detection_cycle
)

print(
    "[*] Detection service started...",flush=True
)

run_detection_cycle()

while True:

    schedule.run_pending()

    time.sleep(1)
