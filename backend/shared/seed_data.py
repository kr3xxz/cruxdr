DEPARTMENTS = {
    "IT":          {"criticality": "critical", "hosts": ["DC-01", "SIEM-01"]},
    "Finance":     {"criticality": "critical", "hosts": ["FINANCE-PC-01"]},
    "Executive":   {"criticality": "critical", "hosts": ["EXEC-LAP-01"]},
    "Engineering": {"criticality": "high",     "hosts": ["DEV-OPS-01"]},
}

USERS = [
    {"username": "admin",      "department": "IT",          "role": "Domain Admin",     "host": "DC-01",       "domain": "CORP"},
    {"username": "lisa.anderson", "department": "IT",       "role": "Security Analyst", "host": "SIEM-01",     "domain": "CORP"},
    {"username": "bob.johnson", "department": "Finance",     "role": "CFO",              "host": "FINANCE-PC-01", "domain": "CORP"},
    {"username": "carol.davis", "department": "Finance",     "role": "Accountant",       "host": "FINANCE-PC-01", "domain": "CORP"},
    {"username": "ceo",         "department": "Executive",   "role": "Chief Executive",  "host": "EXEC-LAP-01", "domain": "CORP"},
    {"username": "john.doe",    "department": "Engineering", "role": "DevOps Lead",      "host": "DEV-OPS-01",  "domain": "CORP"},
]

HOSTS = [
    {"hostname": "DC-01",          "ip": "10.0.1.5",   "department": "IT",          "role": "Domain Controller",  "os": "Windows Server 2022"},
    {"hostname": "SIEM-01",        "ip": "10.0.0.10",  "department": "IT",          "role": "SIEM Collector",     "os": "Ubuntu 24.04"},
    {"hostname": "FINANCE-PC-01",  "ip": "10.0.0.45",  "department": "Finance",     "role": "Finance Workstation","os": "Windows 11 Enterprise"},
    {"hostname": "EXEC-LAP-01",    "ip": "10.0.0.100", "department": "Executive",   "role": "Executive Laptop",   "os": "Windows 11 Enterprise"},
    {"hostname": "DEV-OPS-01",     "ip": "10.0.0.55",  "department": "Engineering", "role": "Build Server",       "os": "Ubuntu 24.04"},
]

lookup_user = {u["username"]: u for u in USERS}
lookup_host = {h["hostname"]: h for h in HOSTS}


def users_by_department(dept):
    return [u for u in USERS if u["department"] == dept]


def hosts_by_department(dept):
    return [h for h in HOSTS if h["department"] == dept]
