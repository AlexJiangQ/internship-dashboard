import type { ChartPoint, InternshipRow } from "../../types/dashboard";
import {
  normalizeCompanyNameForUnique,
  parseNumeric,
  roundNumber
} from "./cleaners";

export type OverviewFilterOption = "Overall" | "AS" | "APAI" | "RM, DA or STAT";

export const OVERVIEW_FILTER_OPTIONS: readonly OverviewFilterOption[] = [
  "Overall",
  "AS",
  "APAI",
  "RM, DA or STAT"
] as const;

export interface OverviewKpis {
  internshipRecords: number;
  totalCompanies: number;
  avgWorkingDays: number;
  avgDailyHours: number;
}

const GRADE_BUCKETS = ["A Range", "B Range", "C Range", "D & F"] as const;
type GradeBucket = (typeof GRADE_BUCKETS)[number];

const GRADE_TO_BUCKET: Record<string, GradeBucket> = {
  "A+": "A Range",
  A: "A Range",
  "A-": "A Range",
  "B+": "B Range",
  B: "B Range",
  "B-": "B Range",
  "C+": "C Range",
  C: "C Range",
  "C-": "C Range",
  "D+": "D & F",
  D: "D & F",
  F: "D & F"
};

const RM_GROUP_VALUES = new Set(["RM,DAORSTAT", "RMDAORSTAT"]);

function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function normalizeMajorValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim().replace(/\s+/g, "").toUpperCase();
}

function normalizeGradeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim().toUpperCase();
}

export function filterRowsByOverviewOption(
  rows: InternshipRow[],
  option: OverviewFilterOption
): InternshipRow[] {
  if (option === "Overall") {
    return rows;
  }

  return rows.filter((row) => {
    const normalizedMajor = normalizeMajorValue(row["Major "]);
    if (option === "AS") {
      return normalizedMajor === "AS";
    }
    if (option === "APAI") {
      return normalizedMajor === "APAI";
    }
    return RM_GROUP_VALUES.has(normalizedMajor);
  });
}

export function computeOverviewKpis(rows: InternshipRow[]): OverviewKpis {
  const dayValues = rows
    .map((row) => parseNumeric(row["Total working days"]))
    .filter((value): value is number => value !== null);

  const dailyHourValues = rows
    .map((row) => {
      const days = parseNumeric(row["Total working days"]);
      const hours = parseNumeric(row["Total working hours"]);
      if (days === null || hours === null || days <= 0) {
        return null;
      }
      return hours / days;
    })
    .filter((value): value is number => value !== null);

  const companies = new Set(
    rows.map((row) => normalizeCompanyNameForUnique(row["Company name"]))
  );

  return {
    internshipRecords: rows.length,
    totalCompanies: companies.size,
    avgWorkingDays: roundNumber(mean(dayValues), 0),
    avgDailyHours: roundNumber(mean(dailyHourValues), 1)
  };
}

export function computePerformanceDistributionByGrade(rows: InternshipRow[]): ChartPoint[] {
  const counts = new Map<GradeBucket, number>(
    GRADE_BUCKETS.map((bucket) => [bucket, 0])
  );

  for (const row of rows) {
    const grade = normalizeGradeValue(row["Overall performance"]);
    const bucket = GRADE_TO_BUCKET[grade];
    if (bucket) {
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    }
  }

  return GRADE_BUCKETS.map((bucket) => ({
    label: bucket,
    value: counts.get(bucket) ?? 0
  }));
}
