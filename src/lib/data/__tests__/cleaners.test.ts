import { describe, expect, it } from "vitest";
import {
  getCanonicalCompanyDisplayName,
  normalizeCompanyNameForUnique,
  parseNumeric,
  roundNumber,
  sanitizeCompanyLabel
} from "../cleaners";

describe("parseNumeric", () => {
  it("parses numbers with comma and unit strings", () => {
    expect(parseNumeric("1,200")).toBe(1200);
    expect(parseNumeric("1200h")).toBe(1200);
  });

  it("returns null for non-numeric values", () => {
    expect(parseNumeric("n/a")).toBeNull();
    expect(parseNumeric(undefined)).toBeNull();
    expect(parseNumeric(null)).toBeNull();
  });
});

describe("company cleaners", () => {
  it("sanitizes display labels with fallback", () => {
    expect(sanitizeCompanyLabel("  AIA Group  ")).toBe("AIA Group");
    expect(sanitizeCompanyLabel("   ")).toBe("Unknown");
  });

  it("normalizes company key for unique counting", () => {
    expect(normalizeCompanyNameForUnique("  AIA Group  ")).toBe("aia");
    expect(normalizeCompanyNameForUnique("AIA International Limited")).toBe("aia");
    expect(normalizeCompanyNameForUnique(null)).toBe("unknown");
  });

  it("maps known aliases to canonical display name", () => {
    expect(getCanonicalCompanyDisplayName("AIA International Limited")).toBe("AIA");
    expect(getCanonicalCompanyDisplayName("AIA Hong Kong")).toBe("AIA");
    expect(getCanonicalCompanyDisplayName("Unknown Startup")).toBe("Unknown Startup");
  });
});

describe("roundNumber", () => {
  it("rounds to expected precision", () => {
    expect(roundNumber(8.056, 1)).toBe(8.1);
    expect(roundNumber(107.84, 0)).toBe(108);
  });
});
