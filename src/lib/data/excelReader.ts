import * as XLSX from "xlsx";
import type { InternshipRow } from "../../types/dashboard";

const DEFAULT_FILE_URL = "/data/internship.xlsx";
const DEFAULT_SHEET_NAME = "Final";

export async function readInternshipRows(
  fileUrl = DEFAULT_FILE_URL,
  preferredSheetName = DEFAULT_SHEET_NAME
): Promise<InternshipRow[]> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Cannot load workbook from "${fileUrl}"`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });

  const activeSheetName = workbook.SheetNames.includes(preferredSheetName)
    ? preferredSheetName
    : workbook.SheetNames[0];

  if (!activeSheetName) {
    return [];
  }

  const worksheet = workbook.Sheets[activeSheetName];
  if (!worksheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json<InternshipRow>(worksheet, {
    defval: null
  });
}
