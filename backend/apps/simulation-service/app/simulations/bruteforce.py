import random
from faker import Faker

fake = Faker()


def generate_bruteforce():

    src_ip = f"192.168.1.{random.randint(10, 200)}"

    return {
        "attack_type":
        "brute_force",

        "severity":
        "high",

        "event_type":
        "failed_login",

        "category":
        "authentication",

        "action":
        "login_failed",

        "source_ip":
        src_ip,

        "dest_ip":
        "192.168.1.1",

        "dest_port":
        3389,

        "host":
        fake.hostname(),

        "target_user":
        fake.user_name(),

        "failed_attempts":
        25,

        "mitre_technique":
        "T1110",

        "message":
        "Multiple failed login attempts detected",
    }
