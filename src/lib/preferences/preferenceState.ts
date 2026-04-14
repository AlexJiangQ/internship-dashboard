import type { PreferenceKey, PreferencePayload } from "../../types/dashboard";

export function createEmptyPreferencePayload(): PreferencePayload {
  return {
    skills: [],
    work_focus: [],
    career_goal: []
  };
}

export function togglePreferenceSelection(
  payload: PreferencePayload,
  key: PreferenceKey,
  option: string
): PreferencePayload {
  const currentOptions = payload[key];
  const nextOptions = currentOptions.includes(option)
    ? currentOptions.filter((item) => item !== option)
    : [...currentOptions, option];

  return {
    ...payload,
    [key]: nextOptions
  };
}

export function buildSubmittedPreferencePayload(
  payload: PreferencePayload
): PreferencePayload {
  return {
    skills: [...payload.skills],
    work_focus: [...payload.work_focus],
    career_goal: [...payload.career_goal]
  };
}
