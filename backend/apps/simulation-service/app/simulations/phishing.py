from faker import Faker

fake = Faker()


def generate_phishing():

    return {
        "attack_type":
        "phishing",

        "severity":
        "medium",

        "event_type":
        "execution",

        "category":
        "process",

        "action":
        "url_click",

        "process_name":
        "outlook.exe",

        "host":
        fake.hostname(),

        "source_ip":
        "10.0.0.50",

        "dest_ip":
        "185.220.101.20",

        "dest_port":
        443,

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
