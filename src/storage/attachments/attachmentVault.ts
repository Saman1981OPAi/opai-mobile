import * as FileSystem from "expo-file-system/legacy";
import { getRandomBytesAsync } from "expo-crypto";
import { protectedKeyService } from "@/storage/protected/protectedKeyService";
import { safeProtectedSegment } from "@/storage/protected/protectedStorageValidation";
import { decryptAttachmentContent, encryptAttachmentContent } from "./attachmentCrypto";
import { attachmentMetadataRepository } from "./attachmentMetadataRepository";
import type { AttachmentImport, ProtectedAttachmentMetadata } from "./attachmentTypes";
import { validateAttachmentImport } from "./attachmentValidation";

const vaultRoot = `${FileSystem.documentDirectory ?? ""}opai-protected-vault/v1/`;
const temporaryRoot = `${FileSystem.cacheDirectory ?? ""}opai-vault-temporary/`;

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function createOpaqueId() {
  return toHex(await getRandomBytesAsync(20));
}

function userDirectory(userId: string) {
  return `${vaultRoot}${safeProtectedSegment(userId, "User ID")}/`;
}

function encryptedUri(userId: string, id: string) {
  return `${userDirectory(userId)}${safeProtectedSegment(id, "Attachment ID")}.vault`;
}

async function ensureDirectories(userId: string) {
  if (!FileSystem.documentDirectory || !FileSystem.cacheDirectory) {
    throw new Error("Protected attachment storage is unavailable.");
  }
  await FileSystem.makeDirectoryAsync(userDirectory(userId), { intermediates: true });
  await FileSystem.makeDirectoryAsync(temporaryRoot, { intermediates: true });
}

async function fileSize(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists || info.isDirectory) throw new Error("The selected attachment is unavailable.");
  return "size" in info ? info.size : 0;
}

export const attachmentVault = {
  async cleanupOrphans(userId: string, retainedIds: string[] = []) {
    await ensureDirectories(userId);
    const metadata = await attachmentMetadataRepository.list(userId);
    const retained = new Set([...retainedIds, ...metadata.map((item) => item.id)]);
    const files = await FileSystem.readDirectoryAsync(userDirectory(userId));
    const orphans = files.filter((file) => /^[a-f0-9]{40}\.vault$/.test(file) && !retained.has(file.slice(0, -6)));
    await Promise.all(orphans.map((file) => FileSystem.deleteAsync(`${userDirectory(userId)}${file}`, { idempotent: true })));
    return orphans.length;
  },

  async clearUser(userId: string) {
    await Promise.all([
      FileSystem.deleteAsync(userDirectory(userId), { idempotent: true }).catch(() => undefined),
      attachmentMetadataRepository.clear(userId)
    ]);
  },

  async delete(userId: string, id: string) {
    await FileSystem.deleteAsync(encryptedUri(userId, id), { idempotent: true });
    await attachmentMetadataRepository.remove(userId, id);
  },

  async import(userId: string, input: AttachmentImport): Promise<ProtectedAttachmentMetadata> {
    await ensureDirectories(userId);
    const sizeBytes = await fileSize(input.sourceUri);
    const validated = validateAttachmentImport(input, sizeBytes);
    const id = await createOpaqueId();
    const key = await protectedKeyService.getKey(userId, true);
    if (!key) throw new Error("Protected attachment key is unavailable.");
    const sourceBase64 = await FileSystem.readAsStringAsync(input.sourceUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    const timestamp = new Date().toISOString();
    const encrypted = encryptAttachmentContent({
      base64: sourceBase64,
      id,
      key,
      nonce: await getRandomBytesAsync(12),
      now: timestamp,
      userId
    });
    const target = encryptedUri(userId, id);
    await FileSystem.writeAsStringAsync(target, encrypted, { encoding: FileSystem.EncodingType.UTF8 });
    const verification = await FileSystem.readAsStringAsync(target, { encoding: FileSystem.EncodingType.UTF8 });
    const verifiedBase64 = decryptAttachmentContent({ encrypted: verification, id, key, userId });
    if (verifiedBase64.length !== sourceBase64.length) {
      await FileSystem.deleteAsync(target, { idempotent: true }).catch(() => undefined);
      throw new Error("Protected attachment verification failed.");
    }
    const metadata: ProtectedAttachmentMetadata = {
      createdAt: timestamp,
      ...(input.durationSeconds !== undefined ? { durationSeconds: input.durationSeconds } : {}),
      extension: validated.extension,
      id,
      mediaType: input.mediaType,
      mimeType: validated.mimeType,
      sizeBytes,
      transcriptionState: "notRequested",
      updatedAt: timestamp,
      userId,
      version: 1
    };
    await attachmentMetadataRepository.upsert(userId, metadata);
    if (input.deleteSourceAfterImport) {
      await FileSystem.deleteAsync(input.sourceUri, { idempotent: true }).catch(() => undefined);
    }
    return metadata;
  },

  async withTemporaryCopy<T>(
    userId: string,
    metadata: ProtectedAttachmentMetadata,
    operation: (uri: string) => Promise<T>
  ) {
    const temporaryUri = await this.createTemporaryCopy(userId, metadata);
    try {
      return await operation(temporaryUri);
    } finally {
      await this.deleteTemporaryCopy(temporaryUri);
    }
  },

  async createTemporaryCopy(userId: string, metadata: ProtectedAttachmentMetadata) {
    await ensureDirectories(userId);
    if (metadata.userId !== userId) throw new Error("Attachment belongs to a different account.");
    const key = await protectedKeyService.getKey(userId, false);
    if (!key) throw new Error("Protected attachment cannot be unlocked.");
    const encrypted = await FileSystem.readAsStringAsync(encryptedUri(userId, metadata.id), { encoding: FileSystem.EncodingType.UTF8 });
    const base64 = decryptAttachmentContent({ encrypted, id: metadata.id, key, userId });
    const temporaryUri = `${temporaryRoot}${await createOpaqueId()}.${metadata.extension}`;
    await FileSystem.writeAsStringAsync(temporaryUri, base64, { encoding: FileSystem.EncodingType.Base64 });
    return temporaryUri;
  },

  async deleteTemporaryCopy(uri: string) {
    if (!uri.startsWith(temporaryRoot)) throw new Error("Refusing to delete a file outside protected temporary storage.");
    await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => undefined);
  }
};
