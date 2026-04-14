import type {
  ChartPoint,
  DashboardComputationResult,
  DashboardStats,
  InternshipRow
} from "../../types/dashboard";
import {
  parseNumeric,
  normalizeCompanyNameForUnique,
  roundNumber,
  sanitizeCompanyLabel,
  toLowerText
} from "./cleaners";
import {
  KEYWORD_TEXT_COLUMNS,
  TECHNICAL_SKILL_KEYWORDS,
  type KeywordMap,
  WORK_FOCUS_KEYWORDS
} from "./keywordMaps";

type IntensityBucket = "Light" | "Moderate" | "Intense" | "High-Intensity" | "Unknown";

const INTENSITY_ORDER: IntensityBucket[] = [
  "Light",
  "Moderate",
  "Intense",
  "High-Intensity",
  "Unknown"
];

const IMPORTANT_COLUMNS = ["Company name", "Total working days", "Total working hours"];

function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function sortChartPoints(points: ChartPoint[]): ChartPoint[] {
  return points.sort((left, right) => {
    if (left.value !== right.value) {
      return right.value - left.value;
    }
    return left.label.localeCompare(right.label);
  });
}

function topCounts(
  records: Array<{ key: string; label: string }>,
  topN: number
): ChartPoint[] {
  const bucket = new Map<string, { label: string; value: number }>();

  for (const record of records) {
    const existing = bucket.get(record.key);
    if (!existing) {
      bucket.set(record.key, { label: record.label, value: 1 });
      continue;
    }
    existing.value += 1;
  }

  return sortChartPoints(Array.from(bucket.values())).slice(0, topN);
}

function computeKeywordDistribution(
  textBlobs: string[],
  keywordMap: KeywordMap,
  topN: number
): ChartPoint[] {
  const points: ChartPoint[] = Object.entries(keywordMap).map(([label, patterns]) => {
    let count = 0;
    for (const text of textBlobs) {
      const matched = patterns.some((pattern) => pattern.test(text));
      if (matched) {
        count += 1;
      }
    }
    return { label, value: count };
  });

  return sortChartPoints(points.filter((point) => point.value > 0)).slice(0, topN);
}

function getMissingColumns(rows: InternshipRow[]): string[] {
  const available = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      available.add(key);
    }
  }

  return IMPORTANT_COLUMNS.filter((column) => !available.has(column));
}

function buildTextBlob(row: InternshipRow): string {
  return KEYWORD_TEXT_COLUMNS.map((columnName) => toLowerText(row[columnName])).join(" ");
}

export function classifyWorkIntensity(hours: number | null): IntensityBucket {
  if (hours === null) {
    return "Unknown";
  }
  if (hours < 900) {
    return "Light";
  }
  if (hours <= 1200) {
    return "Moderate";
  }
  if (hours <= 1500) {
    return "Intense";
  }
  return "High-Intensity";
}

export function createEmptyStats(): DashboardStats {
  return {
    kpis: {
      totalCompanies: 0,
      totalPositions: 0,
      avgWorkingDays: 0,
      avgDailyHours: 0
    },
    topCompanies: [],
    workIntensity: [],
    technicalSkills: [],
    workFocusAreas: []
  };
}

export function computeDashboardStats(rows: InternshipRow[]): DashboardComputationResult {
  if (rows.length === 0) {
    return {
      stats: createEmptyStats(),
      warnings: ["No internship rows were found in the workbook."]
    };
  }

  const warnings: string[] = [];
  const missingColumns = getMissingColumns(rows);
  if (missingColumns.length > 0) {
    warnings.push(`Missing expected columns: ${missingColumns.join(", ")}`);
  }

  const companyRecords = rows.map((row) => {
    const label = sanitizeCompanyLabel(row["Company name"]);
    const key = normalizeCompanyNameForUnique(row["Company name"]);
    return { key, label };
  });

  const totalCompanies = new Set(companyRecords.map((record) => record.key)).size;
  const totalPositions = rows.length;

  const dayValues = rows
    .map((row) => parseNumeric(row["Total working days"]))
    .filter((value): value is number => value !== null);

  const hourValues = rows.map((row) => parseNumeric(row["Total working hours"]));

  const avgWorkingDays = roundNumber(mean(dayValues), 0);

  const dailyHours = rows
    .map((row) => {
      const days = parseNumeric(row["Total working days"]);
      const hours = parseNumeric(row["Total working hours"]);
      if (days === null || hours === null || days <= 0) {
        return null;
      }
      return hours / days;
    })
    .filter((value): value is number => value !== null);

  const avgDailyHours = roundNumber(mean(dailyHours), 1);

  const intensityCounter = new Map<IntensityBucket, number>(
    INTENSITY_ORDER.map((bucket) => [bucket, 0])
  );
  for (const hours of hourValues) {
    const bucket = classifyWorkIntensity(hours);
    intensityCounter.set(bucket, (intensityCounter.get(bucket) ?? 0) + 1);
  }

  const workIntensity = INTENSITY_ORDER.map((label) => ({
    label,
    value: intensityCounter.get(label) ?? 0
  })).filter((item) => item.value > 0);

  const textBlobs = rows.map(buildTextBlob);

  return {
    warnings,
    stats: {
      kpis: {
        totalCompanies,
        totalPositions,
        avgWorkingDays,
        avgDailyHours
      },
      topCompanies: topCounts(companyRecords, 10),
      workIntensity,
      technicalSkills: computeKeywordDistribution(textBlobs, TECHNICAL_SKILL_KEYWORDS, 10),
      workFocusAreas: computeKeywordDistribution(textBlobs, WORK_FOCUS_KEYWORDS, 10)
    }
  };
}
