import os
import yaml


RULES_PATH = "app/rules"


def load_rules():

    rules = []

    for filename in os.listdir(
        RULES_PATH
    ):

        if filename.endswith(".yml"):

            path = os.path.join(
                RULES_PATH,
                filename,
            )

            with open(path, "r") as f:

                rules.append(
                    yaml.safe_load(f)
                )

    return rules
