import { describe, expect, it } from "vitest";
import { classifyDurationBucket, computeDashboardStats } from "../stats";
import type { InternshipRow } from "../../../types/dashboard";

describe("classifyDurationBucket", () => {
  it("classifies boundary values as defined in MVP", () => {
    expect(classifyDurationBucket(null)).toBe("Unknown");
    expect(classifyDurationBucket(-1)).toBe("Unknown");
    expect(classifyDurationBucket(0)).toBe("1 Month");
    expect(classifyDurationBucket(30)).toBe("1 Month");
    expect(classifyDurationBucket(31)).toBe("3 Months");
    expect(classifyDurationBucket(90)).toBe("3 Months");
    expect(classifyDurationBucket(91)).toBe("6 Months");
    expect(classifyDurationBucket(180)).toBe("6 Months");
    expect(classifyDurationBucket(181)).toBe("9 Months");
    expect(classifyDurationBucket(359)).toBe("9 Months");
    expect(classifyDurationBucket(360)).toBe("12 Months and longer");
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
        "Company name": "AIA International Limited",
        "Total working days": "200",
        "Total working hours": "1200",
        "Work nature": "Excel and Power BI data analytics deep learning NLP LLM"
      },
      {
        "Company name": "Prudential",
        "Total working days": "100",
        "Total working hours": "1500",
        "Work nature": "IFRS17 pricing valuation AXIS RAFM"
      },
      {
        "Company name": "",
        "Total working days": "n/a",
        "Total working hours": "1600",
        "Work nature": "audit research risk management"
      }
    ];

    const result = computeDashboardStats(rows);
    expect(result.warnings).toEqual([]);

    expect(result.stats.kpis.totalCompanies).toBe(3);
    expect(result.stats.kpis.totalPositions).toBe(4);
    expect(result.stats.kpis.avgWorkingDays).toBe(133);
    expect(result.stats.kpis.avgDailyHours).toBe(9.7);

    expect(result.stats.topCompanies[0]).toEqual({ label: "AIA", value: 2 });

    expect(result.stats.workIntensity).toEqual([
      { label: "6 Months", value: 2 },
      { label: "9 Months", value: 1 },
      { label: "Unknown", value: 1 }
    ]);

    const skillLabels = result.stats.technicalSkills.map((point) => point.label);
    expect(skillLabels).toContain("AXIS");
    expect(skillLabels).toContain("Deep Learning");
    expect(skillLabels).toContain("LLM");
    expect(skillLabels).toContain("Machine Learning");
    expect(skillLabels).toContain("NLP");
    expect(skillLabels).toContain("Python");
    expect(skillLabels).toContain("RAFM");
    expect(skillLabels).toContain("SQL");
    expect(skillLabels).toContain("Excel");
  });

  it("emits warning when key columns are missing", () => {
    const rows: InternshipRow[] = [{ "Company name": "A" }];
    const result = computeDashboardStats(rows);
    expect(result.warnings[0]).toContain("Total working days");
    expect(result.warnings[0]).toContain("Total working hours");
  });

  it("matches newly added conservative work focus areas", () => {
    const rows: InternshipRow[] = [
      {
        "Company name": "A",
        "Total working days": "30",
        "Total working hours": "240",
        "Work nature": "solvency review and hkrbc analysis"
      },
      {
        "Company name": "B",
        "Total working days": "30",
        "Total working hours": "240",
        "Work nature": "eev and vonb projection support"
      },
      {
        "Company name": "C",
        "Total working days": "30",
        "Total working hours": "240",
        "Work nature": "financial reporting and statutory reporting support"
      },
      {
        "Company name": "D",
        "Total working days": "30",
        "Total working hours": "240",
        "Work nature": "alm and economic assumptions update"
      },
      {
        "Company name": "E",
        "Total working days": "30",
        "Total working hours": "240",
        "Work nature": "regulatory reporting and compliance checking"
      },
      {
        "Company name": "F",
        "Total working days": "30",
        "Total working hours": "240",
        "Work nature": "underwriting workflow support"
      },
      {
        "Company name": "G",
        "Total working days": "30",
        "Total working hours": "240",
        "Work nature": "claims case review"
      },
      {
        "Company name": "H",
        "Total working days": "30",
        "Total working hours": "240",
        "Work nature": "reserve checking for reserving process"
      }
    ];

    const labels = computeDashboardStats(rows).stats.workFocusAreas.map(
      (point) => point.label
    );
    expect(labels).toContain("Capital & Solvency");
    expect(labels).toContain("EEV / VONB");
    expect(labels).toContain("Financial Reporting");
    expect(labels).toContain("ALM / Economic Assumptions");
    expect(labels).toContain("Compliance & Regulation");
    expect(labels).toContain("Underwriting");
    expect(labels).toContain("Claims");
    expect(labels).toContain("Reserving");
  });
});
