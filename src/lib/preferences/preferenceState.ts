import {
  ALL_WORK_NATURE_OPTIONS,
  JOB_POSITIONS_BY_DIRECTION,
  type JobDirection,
  type StudentPreferenceKey,
  WORK_NATURE_BY_POSITION
} from "./preferenceOptions";
import type { PreferencePayload } from "../../types/dashboard";

const NO_PREFERENCE = "No Preference";

function uniqueList(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function createEmptyPreferencePayload(): PreferencePayload {
  return {
    skills: [],
    work_focus: [],
    career_goal: [],
    duration: NO_PREFERENCE,
    jobDirections: [],
    jobPositions: [],
    workNature: []
  };
}

export function toggleStudentPreferenceSelection(
  payload: PreferencePayload,
  key: StudentPreferenceKey,
  option: string
): PreferencePayload {
  const current = payload[key];
  const next = current.includes(option)
    ? current.filter((item) => item !== option)
    : [...current, option];

  return {
    ...payload,
    [key]: next
  };
}

export function updateDurationSelection(
  payload: PreferencePayload,
  duration: string
): PreferencePayload {
  return {
    ...payload,
    duration
  };
}

export function toggleJobDirectionSelection(
  payload: PreferencePayload,
  direction: string
): PreferencePayload {
  const current = payload.jobDirections;
  let nextDirections: string[];

  if (direction === NO_PREFERENCE) {
    nextDirections = current.includes(NO_PREFERENCE) ? [] : [NO_PREFERENCE];
  } else if (current.includes(direction)) {
    nextDirections = current.filter((item) => item !== direction);
  } else {
    nextDirections = [...current.filter((item) => item !== NO_PREFERENCE), direction];
  }

  return {
    ...payload,
    jobDirections: nextDirections
  };
}

export function getAvailableJobPositions(selectedDirections: string[]): string[] {
  if (selectedDirections.length === 0 || selectedDirections.includes(NO_PREFERENCE)) {
    return [];
  }

  const positions = selectedDirections.flatMap((direction) => {
    const typedDirection = direction as JobDirection;
    return JOB_POSITIONS_BY_DIRECTION[typedDirection] ?? [];
  });

  return uniqueList(positions);
}

export function syncSelectedJobPositionsWithDirections(
  payload: PreferencePayload
): PreferencePayload {
  const availablePositions = getAvailableJobPositions(payload.jobDirections);
  const availableSet = new Set(availablePositions);
  const filtered = payload.jobPositions.filter((position) => availableSet.has(position));

  if (filtered.length === payload.jobPositions.length) {
    return payload;
  }

  return {
    ...payload,
    jobPositions: filtered
  };
}

export function toggleJobPositionSelection(
  payload: PreferencePayload,
  position: string
): PreferencePayload {
  const nextPositions = payload.jobPositions.includes(position)
    ? payload.jobPositions.filter((item) => item !== position)
    : [...payload.jobPositions, position];

  return {
    ...payload,
    jobPositions: nextPositions
  };
}

export function getSuggestedWorkNatureOptions(selectedPositions: string[]): string[] {
  if (selectedPositions.length === 0) {
    return [];
  }

  const suggested = selectedPositions.flatMap(
    (position) => WORK_NATURE_BY_POSITION[position] ?? []
  );
  return uniqueList(suggested);
}

export function toggleWorkNatureSelection(
  payload: PreferencePayload,
  workNature: string
): PreferencePayload {
  const nextWorkNature = payload.workNature.includes(workNature)
    ? payload.workNature.filter((item) => item !== workNature)
    : [...payload.workNature, workNature];

  return {
    ...payload,
    workNature: nextWorkNature
  };
}

export function buildSubmittedPreferencePayload(
  payload: PreferencePayload
): PreferencePayload {
  const cleanDirections = payload.jobDirections.filter(
    (direction) => direction !== NO_PREFERENCE
  );

  return {
    skills: [...payload.skills],
    work_focus: [...payload.work_focus],
    career_goal: [...payload.career_goal],
    duration: payload.duration,
    jobDirections: cleanDirections,
    jobPositions: [...payload.jobPositions],
    workNature: [...payload.workNature]
  };
}

export function getAllWorkNatureOptions(): string[] {
  return ALL_WORK_NATURE_OPTIONS;
}
