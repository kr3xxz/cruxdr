import re


def _extract(pattern: str, text: str, default: str = "") -> str:
    m = re.search(pattern, text, re.I)
    return m.group(1) if m else default


def _has(text: str, *keywords: str) -> bool:
    lower = text.lower()
    return all(kw.lower() in lower for kw in keywords)


TACTIC_MAP = {
    "CREDENTIAL_ACCESS": "credential_access",
    "EXECUTION": "execution",
    "PERSISTENCE": "persistence",
    "PRIVILEGE_ESCALATION": "privilege_escalation",
    "DEFENSE_EVASION": "defense_evasion",
    "LATERAL_MOVEMENT": "lateral_movement",
    "EXFILTRATION": "data_exfiltration",
}


PARSERS = [

    {
        "type": "tactic_tag",
        "check": lambda line: any(t in line.upper() for t in TACTIC_MAP),
        "extract": lambda line: {
            "event_type": next(
                TACTIC_MAP[t] for t in TACTIC_MAP if t in line.upper()
            ),
            "host": (
                _extract(r"(?:on\s+host\s+|from\s+host\s+)(\S+)", line)
                or _extract(r"from\s+(\w+(?:-\w+)*)\s*\(", line)
            ),
            "username": (
                _extract(r"(?:^|[\s/])user[=:]\s*(NT\s+AUTHORITY\\\S+)", line)
                or _extract(r"(?:^|[\s/])user[=:]\s*(\S+)", line)
                or _extract(r"subject:\s*(\S+)", line)
                or _extract(r"by\s+([A-Za-z]+\\.\S+)", line)
                or _extract(r"Users\\(\S+?)\\", line)
            ),
            "source_ip": (
                _extract(r"from\s+IP\s+(\d+\.\d+\.\d+\.\d+)", line)
                or _extract(r"from\s+(\d+\.\d+\.\d+\.\d+)", line)
                or _extract(r"\(\s*(\d+\.\d+\.\d+\.\d+)\s*\)", line)
            ),
            "raw": line,
        },
        "stop": True,
    },

    {
        "type": "failed_login",
        "check": lambda line: "4625" in line or _has(line, "failed logon"),
        "extract": lambda line: {
            "username": (
                _extract(r"user[=:](\S+)", line)
                or _extract(r"user\s+(\S+)", line)
                or "unknown"
            ),
            "source_ip": _extract(r"from\s+IP\s+(\d+\.\d+\.\d+\.\d+)", line)
                        or _extract(r"from\s+([0-9.]+)", line, "0.0.0.0"),
            "raw": line,
        },
    },
    {
        "type": "lateral_movement",
        "check": lambda line: "4624" in line or "7045" in line or _has(line, "service creation") or _has(line, "psexec"),
        "extract": lambda line: {
            "username": (
                _extract(r"by\s+(\S+)", line)
                or _extract(r"user[=:](\S+)", line)
                or _extract(r"user\s+(\S+)", line)
                or "unknown"
            ),
            "host": _extract(r"on\s+host\s+(\S+)", line)
                  or _extract(r"on\s+(\S+)", line, "unknown"),
            "source_ip": _extract(r"from\s+(\d+\.\d+\.\d+\.\d+)", line),
            "raw": line,
        },
    },
    {
        "type": "ransomware",
        "check": lambda line: _has(line, ".locker", "encrypted"),
        "extract": lambda line: {
            "host": _extract(r"on\s+(\S+)", line, "unknown"),
            "raw": line,
        },
    },
    {
        "type": "phishing",
        "check": lambda line: _has(line, "phishing campaign", "malicious url"),
        "extract": lambda line: {
            "username": _extract(r"user\s+(\S+)", line, "unknown"),
            "raw": line,
        },
    },
    {
        "type": "data_exfiltration",
        "check": lambda line: _has(line, "large data transfer", "external ip"),
        "extract": lambda line: {
            "host": _extract(r"from\s+(\S+)", line, "unknown"),
            "raw": line,
        },
    },
    {
        "type": "privilege_escalation",
        "check": lambda line: _has(line, "4672", "special privilege"),
        "extract": lambda line: {
            "username": _extract(r"user\s+(\S+)", line, "unknown"),
            "raw": line,
        },
    },
    {
        "type": "credential_access",
        "check": lambda line: _has(line, "lsass", "dump"),
        "extract": lambda line: {
            "host": _extract(r"(?:on\s+host\s+|from\s+host\s+)(\S+)", line),
            "username": (
                _extract(r"user[=:](\S+)", line)
                or _extract(r"by\s+(\S+)", line)
            ),
            "source_ip": _extract(r"from\s+IP\s+(\d+\.\d+\.\d+\.\d+)", line),
            "raw": line,
        },
    },

    {
        "type": "failed_login",
        "check": lambda line: bool(re.search(r"Failed password for (.+?) from ([0-9.]+)", line)),
        "extract": lambda line: {
            "username": _extract(r"Failed password for (.+?) from ([0-9.]+)", line, "unknown"),
            "source_ip": _extract(r"from\s+([0-9.]+)", line, "0.0.0.0"),
            "raw": line,
        },
    },
    {
        "type": "successful_login",
        "check": lambda line: "Accepted password" in line,
        "extract": lambda line: {
            "raw": line,
        },
    },
]


def parse_logs(raw_logs: str):
    events = []

    for line in raw_logs.splitlines():
        line = line.strip()
        if not line:
            continue

        for parser in PARSERS:
            if parser["check"](line):
                extracted = parser["extract"](line)
                event = {
                    "event_type": extracted.pop("event_type", parser["type"]),
                }
                event.update(extracted)
                events.append(event)
                break

    return events
