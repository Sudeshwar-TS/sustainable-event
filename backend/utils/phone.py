def normalize_phone(phone: str) -> str:
    return phone.strip().replace("+91", "").replace(" ", "").replace("-", "")


def phone_candidates(phone: str) -> list[str]:
    raw = phone.strip()
    normalized = normalize_phone(phone)
    candidates = [normalized, raw, raw.replace(" ", "").replace("-", "")]
    return list(dict.fromkeys(candidates))
