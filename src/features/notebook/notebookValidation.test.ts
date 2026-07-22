import assert from "node:assert/strict";
import test from "node:test";
import { isNotebookEntryExpired } from "./notebookRetention.ts";
import { searchNotebook } from "./notebookSearch.ts";
import { isShiftNotebookEntry } from "./notebookValidation.ts";
import type { ShiftNotebookEntry } from "./notebookTypes.ts";

const entry: ShiftNotebookEntry = {
  archivedAt: null,
  attachmentIds: [],
  body: "Synthetic observation",
  createdAt: "2026-07-01T12:00:00.000Z",
  followUp: false,
  id: "note-1",
  retention: "7-days",
  title: "Synthetic shift note",
  updatedAt: "2026-07-01T12:00:00.000Z"
};

test("notebook validates and searches local content", () => {
  assert.equal(isShiftNotebookEntry(entry), true);
  assert.equal(searchNotebook([entry], "observation").length, 1);
  assert.equal(searchNotebook([entry], "unrelated").length, 0);
});

test("notebook retention handles expiry without deleting data", () => {
  assert.equal(isNotebookEntryExpired(entry, new Date("2026-07-09T12:00:00.000Z").getTime()), true);
});
