import { isRecord } from "../../storage/protected/protectedStorageValidation.ts";
import { CHECKLIST_STORE_VERSION, DEMO_CHECKLIST_NOTICE, type ChecklistDefinition, type ChecklistInstance, type ChecklistStore } from "./checklistTypes.ts";

export function validateChecklistDefinition(value: ChecklistDefinition) {
  if (!value.id || !value.title || !value.jurisdiction || !value.source || !value.version || !value.reviewedAt || !value.expiresAt) throw new Error("Checklist definition metadata is incomplete.");
  if (value.approvalStatus !== "approved" && value.source !== DEMO_CHECKLIST_NOTICE) {
    throw new Error("Non-approved checklist content must carry the demonstration notice.");
  }
  const itemIds = value.sections.flatMap((section) => section.items.map((item) => item.id));
  if (new Set(itemIds).size !== itemIds.length) throw new Error("Checklist item IDs must be unique.");
  return value;
}

export function checklistDisplayStatus(definition: ChecklistDefinition, now = new Date()) {
  if (new Date(`${definition.expiresAt}T23:59:59`).getTime() < now.getTime()) return "Review required";
  if (definition.approvalStatus === "expired" || definition.approvalStatus === "review-required") return "Review required";
  return definition.approvalStatus === "approved" ? "Approved" : "Draft";
}

function isInstance(value: unknown): value is ChecklistInstance {
  return isRecord(value) && (value.archivedAt === null || typeof value.archivedAt === "string") && typeof value.checklistDefinitionId === "string" && (value.completedAt === null || typeof value.completedAt === "string") && typeof value.createdAt === "string" && typeof value.id === "string" && typeof value.notes === "string" && typeof value.revision === "number" && Array.isArray(value.selectedItems) && value.selectedItems.every((id) => typeof id === "string") && typeof value.updatedAt === "string";
}

export function isChecklistStore(value: unknown): value is ChecklistStore {
  return isRecord(value) && value.version === CHECKLIST_STORE_VERSION && typeof value.userId === "string" && Array.isArray(value.instances) && value.instances.every(isInstance);
}

