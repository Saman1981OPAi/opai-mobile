import { gcm } from "@noble/ciphers/aes";
import { bytesToUtf8, utf8ToBytes } from "@noble/ciphers/utils";
import { ProtectedStorageError } from "./protectedStorageErrors.ts";
import {
  PROTECTED_ENVELOPE_VERSION,
  type ProtectedEnvelope
} from "./protectedStorageTypes.ts";
import { isRecord } from "./protectedStorageValidation.ts";

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function base64ToBytes(value: string) {
  try {
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch (error) {
    throw new ProtectedStorageError("CORRUPTED_DATA", "Protected data is not valid base64.", error);
  }
}

function associatedData(userId: string, namespace: string, schemaVersion: number) {
  return utf8ToBytes(
    `opai-protected:${PROTECTED_ENVELOPE_VERSION}:${schemaVersion}:${namespace}:${userId}`
  );
}

function userBinding(userId: string) {
  // This is an ownership marker, not a password hash or encryption primitive.
  let hash = 2166136261;
  for (const byte of utf8ToBytes(`opai-user:${userId}`)) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function isEnvelope(value: unknown): value is ProtectedEnvelope {
  if (!isRecord(value)) return false;
  return (
    value.algorithm === "AES-256-GCM" &&
    typeof value.ciphertext === "string" &&
    typeof value.createdAt === "string" &&
    value.envelopeVersion === PROTECTED_ENVELOPE_VERSION &&
    typeof value.namespace === "string" &&
    typeof value.nonce === "string" &&
    typeof value.schemaVersion === "number" &&
    typeof value.updatedAt === "string" &&
    typeof value.userBinding === "string"
  );
}

export function encodeProtectedKey(key: Uint8Array) {
  return bytesToBase64(key);
}

export function decodeProtectedKey(value: string) {
  const key = base64ToBytes(value);
  if (key.length !== 32) {
    throw new ProtectedStorageError("KEY_UNAVAILABLE", "Protected storage key has an invalid length.");
  }
  return key;
}

export function encryptProtectedValue(input: {
  createdAt?: string;
  data: unknown;
  key: Uint8Array;
  namespace: string;
  nonce: Uint8Array;
  now: string;
  schemaVersion: number;
  userId: string;
}) {
  if (input.key.length !== 32 || input.nonce.length !== 12) {
    throw new ProtectedStorageError(
      "INVALID_CONFIGURATION",
      "Protected encryption requires a 256-bit key and 96-bit nonce."
    );
  }
  const ciphertext = gcm(
    input.key,
    input.nonce,
    associatedData(input.userId, input.namespace, input.schemaVersion)
  ).encrypt(utf8ToBytes(JSON.stringify(input.data)));
  const envelope: ProtectedEnvelope = {
    algorithm: "AES-256-GCM",
    ciphertext: bytesToBase64(ciphertext),
    createdAt: input.createdAt ?? input.now,
    envelopeVersion: PROTECTED_ENVELOPE_VERSION,
    namespace: input.namespace,
    nonce: bytesToBase64(input.nonce),
    schemaVersion: input.schemaVersion,
    updatedAt: input.now,
    userBinding: userBinding(input.userId)
  };
  return JSON.stringify(envelope);
}

export function decryptProtectedValue(input: {
  encrypted: string;
  key: Uint8Array;
  namespace: string;
  schemaVersion: number;
  userId: string;
}) {
  try {
    const envelope = JSON.parse(input.encrypted) as unknown;
    if (!isEnvelope(envelope)) {
      throw new ProtectedStorageError("CORRUPTED_DATA", "Protected envelope is invalid.");
    }
    if (
      envelope.namespace !== input.namespace ||
      envelope.schemaVersion !== input.schemaVersion ||
      envelope.userBinding !== userBinding(input.userId)
    ) {
      throw new ProtectedStorageError(
        "CORRUPTED_DATA",
        "Protected data belongs to a different account, namespace, or schema."
      );
    }
    const plaintext = gcm(
      input.key,
      base64ToBytes(envelope.nonce),
      associatedData(input.userId, input.namespace, input.schemaVersion)
    ).decrypt(base64ToBytes(envelope.ciphertext));
    return {
      createdAt: envelope.createdAt,
      data: JSON.parse(bytesToUtf8(plaintext)) as unknown
    };
  } catch (error) {
    if (error instanceof ProtectedStorageError) throw error;
    throw new ProtectedStorageError(
      "CORRUPTED_DATA",
      "Protected data could not be authenticated or decrypted.",
      error
    );
  }
}
