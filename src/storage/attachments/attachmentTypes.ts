export const ATTACHMENT_METADATA_SCHEMA_VERSION = 1;

export type AttachmentMediaType = "audio" | "image";
export type AttachmentTranscriptionState = "notRequested" | "pending" | "completed" | "failed";

export type ProtectedAttachmentMetadata = {
  createdAt: string;
  durationSeconds?: number;
  extension: string;
  id: string;
  mediaType: AttachmentMediaType;
  mimeType: string;
  sizeBytes: number;
  transcriptionState: AttachmentTranscriptionState;
  updatedAt: string;
  userId: string;
  version: 1;
};

export type AttachmentMetadataStore = {
  attachments: ProtectedAttachmentMetadata[];
  userId: string;
  version: typeof ATTACHMENT_METADATA_SCHEMA_VERSION;
};

export type AttachmentImport = {
  deleteSourceAfterImport?: boolean;
  durationSeconds?: number;
  extension?: string;
  mediaType: AttachmentMediaType;
  mimeType: string;
  sourceUri: string;
};
