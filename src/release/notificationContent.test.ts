import assert from "node:assert/strict";
import test from "node:test";
import {
  getReminderPreviewContent,
  type ReminderPreviewKind
} from "../services/notificationContent.ts";

const prohibitedReleaseWords = /\b(test|demo|prototype|placeholder)\b/i;

test("production notification previews use normal reminder wording", () => {
  const kinds: ReminderPreviewKind[] = ["court", "system", "training"];

  for (const kind of kinds) {
    const content = getReminderPreviewContent(kind);
    assert.equal(prohibitedReleaseWords.test(content.title), false);
    assert.equal(prohibitedReleaseWords.test(content.body), false);
  }

  assert.equal(getReminderPreviewContent("court").title, "Court reminder");
  assert.equal(getReminderPreviewContent("training").title, "Training reminder");
});
