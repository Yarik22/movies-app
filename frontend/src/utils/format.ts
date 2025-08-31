export function normalizeTitle(raw: string) {
  const cleaned = (raw || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");

  return cleaned.replace(
    /\b\w+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

export function isValidYear(value: string) {
  if (!/^\d{4}$/.test(String(value))) return false;
  const y = Number(value);
  const now = new Date().getFullYear();
  return y >= 1888 && y <= now + 1;
}
