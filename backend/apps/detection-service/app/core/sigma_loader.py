import yaml
from pathlib import Path

def load_sigma_rules():

    rules = []

    for rule_file in Path(
        "/app/app/sigma"
    ).glob("*.yml"):

        with open(rule_file) as f:

            rules.append(
                yaml.safe_load(f)
            )

    return rules
