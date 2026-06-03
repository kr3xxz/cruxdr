from time import sleep

from app.detection.rule_loader import load_rules
from app.detection.engine import DetectionEngine

print("[RULE ENGINE STARTED]", flush=True)

while True:

    rules = load_rules()

    for rule in rules:

        DetectionEngine.execute_rule(
            rule
        )

    sleep(30)
