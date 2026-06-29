import re

from app.store.rules import sigma_rules


def _get_nested(d: dict, path: str, default=""):
    if path in d:
        val = d[path]
        if isinstance(val, (dict, list)):
            return default
        return str(val) if val is not None else default
    parts = path.split(".")
    val = d
    for p in parts:
        if isinstance(val, dict):
            val = val.get(p, {})
        else:
            return default
    if isinstance(val, (dict, list)):
        return default
    return str(val) if val is not None else default


def _match_condition(rule_condition: str, event: dict, selection_matches: dict) -> bool:
    if not rule_condition:
        return any(selection_matches.values())

    if rule_condition.startswith("all of "):
        prefix = rule_condition.replace("all of ", "").replace("*", "")
        keys = [k for k in selection_matches if k.startswith(prefix)]
        return all(selection_matches.get(k, False) for k in keys)

    if rule_condition.startswith("any of "):
        prefix = rule_condition.replace("any of ", "").replace("*", "")
        keys = [k for k in selection_matches if k.startswith(prefix)]
        return any(selection_matches.get(k, False) for k in keys)

    if " and " in rule_condition:
        parts = rule_condition.split(" and ")
        return all(selection_matches.get(p.strip(), False) for p in parts)

    if " or " in rule_condition:
        parts = rule_condition.split(" or ")
        return any(selection_matches.get(p.strip(), False) for p in parts)

    return selection_matches.get(rule_condition.strip(), False)


def _match_selection(selection: dict, event: dict) -> bool:
    for field, pattern in selection.items():
        value = _get_nested(event, field).lower()

        if isinstance(pattern, list):
            if not any(str(p).lower() in value for p in pattern):
                return False
        elif isinstance(pattern, str):
            if pattern.startswith("re:"):
                try:
                    if not re.search(pattern[3:], value, re.I):
                        return False
                except re.error:
                    return False
            elif pattern.startswith("contains|"):
                parts = pattern[9:].split("|")
                if not any(p.lower() in value for p in parts):
                    return False
            elif pattern.startswith("endswith|"):
                suffix = pattern[9:].lower()
                if not value.endswith(suffix):
                    return False
            elif pattern.startswith("startswith|"):
                prefix = pattern[11:].lower()
                if not value.startswith(prefix):
                    return False
            elif "*" in pattern:
                pattern_parts = pattern.lower().split("*")
                idx = 0
                for part in pattern_parts:
                    if not part:
                        continue
                    idx = value.find(part, idx)
                    if idx == -1:
                        return False
                    idx += len(part)
            else:
                if pattern.lower() not in value:
                    return False
        else:
            return False
    return True


def _normalize_event(event: dict) -> dict:
    return {
        "event_type": event.get("event_type", ""),
        "category": event.get("category", ""),
        "action": event.get("action", ""),
        "process.name": event.get("process_name", ""),
        "process.path": event.get("process_path", ""),
        "process.pid": str(event.get("process_pid", 0)),
        "process.command_line": event.get("command_line", ""),
        "parent_process.name": event.get("parent_process_name", ""),
        "parent_process.path": event.get("parent_process_path", ""),
        "target_process.name": event.get("target_process_name", ""),
        "target_process.path": event.get("target_process_path", ""),
        "target_process.pid": str(event.get("target_process_pid", 0)),
        "user.name": event.get("username", ""),
        "user.domain": event.get("user_domain", ""),
        "host.name": event.get("host", ""),
        "host.ip": event.get("host_ip", ""),
        "source.ip": event.get("source_ip", ""),
        "destination.ip": event.get("dest_ip", ""),
        "destination.port": str(event.get("dest_port", 0)),
        "registry.path": event.get("registry_path", ""),
        "registry.value": event.get("registry_value", ""),
        "registry.data": event.get("registry_data", ""),
        "file.name": event.get("file_name", ""),
        "file.path": event.get("file_path", ""),
        "dns.question.name": event.get("dns_query", ""),
        "threat.technique_id": event.get("technique_id", ""),
        "threat.technique_name": event.get("technique_name", ""),
        "threat.tactic": event.get("tactic", ""),
        "severity_score": str(event.get("severity_score", 0)),
        "confidence": str(event.get("confidence", 0)),
        "message": event.get("message", ""),
        "raw": event.get("raw", ""),
    }


class SigmaMatcher:

    @staticmethod
    def _extract_mitre(rule):
        for tag in rule.get("tags", []):
            t = tag.lower()
            if t.startswith("attack.t"):
                mid = tag.split(".", 1)[1]
                return mid[0].upper() + mid[1:]
            if t.startswith("t") and "." in t:
                return tag[0].upper() + tag[1:]

        mitre = rule.get("mitre", {})
        if isinstance(mitre, dict):
            return mitre.get("technique", "")
        return str(mitre) if mitre else ""

    @staticmethod
    def match(event):

        alerts = []
        norm = _normalize_event(event)

        for rule in sigma_rules:
            detection = rule.get("detection", {})
            condition = detection.get("condition", "")

            if not detection:
                continue

            selection_matches = {}
            for key, selection in detection.items():
                if key in ("condition", "timeframe"):
                    continue
                selection_matches[key] = _match_selection(selection, norm)

            if not condition:
                if not any(selection_matches.values()):
                    continue
            elif not _match_condition(condition, event, selection_matches):
                continue

            severity = rule.get("severity") or rule.get("level") or "medium"
            mitre_id = SigmaMatcher._extract_mitre(rule)
            title = rule.get("title", "Sigma Match")

            alerts.append({
                "title": title,
                "severity": severity,
                "mitre_attack": mitre_id,
                "alert_type": title,
                "event": event,
            })

        return alerts
