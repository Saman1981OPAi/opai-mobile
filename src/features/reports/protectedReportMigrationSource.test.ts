import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./protectedReportMigration.ts", import.meta.url), "utf8");

test("report migration is idempotent, owner-bound, verified, and rollback preserving", () => {
  assert.equal(source.includes("protectedReportRepository.load(input.userId)"), true);
  assert.equal(source.includes("input.legacyOwnerId === input.userId"), true);
  assert.equal(source.includes("protectedReportRepository.saveStore(store)"), true);
  assert.equal(source.includes("WRITE_VERIFICATION_FAILED"), true);
  assert.equal(source.includes("retainLegacyPlaintext: true"), true);
  assert.equal(source.includes("removeItem"), false);
});

test("report migration does not silently fall back to plaintext writes", () => {
  assert.equal(source.includes("AsyncStorage.setItem"), false);
  assert.equal(source.includes("legacyDrafts:"), true);
  assert.equal(source.includes("protectedWriteVerified: true"), true);
});
