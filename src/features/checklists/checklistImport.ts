import type { ChecklistDefinition } from "./checklistTypes.ts";
import { validateChecklistDefinition } from "./checklistValidation.ts";

export function validateChecklistImport(value: unknown) {
  if (!Array.isArray(value)) throw new Error("Checklist import must be an array.");
  return value.map((definition) => validateChecklistDefinition(definition as ChecklistDefinition));
}
