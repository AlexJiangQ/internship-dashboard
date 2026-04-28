export type StudentPreferenceKey = "skills" | "work_focus" | "career_goal";
export const STUDENT_PANEL_OPTION_KEYS = ["skills"] as const;

export const STUDENT_PREFERENCE_OPTIONS: Record<StudentPreferenceKey, string[]> = {
  skills: [
    "Data Analysis",
    "Python / Programming",
    "SQL",
    "Communication",
    "Financial Analysis",
    "Research",
    "Problem Solving",
    "Presentation Skills",
    "Teamwork"
  ],
  work_focus: [
    "Data-related roles",
    "Business / Strategy",
    "Finance / Insurance",
    "Technology / IT",
    "Research / Academia",
    "Marketing / Sales",
    "Operations"
  ],
  career_goal: [
    "Explore career interests",
    "Gain practical experience",
    "Improve technical skills",
    "Prepare for full-time job",
    "Build professional network",
    "Strengthen resume"
  ]
};

export const DURATION_OPTIONS = [
  "No Preference",
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "12 Months and longer"
] as const;

export const JOB_DIRECTION_OPTIONS = [
  "No Preference",
  "Actuarial / Insurance Technical",
  "Risk / Capital / Compliance",
  "Data / AI / Technology",
  "Research / Consulting / Strategy",
  "Investment / Banking / Wealth Management",
  "General / Unspecified"
] as const;

export type JobDirection = (typeof JOB_DIRECTION_OPTIONS)[number];

export const JOB_POSITIONS_BY_DIRECTION: Record<JobDirection, string[]> = {
  "No Preference": [],
  "Actuarial / Insurance Technical": [
    "General Actuarial Intern",
    "Actuarial Audit / Consulting Intern",
    "Actuarial Valuation / Modelling / Reporting Intern",
    "Pricing / Product Intern",
    "Underwriting / Claims Intern"
  ],
  "Risk / Capital / Compliance": [
    "Risk / Capital / Compliance Intern",
    "Audit / Assurance Intern"
  ],
  "Data / AI / Technology": [
    "Data Analytics / Data Science Intern",
    "AI / Machine Learning / Software / IT Intern"
  ],
  "Research / Consulting / Strategy": [
    "Research Assistant / Research Intern",
    "Consulting Intern",
    "Business Analyst / Strategy / Operations Intern"
  ],
  "Investment / Banking / Wealth Management": [
    "Investment / Asset Management / Markets Intern",
    "Banking / Wealth Management Intern"
  ],
  "General / Unspecified": ["Others / Unspecified Position"]
};

export const WORK_NATURE_BY_POSITION: Record<string, string[]> = {
  "General Actuarial Intern": [
    "Actuarial Calculation",
    "Experience Analysis",
    "Data Preparation",
    "Model Support",
    "Actuarial Reporting Support"
  ],
  "Actuarial Audit / Consulting Intern": [
    "Audit / Assurance",
    "Actuarial Review",
    "Model Assumption Review",
    "Reserve Checking",
    "Client Advisory Support"
  ],
  "Actuarial Valuation / Modelling / Reporting Intern": [
    "Financial Reporting",
    "Valuation / EEV / VONB",
    "Reserve / Statutory Reporting",
    "ALM / Economic Assumptions",
    "Actuarial Modeling / Prophet / RAFM / AXIS"
  ],
  "Pricing / Product Intern": [
    "Pricing / Product Development",
    "Profit Testing",
    "Product Feature Analysis",
    "Pricing Analytics",
    "Actuarial Modeling"
  ],
  "Risk / Capital / Compliance Intern": [
    "Risk Management",
    "Capital / Solvency / HKRBC",
    "IFRS 17 / Compliance",
    "Stress Testing",
    "Regulatory Reporting"
  ],
  "Data Analytics / Data Science Intern": [
    "Data Analytics",
    "Dashboard / Business Intelligence",
    "Data Cleaning / Data Processing",
    "Automation",
    "CRM / Business Analytics"
  ],
  "AI / Machine Learning / Software / IT Intern": [
    "AI / Machine Learning",
    "Software Development",
    "NLP / LLM / RAG",
    "System Development",
    "UAT / System Testing",
    "Fintech / Blockchain"
  ],
  "Research Assistant / Research Intern": [
    "Research / Market Analysis",
    "Literature Review",
    "Industry Research",
    "Statistical Analysis",
    "Survey / Data Collection"
  ],
  "Consulting Intern": [
    "Client Project Support",
    "Market Research",
    "Business Analysis",
    "Slide Deck / Presentation",
    "Strategy Recommendation"
  ],
  "Business Analyst / Strategy / Operations Intern": [
    "Business / Strategy / Consulting",
    "Operations Support",
    "Process Improvement",
    "Management Reporting",
    "Business Development"
  ],
  "Investment / Asset Management / Markets Intern": [
    "Investment / Asset Management",
    "Portfolio Analysis",
    "Market Monitoring",
    "Treasury / Capital Markets",
    "Fund Research"
  ],
  "Banking / Wealth Management Intern": [
    "Banking Operations",
    "Wealth Management",
    "Client Portfolio Support",
    "Financial Product Research",
    "Customer / Relationship Support"
  ],
  "Underwriting / Claims Intern": [
    "Underwriting",
    "Claims",
    "Policy Administration",
    "Case Review",
    "Customer / Operations Support"
  ],
  "Audit / Assurance Intern": [
    "Audit / Assurance",
    "Internal Control Review",
    "Risk Advisory",
    "Compliance Checking",
    "Financial Review"
  ],
  "Others / Unspecified Position": [
    "General Business Support",
    "Administrative Support",
    "Project Support",
    "No Specific Work Nature",
    "Others"
  ]
};

function uniqueList(values: string[]): string[] {
  return Array.from(new Set(values));
}

export const ALL_JOB_POSITIONS = uniqueList(
  Object.values(JOB_POSITIONS_BY_DIRECTION).flat()
);

export const ALL_WORK_NATURE_OPTIONS = uniqueList(
  Object.values(WORK_NATURE_BY_POSITION).flat()
);
