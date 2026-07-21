import assert from "node:assert/strict";
import test from "node:test";
import {
  decryptProtectedValue,
  encryptProtectedValue
} from "./protectedEnvelope.ts";
import { ProtectedStorageError } from "./protectedStorageErrors.ts";

const key = Uint8Array.from({ length: 32 }, (_, index) => index + 1);
const nonce = Uint8Array.from({ length: 12 }, (_, index) => index + 11);

function encrypted(userId = "officer-1") {
  return encryptProtectedValue({
    data: { note: "Synthetic protected note" },
    key,
    namespace: "shift-notebook",
    nonce,
    now: "2026-07-21T12:00:00.000Z",
    schemaVersion: 1,
    userId
  });
}

test("protected envelope round-trips authenticated data", () => {
  const result = decryptProtectedValue({
    encrypted: encrypted(),
    key,
    namespace: "shift-notebook",
    schemaVersion: 1,
    userId: "officer-1"
  });
  assert.deepEqual(result.data, { note: "Synthetic protected note" });
});

test("protected envelope rejects a different user", () => {
  assert.throws(
    () =>
      decryptProtectedValue({
        encrypted: encrypted(),
        key,
        namespace: "shift-notebook",
        schemaVersion: 1,
        userId: "officer-2"
      }),
    (error) => error instanceof ProtectedStorageError && error.code === "CORRUPTED_DATA"
  );
});

test("protected envelope rejects tampering", () => {
  const envelope = JSON.parse(encrypted()) as { ciphertext: string };
  envelope.ciphertext = `${envelope.ciphertext.slice(0, -2)}AA`;
  assert.throws(
    () =>
      decryptProtectedValue({
        encrypted: JSON.stringify(envelope),
        key,
        namespace: "shift-notebook",
        schemaVersion: 1,
        userId: "officer-1"
      }),
    (error) => error instanceof ProtectedStorageError && error.code === "CORRUPTED_DATA"
  );
});
