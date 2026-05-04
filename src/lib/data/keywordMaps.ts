export type KeywordMap = Record<string, RegExp[]>;

export const KEYWORD_TEXT_COLUMNS = [
  "Work nature",
  "Evaluation",
  "Suggestions",
  "Combined comments",
  "Job Position"
] as const;

export const TECHNICAL_SKILL_KEYWORDS: KeywordMap = {
  AXIS: [/\baxis\b/i],
  "Deep Learning": [/deep\s*learning/i],
  Excel: [/\bexcel\b/i],
  LLM: [/\bllm\b/i, /large\s+language\s+models?/i],
  "Machine Learning": [/machine\s*learning/i, /\bml\b/i],
  NLP: [/\bnlp\b/i, /natural\s+language\s+processing/i],
  "Power BI": [/power\s*bi/i],
  Prophet: [/\bprophet\b/i],
  Python: [/\bpython\b/i],
  RAFM: [/\brafm\b/i],
  R: [/\br\b/i, /\br language\b/i],
  SAS: [/\bsas\b/i],
  SQL: [/\bsql\b/i],
  VBA: [/\bvba\b/i]
};

export const WORK_FOCUS_KEYWORDS: KeywordMap = {
  "AI & Machine Learning": [/\bai\b/i, /machine learning/i, /\bml\b/i],
  "ALM / Economic Assumptions": [/\balm\b/i, /asset\s+liability\s+management/i, /economic\s+assumptions?/i],
  "Actuarial Modeling": [/actuarial model/i, /actuarial modelling/i, /actuarial modeling/i],
  Auditing: [/\baudit\w*\b/i],
  "Capital & Solvency": [
    /\bsolvency\b/i,
    /\bhkrbc\b/i,
    /\bcapital\s+(management|requirement|requirements|position|solvency|model|modelling|modeling)\b/i
  ],
  Claims: [/\bclaims?\b/i],
  "Compliance & Regulation": [
    /\bcompliance\b/i,
    /\bregulatory\b/i,
    /\bregulations?\b/i,
    /regulatory\s+reporting/i
  ],
  "Data Analytics": [/data analys\w*/i, /\banalytics\b/i],
  "EEV / VONB": [/\beev\b/i, /\bvonb\b/i],
  "Financial Reporting": [/financial\s+reporting/i, /statutory\s+reporting/i],
  IFRS17: [/ifrs\s*17/i, /ifrs17/i],
  Pricing: [/\bpric\w*\b/i],
  Research: [/\bresearch\b/i],
  Reserving: [/\breserv\w*\b/i],
  "Risk Management": [/risk management/i, /\brisk\b/i],
  Underwriting: [/\bunderwrit\w*\b/i],
  UAT: [/\buat\b/i, /user acceptance testing/i],
  Valuation: [/\bvaluation\b/i]
};
