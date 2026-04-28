import { describe, expect, it } from "vitest";
import {
  buildSubmittedPreferencePayload,
  createEmptyPreferencePayload,
  getAvailableJobPositions,
  getSuggestedWorkNatureOptions,
  syncSelectedJobPositionsWithDirections,
  toggleJobPositionSelection,
  toggleStudentPreferenceSelection,
  toggleJobDirectionSelection,
  updateDurationSelection
} from "../preferenceState";
import {
  STUDENT_PANEL_OPTION_KEYS,
  STUDENT_PREFERENCE_OPTIONS
} from "../preferenceOptions";

describe("student preference options", () => {
  it("uses Skills only as Student Preference panel source", () => {
    expect(STUDENT_PANEL_OPTION_KEYS).toEqual(["skills"]);
    expect(STUDENT_PREFERENCE_OPTIONS.skills).toContain("Data Analysis");
  });
});

describe("createEmptyPreferencePayload", () => {
  it("creates default preference payload shape", () => {
    expect(createEmptyPreferencePayload()).toEqual({
      skills: [],
      work_focus: [],
      career_goal: [],
      duration: "No Preference",
      jobDirections: [],
      jobPositions: [],
      workNature: []
    });
  });
});

describe("toggleStudentPreferenceSelection", () => {
  it("toggles values in original preference sections", () => {
    const initial = createEmptyPreferencePayload();
    const selected = toggleStudentPreferenceSelection(initial, "skills", "SQL");
    expect(selected.skills).toEqual(["SQL"]);

    const removed = toggleStudentPreferenceSelection(selected, "skills", "SQL");
    expect(removed.skills).toEqual([]);
  });
});

describe("toggleJobDirectionSelection", () => {
  it("selecting No Preference clears other job directions", () => {
    const initial = createEmptyPreferencePayload();
    const selectedSpecific = toggleJobDirectionSelection(
      initial,
      "Data / AI / Technology"
    );
    expect(selectedSpecific.jobDirections).toEqual(["Data / AI / Technology"]);

    const withNoPreference = toggleJobDirectionSelection(
      selectedSpecific,
      "No Preference"
    );
    expect(withNoPreference.jobDirections).toEqual(["No Preference"]);
  });
});

describe("getAvailableJobPositions", () => {
  it("shows placeholder mode (no positions) before direction selection", () => {
    expect(getAvailableJobPositions([])).toEqual([]);
    expect(getAvailableJobPositions(["No Preference"])).toEqual([]);
  });

  it("returns positions under selected job direction", () => {
    const positions = getAvailableJobPositions(["Data / AI / Technology"]);
    expect(positions).toEqual([
      "Data Analytics / Data Science Intern",
      "AI / Machine Learning / Software / IT Intern"
    ]);
  });
});

describe("syncSelectedJobPositionsWithDirections", () => {
  it("removes unavailable selected job positions after direction change", () => {
    const payload = {
      skills: [],
      work_focus: [],
      career_goal: [],
      duration: "6 Months",
      jobDirections: ["Actuarial / Insurance Technical"],
      jobPositions: [
        "Pricing / Product Intern",
        "Data Analytics / Data Science Intern"
      ],
      workNature: []
    };

    const synced = syncSelectedJobPositionsWithDirections(payload);
    expect(synced.jobPositions).toEqual(["Pricing / Product Intern"]);
  });
});

describe("getSuggestedWorkNatureOptions", () => {
  it("shows placeholder mode (no work nature) before position selection", () => {
    expect(getSuggestedWorkNatureOptions([])).toEqual([]);
  });

  it("returns combined work nature options from selected job positions", () => {
    const suggested = getSuggestedWorkNatureOptions([
      "Pricing / Product Intern",
      "Actuarial Valuation / Modelling / Reporting Intern"
    ]);

    expect(suggested).toContain("Pricing / Product Development");
    expect(suggested).toContain("Financial Reporting");
    expect(suggested).toContain("Actuarial Modeling / Prophet / RAFM / AXIS");
  });

  it("removes duplicate work nature options across positions", () => {
    const suggested = getSuggestedWorkNatureOptions([
      "Actuarial Audit / Consulting Intern",
      "Audit / Assurance Intern"
    ]);

    expect(suggested.filter((item) => item === "Audit / Assurance")).toHaveLength(1);
  });
});

describe("buildSubmittedPreferencePayload", () => {
  it("includes original and new preference fields", () => {
    const updated = updateDurationSelection(createEmptyPreferencePayload(), "6 Months");
    const withStudent = toggleStudentPreferenceSelection(updated, "skills", "SQL");
    const withDirection = toggleJobDirectionSelection(
      withStudent,
      "Actuarial / Insurance Technical"
    );
    const withPositions = toggleJobPositionSelection(
      withDirection,
      "Pricing / Product Intern"
    );
    const draft = {
      ...withPositions,
      work_focus: ["Technology / IT"],
      career_goal: ["Build professional network"],
      jobDirections: ["Actuarial / Insurance Technical"],
      jobPositions: [
        "Pricing / Product Intern",
        "Actuarial Valuation / Modelling / Reporting Intern"
      ],
      workNature: [
        "Pricing / Product Development",
        "Financial Reporting",
        "Actuarial Modeling / Prophet / RAFM / AXIS"
      ]
    };

    const submitted = buildSubmittedPreferencePayload(draft);
    expect(submitted).toEqual({
      skills: ["SQL"],
      work_focus: ["Technology / IT"],
      career_goal: ["Build professional network"],
      duration: "6 Months",
      jobDirections: ["Actuarial / Insurance Technical"],
      jobPositions: [
        "Pricing / Product Intern",
        "Actuarial Valuation / Modelling / Reporting Intern"
      ],
      workNature: [
        "Pricing / Product Development",
        "Financial Reporting",
        "Actuarial Modeling / Prophet / RAFM / AXIS"
      ]
    });
  });

  it("sanitizes No Preference out of jobDirections in payload", () => {
    const draft = {
      ...createEmptyPreferencePayload(),
      jobDirections: ["No Preference"]
    };
    const submitted = buildSubmittedPreferencePayload(draft);
    expect(submitted.jobDirections).toEqual([]);
  });
});
