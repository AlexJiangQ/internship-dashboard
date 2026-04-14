import type { PreferenceKey } from "../../types/dashboard";

export const PREFERENCE_OPTIONS: Record<PreferenceKey, string[]> = {
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
