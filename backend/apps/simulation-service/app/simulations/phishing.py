from faker import Faker

fake = Faker()


def generate_phishing():

    return {
        "attack_type":
        "phishing",

        "severity":
        "medium",

        "sender":
        fake.email(),

        "target":
        fake.email(),

        "malicious_link":
        fake.url(),

        "mitre_technique":
        "T1566",

        "message":
        "Phishing email detected",
    }
