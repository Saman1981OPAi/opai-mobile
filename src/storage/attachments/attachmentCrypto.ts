import { decryptProtectedValue, encryptProtectedValue } from "../protected/protectedEnvelope.ts";

export const ATTACHMENT_CONTENT_SCHEMA_VERSION = 1;

type EncryptedAttachmentPayload = {
  base64: string;
  version: typeof ATTACHMENT_CONTENT_SCHEMA_VERSION;
};

function isPayload(value: unknown): value is EncryptedAttachmentPayload {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    (value as { version?: unknown }).version === ATTACHMENT_CONTENT_SCHEMA_VERSION &&
    typeof (value as { base64?: unknown }).base64 === "string"
  );
}

export function encryptAttachmentContent(input: {
  base64: string;
  id: string;
  key: Uint8Array;
  nonce: Uint8Array;
  now: string;
  userId: string;
}) {
  return encryptProtectedValue({
    data: { base64: input.base64, version: ATTACHMENT_CONTENT_SCHEMA_VERSION },
    key: input.key,
    namespace: `attachment-${input.id}`,
    nonce: input.nonce,
    now: input.now,
    schemaVersion: ATTACHMENT_CONTENT_SCHEMA_VERSION,
    userId: input.userId
  });
}

export function decryptAttachmentContent(input: {
  encrypted: string;
  id: string;
  key: Uint8Array;
  userId: string;
}) {
  const result = decryptProtectedValue({
    encrypted: input.encrypted,
    key: input.key,
    namespace: `attachment-${input.id}`,
    schemaVersion: ATTACHMENT_CONTENT_SCHEMA_VERSION,
    userId: input.userId
  });
  if (!isPayload(result.data)) throw new Error("Encrypted attachment payload is invalid.");
  return result.data.base64;
}
