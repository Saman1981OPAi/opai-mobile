import type { ShiftNotebookEntry } from "./notebookTypes.ts";

const DAY_MS = 86_400_000;

export function notebookRetentionDeadline(entry: ShiftNotebookEntry) {
  if (entry.retention === "until-deleted") return null;
  const days = entry.retention === "7-days" ? 7 : 30;
  return new Date(new Date(entry.updatedAt).getTime() + days * DAY_MS).toISOString();
}

export function isNotebookEntryExpired(entry: ShiftNotebookEntry, now = Date.now()) {
  const deadline = notebookRetentionDeadline(entry);
  return deadline ? new Date(deadline).getTime() <= now : false;
}

