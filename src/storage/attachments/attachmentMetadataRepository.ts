import { protectedStorage } from "@/storage/protected/protectedStorage";
import { isRecord } from "@/storage/protected/protectedStorageValidation";
import {
  ATTACHMENT_METADATA_SCHEMA_VERSION,
  type AttachmentMetadataStore,
  type ProtectedAttachmentMetadata
} from "./attachmentTypes";

const namespace = "attachment-metadata";

function isMetadata(value: unknown): value is ProtectedAttachmentMetadata {
  if (!isRecord(value)) return false;
  return (
    value.version === 1 &&
    typeof value.createdAt === "string" &&
    (value.durationSeconds === undefined || typeof value.durationSeconds === "number") &&
    typeof value.extension === "string" &&
    typeof value.id === "string" &&
    (value.mediaType === "audio" || value.mediaType === "image") &&
    typeof value.mimeType === "string" &&
    typeof value.sizeBytes === "number" &&
    typeof value.transcriptionState === "string" &&
    typeof value.updatedAt === "string" &&
    typeof value.userId === "string"
  );
}

function isStore(value: unknown): value is AttachmentMetadataStore {
  return (
    isRecord(value) &&
    value.version === ATTACHMENT_METADATA_SCHEMA_VERSION &&
    typeof value.userId === "string" &&
    Array.isArray(value.attachments) &&
    value.attachments.every(isMetadata)
  );
}

function options(userId: string) {
  return {
    namespace,
    schemaVersion: ATTACHMENT_METADATA_SCHEMA_VERSION,
    userId,
    validate: isStore
  };
}

export const attachmentMetadataRepository = {
  async clear(userId: string) {
    await protectedStorage.remove(options(userId));
  },

  async list(userId: string) {
    return (await protectedStorage.load(options(userId)))?.data.attachments ?? [];
  },

  async remove(userId: string, id: string) {
    const attachments = await this.list(userId);
    await this.save(userId, attachments.filter((attachment) => attachment.id !== id));
  },

  async save(userId: string, attachments: ProtectedAttachmentMetadata[]) {
    await protectedStorage.save(options(userId), {
      attachments,
      userId,
      version: ATTACHMENT_METADATA_SCHEMA_VERSION
    });
  },

  async upsert(userId: string, metadata: ProtectedAttachmentMetadata) {
    const attachments = await this.list(userId);
    await this.save(userId, [metadata, ...attachments.filter((item) => item.id !== metadata.id)]);
  }
};
