import assert from "node:assert/strict";
import test from "node:test";
import { appendToolTextToReport, createReportFromToolText } from "./reportHandoff.ts";

test("tool handoff creates a protected-report-compatible draft without exposing an internal source ID", () => {
  const draft = createReportFromToolText("Synthetic notebook text.", "Shift Notebook");

  assert.equal(draft.incidentNotes.narrativeDraft, "Synthetic notebook text.");
  assert.equal(draft.notes, "Created from Shift Notebook.");
  assert.equal(draft.notes.includes(draft.id), false);
  assert.equal(draft.status, "draft");
});

test("tool handoff appends text without mutating the original report", () => {
  const original = createReportFromToolText("Original synthetic text.", "Timeline");
  const updated = appendToolTextToReport(original, "Additional synthetic text.");

  assert.equal(original.incidentNotes.narrativeDraft, "Original synthetic text.");
  assert.equal(
    updated.incidentNotes.narrativeDraft,
    "Original synthetic text.\n\nAdditional synthetic text."
  );
  assert.equal(updated.id, original.id);
  assert.notEqual(updated.incidentNotes, original.incidentNotes);
});
