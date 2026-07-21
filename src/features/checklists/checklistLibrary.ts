import { DEMO_CHECKLIST_NOTICE, type ChecklistDefinition } from "./checklistTypes.ts";

export const demonstrationChecklists: ChecklistDefinition[] = [
  {
    approvalStatus: "draft",
    expiresAt: "2026-12-31",
    id: "demo-shift-organization",
    jurisdiction: "Demonstration only",
    reviewedAt: "2026-07-21",
    sections: [
      {
        id: "demo-section",
        items: [
          { id: "demo-review-personal-reminders", label: "Review personal reminders" },
          { id: "demo-organize-local-notes", label: "Organize local notes" },
          { id: "demo-review-follow-ups", label: "Review personal follow-up markers" }
        ],
        title: "Demonstration organization"
      }
    ],
    source: DEMO_CHECKLIST_NOTICE,
    title: "Demonstration Shift Organization",
    version: "demo-1"
  }
];
