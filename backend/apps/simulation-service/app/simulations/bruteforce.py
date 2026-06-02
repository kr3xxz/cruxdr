from faker import Faker

fake = Faker()


def generate_bruteforce():

    return {
        "attack_type":
        "brute_force",

        "severity":
        "high",

        "source_ip":
        fake.ipv4(),

        "target_user":
        fake.user_name(),

        "failed_attempts":
        25,

        "mitre_technique":
        "T1110",

        "message":
        "Multiple failed login attempts detected",
    }
