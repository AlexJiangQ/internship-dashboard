export interface InternshipRow {
  [key: string]: unknown;
  "Company name"?: string | null;
  "Total working days"?: string | number | null;
  "Total working hours"?: string | number | null;
  "Work nature"?: string | null;
  Evaluation?: string | null;
  Suggestions?: string | null;
  "Combined comments"?: string | null;
  "Job Position"?: string | null;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardKpis {
  totalCompanies: number;
  totalPositions: number;
  avgWorkingDays: number;
  avgDailyHours: number;
}

export interface DashboardStats {
  kpis: DashboardKpis;
  topCompanies: ChartPoint[];
  workIntensity: ChartPoint[];
  technicalSkills: ChartPoint[];
  workFocusAreas: ChartPoint[];
}

export interface DashboardComputationResult {
  stats: DashboardStats;
  warnings: string[];
}

export type PreferenceKey = "skills" | "work_focus" | "career_goal";

export interface PreferencePayload {
  skills: string[];
  work_focus: string[];
  career_goal: string[];
}
