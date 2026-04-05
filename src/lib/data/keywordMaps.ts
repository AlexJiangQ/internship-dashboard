export type KeywordMap = Record<string, RegExp[]>;

export const KEYWORD_TEXT_COLUMNS = [
  "Work nature",
  "Evaluation",
  "Suggestions",
  "Combined comments",
  "Job Position"
] as const;

export const TECHNICAL_SKILL_KEYWORDS: KeywordMap = {
  Excel: [/\bexcel\b/i],
  "Power BI": [/power\s*bi/i],
  Prophet: [/\bprophet\b/i],
  Python: [/\bpython\b/i],
  R: [/\br\b/i, /\br language\b/i],
  SAS: [/\bsas\b/i],
  SQL: [/\bsql\b/i],
  VBA: [/\bvba\b/i]
};

export const WORK_FOCUS_KEYWORDS: KeywordMap = {
  "AI & Machine Learning": [/\bai\b/i, /machine learning/i, /\bml\b/i],
  "Actuarial Modeling": [/actuarial model/i, /actuarial modelling/i, /actuarial modeling/i],
  Auditing: [/\baudit\w*\b/i],
  "Data Analytics": [/data analys\w*/i, /\banalytics\b/i],
  IFRS17: [/ifrs\s*17/i, /ifrs17/i],
  Pricing: [/\bpric\w*\b/i],
  Research: [/\bresearch\b/i],
  "Risk Management": [/risk management/i, /\brisk\b/i],
  UAT: [/\buat\b/i, /user acceptance testing/i],
  Valuation: [/\bvaluation\b/i]
};
