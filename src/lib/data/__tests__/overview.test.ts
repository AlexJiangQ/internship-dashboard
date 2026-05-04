import { describe, expect, it } from "vitest";
import {
  computeOverviewKpis,
  computePerformanceDistributionByGrade,
  filterRowsByOverviewOption
} from "../overview";
import type { InternshipRow } from "../../../types/dashboard";

const sampleRows: InternshipRow[] = [
  {
    "Major ": "AS",
    "Company name": "Company A",
    "Total working days": "100",
    "Total working hours": "800",
    "Overall performance": "A+"
  },
  {
    "Major ": "APAI",
    "Company name": "Company B",
    "Total working days": "50",
    "Total working hours": "500",
    "Overall performance": "B"
  },
  {
    "Major ": "RM,DA or STAT",
    "Company name": "Company C",
    "Total working days": "20",
    "Total working hours": "200",
    "Overall performance": "C-"
  },
  {
    "Major ": "RM, DA or STAT",
    "Company name": "Company A",
    "Total working days": "30",
    "Total working hours": "300",
    "Overall performance": "F"
  }
];

describe("filterRowsByOverviewOption", () => {
  it("Overall uses all rows", () => {
    expect(filterRowsByOverviewOption(sampleRows, "Overall")).toHaveLength(4);
  });

  it("AS filters only AS rows", () => {
    const rows = filterRowsByOverviewOption(sampleRows, "AS");
    expect(rows).toHaveLength(1);
    expect(rows[0]?.["Major "]).toBe("AS");
  });

  it("APAI filters only APAI rows", () => {
    const rows = filterRowsByOverviewOption(sampleRows, "APAI");
    expect(rows).toHaveLength(1);
    expect(rows[0]?.["Major "]).toBe("APAI");
  });

  it("RM, DA or STAT combines RM/DA/STAT variants", () => {
    const rows = filterRowsByOverviewOption(sampleRows, "RM, DA or STAT");
    expect(rows).toHaveLength(2);
  });
});

describe("computeOverviewKpis", () => {
  it("overview KPI cards update based on selected option rows", () => {
    const overall = computeOverviewKpis(filterRowsByOverviewOption(sampleRows, "Overall"));
    const asOnly = computeOverviewKpis(filterRowsByOverviewOption(sampleRows, "AS"));

    expect(overall).toEqual({
      internshipRecords: 4,
      totalCompanies: 3,
      avgWorkingDays: 50,
      avgDailyHours: 9.5
    });

    expect(asOnly).toEqual({
      internshipRecords: 1,
      totalCompanies: 1,
      avgWorkingDays: 100,
      avgDailyHours: 8
    });
  });

  it("uses alias mapping when counting unique companies", () => {
    const rows: InternshipRow[] = [
      {
        "Major ": "AS",
        "Company name": "AIA",
        "Total working days": "20",
        "Total working hours": "160",
        "Overall performance": "A"
      },
      {
        "Major ": "AS",
        "Company name": "AIA International Limited",
        "Total working days": "20",
        "Total working hours": "180",
        "Overall performance": "B"
      }
    ];

    const result = computeOverviewKpis(rows);
    expect(result.totalCompanies).toBe(1);
  });
});

describe("computePerformanceDistributionByGrade", () => {
  it("groups grades into A Range, B Range, C Range, D & F only", () => {
    const points = computePerformanceDistributionByGrade(sampleRows);
    expect(points.map((item) => item.label)).toEqual([
      "A Range",
      "B Range",
      "C Range",
      "D & F"
    ]);
    expect(points.map((item) => item.value)).toEqual([1, 1, 1, 1]);
  });

  it("distribution updates based on filtered rows", () => {
    const asRows = filterRowsByOverviewOption(sampleRows, "AS");
    const points = computePerformanceDistributionByGrade(asRows);
    expect(points.map((item) => item.value)).toEqual([1, 0, 0, 0]);
  });
});
