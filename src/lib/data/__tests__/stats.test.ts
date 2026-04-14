import { describe, expect, it } from "vitest";
import { classifyWorkIntensity, computeDashboardStats } from "../stats";
import type { InternshipRow } from "../../../types/dashboard";

describe("classifyWorkIntensity", () => {
  it("classifies boundary values as defined in MVP", () => {
    expect(classifyWorkIntensity(null)).toBe("Unknown");
    expect(classifyWorkIntensity(899)).toBe("Light");
    expect(classifyWorkIntensity(900)).toBe("Moderate");
    expect(classifyWorkIntensity(1200)).toBe("Moderate");
    expect(classifyWorkIntensity(1201)).toBe("Intense");
    expect(classifyWorkIntensity(1500)).toBe("Intense");
    expect(classifyWorkIntensity(1501)).toBe("High-Intensity");
  });
});

describe("computeDashboardStats", () => {
  it("computes kpis, top companies and pie distributions", () => {
    const rows: InternshipRow[] = [
      {
        "Company name": "AIA Group ",
        "Total working days": "100",
        "Total working hours": "800",
        "Work nature": "Python python SQL AI machine learning"
      },
      {
        "Company name": "aia group",
        "Total working days": "200",
        "Total working hours": "1200",
        "Work nature": "Excel and Power BI data analytics"
      },
      {
        "Company name": "Prudential",
        "Total working days": "100",
        "Total working hours": "1500",
        "Work nature": "IFRS17 pricing valuation"
      },
      {
        "Company name": "",
        "Total working days": "50",
        "Total working hours": "1600",
        "Work nature": "audit research risk management"
      }
    ];

    const result = computeDashboardStats(rows);
    expect(result.warnings).toEqual([]);

    expect(result.stats.kpis.totalCompanies).toBe(3);
    expect(result.stats.kpis.totalPositions).toBe(4);
    expect(result.stats.kpis.avgWorkingDays).toBe(113);
    expect(result.stats.kpis.avgDailyHours).toBe(15.3);

    expect(result.stats.topCompanies[0]).toEqual({ label: "AIA Group", value: 2 });

    expect(result.stats.workIntensity).toEqual([
      { label: "Light", value: 1 },
      { label: "Moderate", value: 1 },
      { label: "Intense", value: 1 },
      { label: "High-Intensity", value: 1 }
    ]);

    const skillLabels = result.stats.technicalSkills.map((point) => point.label);
    expect(skillLabels).toContain("Python");
    expect(skillLabels).toContain("SQL");
    expect(skillLabels).toContain("Excel");
  });

  it("emits warning when key columns are missing", () => {
    const rows: InternshipRow[] = [{ "Company name": "A" }];
    const result = computeDashboardStats(rows);
    expect(result.warnings[0]).toContain("Total working days");
    expect(result.warnings[0]).toContain("Total working hours");
  });
});
