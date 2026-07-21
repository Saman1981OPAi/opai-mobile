import { isRecord } from "../../storage/protected/protectedStorageValidation.ts";
import { NOTEBOOK_SCHEMA_VERSION, type NotebookStore, type ShiftNotebookEntry } from "./notebookTypes.ts";

const retentionValues = new Set(["7-days", "30-days", "until-deleted"]);

export function isShiftNotebookEntry(value: unknown): value is ShiftNotebookEntry {
  if (!isRecord(value)) return false;
  return (
    (value.archivedAt === null || typeof value.archivedAt === "string") &&
    Array.isArray(value.attachmentIds) &&
    value.attachmentIds.every((id) => typeof id === "string") &&
    typeof value.body === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.followUp === "boolean" &&
    typeof value.id === "string" &&
    typeof value.retention === "string" &&
    retentionValues.has(value.retention) &&
    typeof value.title === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function isNotebookStore(value: unknown): value is NotebookStore {
  return (
    isRecord(value) &&
    value.version === NOTEBOOK_SCHEMA_VERSION &&
    typeof value.userId === "string" &&
    Array.isArray(value.entries) &&
    value.entries.every(isShiftNotebookEntry)
  );
}

export function validateNotebookEntry(entry: ShiftNotebookEntry) {
  if (!isShiftNotebookEntry(entry)) throw new Error("Shift Notebook entry is invalid.");
  if (entry.title.length > 120) throw new Error("Note title must be 120 characters or fewer.");
  if (entry.body.length > 50_000) throw new Error("Note must be 50,000 characters or fewer.");
  return entry;
}

