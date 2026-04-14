import { describe, expect, it } from "vitest";
import {
  buildSubmittedPreferencePayload,
  createEmptyPreferencePayload,
  togglePreferenceSelection
} from "../preferenceState";

describe("createEmptyPreferencePayload", () => {
  it("creates empty arrays for all preference groups", () => {
    expect(createEmptyPreferencePayload()).toEqual({
      skills: [],
      work_focus: [],
      career_goal: []
    });
  });
});

describe("togglePreferenceSelection", () => {
  it("adds and removes options in a multi-select group", () => {
    const initial = createEmptyPreferencePayload();
    const selected = togglePreferenceSelection(initial, "skills", "SQL");
    expect(selected.skills).toEqual(["SQL"]);

    const removed = togglePreferenceSelection(selected, "skills", "SQL");
    expect(removed.skills).toEqual([]);
  });

  it("keeps selections independent across groups", () => {
    const initial = createEmptyPreferencePayload();
    const withSkill = togglePreferenceSelection(initial, "skills", "Data Analysis");
    const withGoal = togglePreferenceSelection(
      withSkill,
      "career_goal",
      "Prepare for full-time job"
    );

    expect(withGoal.skills).toEqual(["Data Analysis"]);
    expect(withGoal.work_focus).toEqual([]);
    expect(withGoal.career_goal).toEqual(["Prepare for full-time job"]);
  });
});

describe("buildSubmittedPreferencePayload", () => {
  it("returns required payload shape with copied arrays", () => {
    const draft = {
      skills: ["SQL"],
      work_focus: ["Technology / IT"],
      career_goal: ["Build professional network"]
    };

    const submitted = buildSubmittedPreferencePayload(draft);
    expect(submitted).toEqual({
      skills: ["SQL"],
      work_focus: ["Technology / IT"],
      career_goal: ["Build professional network"]
    });

    draft.skills.push("Communication");
    expect(submitted.skills).toEqual(["SQL"]);
  });

  it("returns empty arrays when nothing is selected", () => {
    const submitted = buildSubmittedPreferencePayload(createEmptyPreferencePayload());
    expect(submitted).toEqual({
      skills: [],
      work_focus: [],
      career_goal: []
    });
  });
});
