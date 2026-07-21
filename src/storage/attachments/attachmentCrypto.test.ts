import assert from "node:assert/strict";
import test from "node:test";
import { decryptAttachmentContent, encryptAttachmentContent } from "./attachmentCrypto.ts";

const key = Uint8Array.from({ length: 32 }, (_, index) => index + 1);
const nonce = Uint8Array.from({ length: 12 }, (_, index) => index + 9);

function encrypted() {
  return encryptAttachmentContent({
    base64: "c3ludGhldGljIGF0dGFjaG1lbnQ=",
    id: "opaque-attachment",
    key,
    nonce,
    now: "2026-07-21T12:00:00.000Z",
    userId: "officer-1"
  });
}

test("attachment content is encrypted and bound to its user and opaque ID", () => {
  const value = encrypted();
  assert.equal(value.includes("c3ludGhldGljIGF0dGFjaG1lbnQ="), false);
  assert.equal(decryptAttachmentContent({ encrypted: value, id: "opaque-attachment", key, userId: "officer-1" }), "c3ludGhldGljIGF0dGFjaG1lbnQ=");
  assert.throws(() => decryptAttachmentContent({ encrypted: value, id: "opaque-attachment", key, userId: "officer-2" }));
  assert.throws(() => decryptAttachmentContent({ encrypted: value, id: "different-id", key, userId: "officer-1" }));
});

test("attachment content rejects ciphertext tampering", () => {
  const envelope = JSON.parse(encrypted()) as { ciphertext: string };
  envelope.ciphertext = `${envelope.ciphertext.slice(0, -2)}AA`;
  assert.throws(() => decryptAttachmentContent({ encrypted: JSON.stringify(envelope), id: "opaque-attachment", key, userId: "officer-1" }));
});
