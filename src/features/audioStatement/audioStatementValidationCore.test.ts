import assert from "node:assert/strict";
import test from "node:test";
import {
  AUDIO_STATEMENT_MAX_TITLE_LENGTH,
  normalizeAudioStatementTitle,
  validateAudioDuration
} from "./audioStatementValidationCore.ts";

test("normalizes a local Audio Statement title", () => {
  assert.equal(normalizeAudioStatementTitle("  Shift note  "), "Shift note");
});

test("rejects missing or oversized Audio Statement titles", () => {
  assert.throws(() => normalizeAudioStatementTitle("  "), /Add a short title/);
  assert.throws(
    () => normalizeAudioStatementTitle("x".repeat(AUDIO_STATEMENT_MAX_TITLE_LENGTH + 1)),
    /under 80 characters/
  );
});

test("enforces the local recording duration boundary", () => {
  assert.equal(validateAudioDuration(120, 120), 120);
  assert.throws(() => validateAudioDuration(0, 120), /recording is empty/);
  assert.throws(() => validateAudioDuration(120.01, 120), /120 seconds or shorter/);
});
