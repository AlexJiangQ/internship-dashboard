export interface CompanyAliasMappingEntry {
  rawAlias: string;
  normalizedKey: string;
  canonicalDisplayName: string;
}

export function normalizeCompanyAliasKey(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

// Source: aliases observed in current internship.xlsx (Final sheet).
// Intentionally excluded as ambiguous mixed entity string:
// "BestServe Financial Limited, Sun Life Hong Kong Limited"
export const COMPANY_ALIAS_GROUPS: Record<string, readonly string[]> = {
  AIA: [
    "AIA",
    "AIA Company (Group Office)",
    "AIA Company limited",
    "AIA Company Limited",
    "AIA Company Limited (Group Office)",
    "AIA Group",
    "AIA Group Limited",
    "AIA Group Ltd",
    "AIA Group office",
    "AIA Group Office",
    "AIA Hong Kong",
    "AIA Hong Kong & Macau Ltd",
    "AIA international Limited",
    "AIA International Limited",
    "AIA International Ltd.",
    "AIAHK",
    "AlA group office"
  ],
  Prudential: [
    "Hong Kong Prudential Limited",
    "Prudential",
    "Prudential Coporation Asia",
    "Prudential Corporate Asia",
    "Prudential Corporate Holding Limited",
    "Prudential Corporation Asia",
    "Prudential Corporation Asia (PCA)",
    "Prudential Corporation Asia Limited",
    "Prudential Hong Kong",
    "Prudential Hong Kong Limited",
    "Prudential Hong Kong Ltd.",
    "Prudential plc",
    "Prudential PLC",
    "Prudential Service Limited",
    "Prudential Services Limited",
    "Prudential Services Limited (Prudential Corporation Asia)"
  ],
  Manulife: [
    "Manulife",
    "Manulife (Int’l) Limited",
    "Manulife (International) Limited",
    "Manulife (International) Limited (Incorporated in Bermuda with limited liability)",
    "Manulife (Regional Office)",
    "Manulife Asia Financial Limited",
    "Manulife Financial",
    "Manulife Financial Asia",
    "Manulife Financial Asia Limited",
    "Manulife Financial Asia Ltd",
    "Manulife Financial Asia Ltd.",
    "Manulife Financial Limited",
    "Manulife(International) Limited"
  ],
  AXA: [
    "AXA",
    "AXA Chia Region Insurance Company Limited",
    "AXA China region Insurance Company Limited",
    "AXA China Region Insurance Company Limited",
    "AXA China Regional Insurance Company Limited",
    "AXA Hong Kong and Macau"
  ],
  "RGA (Reinsurance Group of America)": [
    "Reinsurance Group of America",
    "Reinsurance Group of America Hong Kong",
    "Reinsurance Group of America, Inc.",
    "RGA",
    "RGA Reinsurance Company",
    "RGA Reinsurance Company Asia",
    "RGA Reinsurance Company Hong Kong Branch",
    "RGA Reinsurance Company Limited",
    "RGA Reinsurance Company Ltd.",
    "RGA Reinsurance Company, Hong Kong Branch",
    "RGA Reinsurance Company, HongKong Branch",
    "The Reinsurance Group Of America(RGA)"
  ],
  FWD: [
    "FWD Group",
    "FWD Group Holdings Limited",
    "FWD Group Limited",
    "FWD Group Management Holdings Limited",
    "FWD HK",
    "FWD Life Company (Bermuda) Limited - Alex Yung Region",
    "FWD Life Insurance Company",
    "FWD life Insurance Company (Bermuda) Limited",
    "FWD Life Insurance Company (Bermuda) Limited",
    "FWD Life Insurance Company (Bermuda) Limited (Incorporated in Bermuda with limited liability)",
    "FWD Life Insurance Compnay (Bermuda) Limited"
  ],
  HSBC: [
    "HSBC",
    "HSBC Global Services (HK) Limited",
    "HSBC Global Services (HK) Ltd",
    "HSBC GLOBAL SERVICES (HK) LTD",
    "HSBC Global Services (Hong Kong) Limited",
    "HSBC Global Services (Hong Kong) Ltd.",
    "HSBC HK",
    "HSBC Insuarance (Asia) Limited",
    "HSBC Insurance",
    "HSBC Insurance (Asia) Limited",
    "HSBC Insurance (Asia) LTD",
    "HSBC INSURANCE(ASIA) LTD",
    "The Hongkong & Shanghai Banking Corporation Limited"
  ],
  "Sun Life": [
    "Sun Life Financial",
    "Sun Life Financial Hong Kong",
    "Sun life Hong Kong Limited",
    "Sun Life Hong Kong Limited",
    "Sun Life Hong Kong Limited (Incorporated in Bermuda with limited liability)"
  ],
  "Ernst & Young (EY)": [
    "Ernst & Young",
    "Ernst & Young (Actuarial and Insurance Advisory Services)",
    "Ernst & Young Advisory Service Limited",
    "Ernst & Young Advisory Services",
    "Ernst & Young Advisory Services Limited",
    "Ernst & Young HK Limited",
    "Ernst and Young",
    "EY(Actuarial)"
  ],
  Deloitte: [
    "Deloitte Advisory",
    "Deloitte Advisory (Hong Kong) Limited",
    "Deloitte Advisory Hong Kong Limited",
    "Deloitte China"
  ],
  "Census and Statistics Department": [
    "C&SD (SPSB/SPS)",
    "Census & Statistics Department",
    "Census & Statistics Department, HKSAR",
    "Census and Statistics Department",
    "Census and Statistics Department, HKSAR",
    "Census and Statistics Department, HKSAR Government",
    "Census and Statistics Department, The Government of the Hong Kong Special Administrative Region",
    "Census and Statistics Department, Trade Statistics Branch(2) / Trade Statistics Processing Section",
    "Data Science Branch, Census and Statistics Department",
    "ETMS Section, Trade Statistics Branch (2), Census & Statistics Department",
    "ETMS Section, Trade Statistics Branch (2), Census and Statistics Department",
    "HKSAR Census & Statistics Department",
    "The Census and Statistics Department,HKSARG"
  ],
  "HKU Department of Statistics and Actuarial Science": [
    "Data Science Lab, SAAS, HKU",
    "Department of SAAS",
    "Department of Statistics and Actuarial Science",
    "Department of Statistics and Actuarial Science, HKU",
    "Department of Statistics and Actuarial Science, The University of Hong Kong",
    "Dept SAAS HKU",
    "HKU SAAS",
    "HKU SAAS Data Science Lab",
    "The Department of Statistics and Actuarial Science, The University of Hong Kong"
  ],
  "Swiss Re": [
    "Swiss Re",
    "Swiss Re Asia Ltd, Hong Kong",
    "Swiss Re Asia Pte Ltd.",
    "Swiss Re Asia Pte. Ltd",
    "Swiss Re Asia Pte. Ltd., Hong Kong Branch",
    "Swiss Re HK",
    "Swiss Reinsurance Company Limited",
    "Swiss reinsurance Company Ltd",
    "Swiss reinsurance Company Ltd, Hong Kong Branch",
    "Swiss Reinsurance Company Ltd, Hong Kong Branch"
  ],
  "Chubb Life": [
    "Chubb Life HK",
    "Chubb Life Insurance Company Ltd",
    "Chubb Life Insurance Hong Kong Limited"
  ],
  "China Life (Overseas)": [
    "China Life Insurance (Overseas) Co Ltd",
    "China Life Insurance (overseas) Company Limited",
    "China Life Insurance (Overseas) Company Limited"
  ],
  "Zurich Insurance": [
    "Zurich Insurance (Hong Kong)",
    "Zurich Insurance(Hong Kong)"
  ],
  KPMG: [
    "KPMG",
    "KPMG China"
  ],
  "BNP Paribas": [
    "BNP Paribas",
    "BNP Paribas(China) Limited"
  ]
};

export const COMPANY_ALIAS_MAPPINGS: CompanyAliasMappingEntry[] = Object.entries(
  COMPANY_ALIAS_GROUPS
).flatMap(([canonicalDisplayName, aliases]) =>
  aliases.map((rawAlias) => ({
    rawAlias,
    normalizedKey: normalizeCompanyAliasKey(rawAlias),
    canonicalDisplayName
  }))
);
