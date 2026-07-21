import assert from "node:assert/strict";
import test from "node:test";
import {
  decryptAssistantStore,
  encryptAssistantStore
} from "./assistantCrypto.ts";
import {
  ASSISTANT_STORE_VERSION,
  migrateLegacyRecords,
  type AssistantStore
} from "./assistantTypes.ts";

const key = Uint8Array.from({ length: 32 }, (_, index) => index + 1);
const nonce = Uint8Array.from({ length: 12 }, (_, index) => index + 20);
const store: AssistantStore = {
  conversations: migrateLegacyRecords([{
    createdAt: "2026-07-20T00:00:00.000Z",
    id: "legacy",
    mockResponse: "Sensitive synthetic answer",
    prompt: "Sensitive synthetic prompt"
  }]),
  userId: "user-one",
  version: ASSISTANT_STORE_VERSION
};

test("Assistant history is encrypted and decrypts for its owning user", () => {
  const encrypted = encryptAssistantStore(store, key, nonce);
  assert.equal(encrypted.includes("Sensitive synthetic prompt"), false);
  assert.equal(encrypted.includes("Sensitive synthetic answer"), false);
  assert.deepEqual(decryptAssistantStore(encrypted, "user-one", key), store);
});

test("Assistant history cannot be opened for another user", () => {
  const encrypted = encryptAssistantStore(store, key, nonce);
  assert.throws(() => decryptAssistantStore(encrypted, "user-two", key));
});

test("Assistant history rejects the wrong encryption key", () => {
  const encrypted = encryptAssistantStore(store, key, nonce);
  const wrongKey = Uint8Array.from({ length: 32 }, (_, index) => index + 2);
  assert.throws(() => decryptAssistantStore(encrypted, "user-one", wrongKey));
});
