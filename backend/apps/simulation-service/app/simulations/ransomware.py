from faker import Faker

fake = Faker()


def generate_ransomware():

    return {
        "attack_type":
        "ransomware",

        "severity":
        "critical",

        "event_type":
        "impact",

        "category":
        "file",

        "action":
        "file_modified",

        "host":
        fake.hostname(),

        "encrypted_files":
        1280,

        "extension":
        ".locked",

        "mitre_technique":
        "T1486",

        "message":
        "Mass file encryption activity detected",
    }
