import type { ShiftNotebookEntry } from "./notebookTypes.ts";

export function searchNotebook(entries: ShiftNotebookEntry[], query: string, showArchived = false) {
  const normalized = query.trim().toLocaleLowerCase("en-CA");
  return entries
    .filter((entry) => (showArchived ? Boolean(entry.archivedAt) : !entry.archivedAt))
    .filter((entry) => !normalized || `${entry.title}\n${entry.body}`.toLocaleLowerCase("en-CA").includes(normalized))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

