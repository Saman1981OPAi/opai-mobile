import assert from "node:assert/strict";
import test from "node:test";
import { paidDutyStart, validatePaidDutyDraft } from "./paidDutyValidation.ts";

const valid = {
  date: "2030-07-20",
  location: "Community centre",
  reminderOffsets: [30, 1440, 30],
  startTime: "18:30",
  timezone: "America/Toronto",
  title: "Community event"
};

test("validates and deduplicates paid duty reminder offsets", () => {
  assert.deepEqual(validatePaidDutyDraft(valid).reminderOffsets, [1440, 30]);
  assert.equal(paidDutyStart(valid).toISOString(), "2030-07-20T22:30:00.000Z");
});

test("rejects incomplete paid duty details", () => {
  assert.throws(() => validatePaidDutyDraft({ ...valid, title: " " }), /title/);
  assert.throws(() => validatePaidDutyDraft({ ...valid, startTime: "25:90" }), /YYYY-MM-DD/);
});
