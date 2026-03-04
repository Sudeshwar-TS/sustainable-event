export function normalizePhone(phone: string): string {
  return phone.trim().replace("+91", "").replace(/\s+/g, "").replace(/-/g, "");
}

export function formatPhoneForInput(phone: string): string {
  const digits = normalizePhone(phone).replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function phoneCandidates(phone: string): string[] {
  const raw = phone.trim();
  const normalized = normalizePhone(phone);
  const compact = raw.replace(/\s+/g, "").replace(/-/g, "");
  return Array.from(new Set([normalized, raw, compact]));
}
