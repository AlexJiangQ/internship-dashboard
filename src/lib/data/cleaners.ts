const NON_NUMERIC_CHARACTERS = /[^0-9.-]+/g;

export function parseNumeric(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const cleaned = String(value).replace(NON_NUMERIC_CHARACTERS, "").trim();
  if (!cleaned || cleaned === "." || cleaned === "-" || cleaned === "-.") {
    return null;
  }

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeCompanyNameForUnique(company: unknown): string {
  const raw = sanitizeCompanyLabel(company);
  return raw.toLowerCase();
}

export function sanitizeCompanyLabel(company: unknown): string {
  if (company === null || company === undefined) {
    return "Unknown";
  }

  const normalized = String(company).replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : "Unknown";
}

export function toLowerText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).toLowerCase();
}

export function roundNumber(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
