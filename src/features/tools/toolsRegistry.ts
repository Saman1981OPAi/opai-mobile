import type { ToolDefinition } from "./toolsTypes.ts";

export const toolsRegistry: ToolDefinition[] = [
  { id: "notebook", icon: "notebook-edit-outline", label: "Shift Notebook", summary: "Fast protected notes" },
  { id: "timeline", icon: "timeline-clock-outline", label: "Timeline", summary: "Order events locally" },
  { id: "descriptions", icon: "account-details-outline", label: "Description Builder", summary: "Person and vehicle" },
  { id: "phonetic", icon: "alphabetical-variant", label: "Phonetic Alphabet", summary: "Offline NATO utility" },
  { id: "calculator", icon: "calculator-variant-outline", label: "Calculator", summary: "Units, time, and math" },
  { id: "checklists", icon: "clipboard-check-outline", label: "Checklists", summary: "Demonstration framework" },
  { id: "calendar", icon: "calendar-month-outline", label: "Calendar", summary: "Events and reminders" }
];

