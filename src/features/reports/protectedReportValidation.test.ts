import assert from "node:assert/strict";
import test from "node:test";
import { isProtectedReportStore } from "./protectedReportValidation.ts";

const draft = {
  attachmentMetadata: [],
  attachments: [],
  createdAt: "2026-07-21T12:00:00.000Z",
  date: "2026-07-21",
  followUpRequired: false,
  id: "report-1",
  incidentNotes: {},
  incidentType: "Synthetic occurrence",
  involvedPersons: [],
  location: "Synthetic location",
  notes: "Synthetic note",
  occurrenceCategory: "Other",
  personsInvolved: [],
  priority: "Medium",
  status: "draft",
  time: "12:00",
  updatedAt: "2026-07-21T12:00:00.000Z",
  witnessDetails: [],
  witnesses: []
};

test("protected report schema accepts a complete synthetic draft", () => {
  assert.equal(
    isProtectedReportStore({ drafts: [draft], userId: "officer-1", version: 1 }),
    true
  );
});

test("protected report schema rejects invalid status values", () => {
  assert.equal(
    isProtectedReportStore({
      drafts: [{ ...draft, status: "submitted-to-official-system" }],
      userId: "officer-1",
      version: 1
    }),
    false
  );
});

