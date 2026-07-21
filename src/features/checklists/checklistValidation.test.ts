import assert from "node:assert/strict";
import test from "node:test";
import { demonstrationChecklists } from "./checklistLibrary.ts";
import { checklistDisplayStatus, validateChecklistDefinition } from "./checklistValidation.ts";

test("demonstration checklist carries required safety metadata", () => {
  const definition = demonstrationChecklists[0]!;
  assert.doesNotThrow(() => validateChecklistDefinition(definition));
  assert.equal(definition.approvalStatus, "draft");
  assert.equal(definition.source, "Demonstration checklist \u2014 not approved operational guidance.");
});

test("expired definition is shown as review required", () => {
  assert.equal(checklistDisplayStatus(demonstrationChecklists[0]!, new Date("2027-01-01T12:00:00")), "Review required");
});
