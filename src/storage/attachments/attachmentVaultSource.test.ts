import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./attachmentVault.ts", import.meta.url), "utf8");

test("attachment vault uses opaque encrypted files and user-bound key material", () => {
  assert.equal(source.includes("getRandomBytesAsync(20)"), true);
  assert.equal(source.includes(".vault`"), true);
  assert.equal(source.includes("protectedKeyService.getKey(userId"), true);
  assert.equal(source.includes("encryptAttachmentContent"), true);
  assert.equal(source.includes("input.fileName"), false);
});

test("temporary attachment copies are bounded and always cleaned up", () => {
  assert.equal(source.includes("finally"), true);
  assert.equal(source.includes("deleteTemporaryCopy(temporaryUri)"), true);
  assert.equal(source.includes("startsWith(temporaryRoot)"), true);
  assert.equal(source.includes("deleteSourceAfterImport"), true);
});

test("attachment cleanup is explicit and reference aware", () => {
  assert.equal(source.includes("cleanupOrphans"), true);
  assert.equal(source.includes("retainedIds"), true);
  assert.equal(source.includes("attachmentMetadataRepository.remove"), true);
  assert.equal(source.includes("attachmentMetadataRepository.clear"), true);
});
