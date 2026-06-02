import os
import yaml

from app.store.rules import (
    sigma_rules,
)


class SigmaLoader:

    @staticmethod
    def load_rules():

        rules_path = (
            "app/rules"
        )

        for file in os.listdir(
            rules_path
        ):

            if file.endswith(
                ".yaml"
            ):

                with open(
                    f"{rules_path}/{file}",
                    "r",
                ) as f:

                    rule = yaml.safe_load(
                        f
                    )

                    sigma_rules.append(
                        rule
                    )

                    print(
                        f"[RULE LOADED] {rule['title']}"
                    )
