import { gcm } from "@noble/ciphers/aes";
import { bytesToUtf8, utf8ToBytes } from "@noble/ciphers/utils";
import {
  ASSISTANT_STORE_VERSION,
  type AssistantStore
} from "./assistantTypes.ts";

type EncryptedEnvelope = {
  algorithm: "AES-256-GCM";
  ciphertext: string;
  nonce: string;
  version: 1;
};

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function associatedData(userId: string) {
  return utf8ToBytes(`opai-assistant:${ASSISTANT_STORE_VERSION}:${userId}`);
}

export function encodeAssistantKey(key: Uint8Array) {
  return bytesToBase64(key);
}

export function decodeAssistantKey(key: string) {
  return base64ToBytes(key);
}

export function encryptAssistantStore(
  store: AssistantStore,
  key: Uint8Array,
  nonce: Uint8Array
): string {
  const plaintext = utf8ToBytes(JSON.stringify(store));
  const ciphertext = gcm(key, nonce, associatedData(store.userId)).encrypt(plaintext);
  const envelope: EncryptedEnvelope = {
    algorithm: "AES-256-GCM",
    ciphertext: bytesToBase64(ciphertext),
    nonce: bytesToBase64(nonce),
    version: 1
  };
  return JSON.stringify(envelope);
}

export function decryptAssistantStore(
  encrypted: string,
  userId: string,
  key: Uint8Array
): AssistantStore {
  const envelope = JSON.parse(encrypted) as EncryptedEnvelope;
  if (envelope.algorithm !== "AES-256-GCM" || envelope.version !== 1) {
    throw new Error("Unsupported Assistant storage format.");
  }
  const plaintext = gcm(
    key,
    base64ToBytes(envelope.nonce),
    associatedData(userId)
  ).decrypt(base64ToBytes(envelope.ciphertext));
  const store = JSON.parse(bytesToUtf8(plaintext)) as AssistantStore;
  if (store.version !== ASSISTANT_STORE_VERSION || store.userId !== userId) {
    throw new Error("Assistant history belongs to a different account or version.");
  }
  return store;
}
