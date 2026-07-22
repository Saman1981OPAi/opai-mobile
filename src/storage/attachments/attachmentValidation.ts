import type { AttachmentImport, AttachmentMediaType } from "./attachmentTypes.ts";

const supported = {
  audio: new Map([
    ["audio/aac", ["aac"]],
    ["audio/m4a", ["m4a"]],
    ["audio/mp4", ["m4a", "mp4"]],
    ["audio/mpeg", ["mp3"]],
    ["audio/wav", ["wav"]],
    ["audio/webm", ["webm"]],
    ["audio/x-m4a", ["m4a"]]
  ]),
  image: new Map([
    ["image/heic", ["heic"]],
    ["image/heif", ["heif"]],
    ["image/jpeg", ["jpg", "jpeg"]],
    ["image/png", ["png"]]
  ])
} satisfies Record<AttachmentMediaType, Map<string, string[]>>;

export const ATTACHMENT_MAX_BYTES = {
  audio: 25 * 1024 * 1024,
  image: 12 * 1024 * 1024
} as const;

function normalizedExtension(value: string | undefined) {
  return (value ?? "").replace(/^\./, "").trim().toLowerCase();
}

export function inferAttachmentExtension(input: AttachmentImport) {
  const mime = input.mimeType.trim().toLowerCase();
  const allowed = supported[input.mediaType].get(mime);
  if (!allowed) throw new Error(`Unsupported ${input.mediaType} format.`);
  const requested = normalizedExtension(input.extension);
  if (requested && !allowed.includes(requested)) {
    throw new Error("The attachment extension does not match its media type.");
  }
  return requested || allowed[0]!;
}

export function validateAttachmentImport(input: AttachmentImport, sizeBytes: number) {
  if (!input.sourceUri || !/^(file|content|ph):\/\//.test(input.sourceUri)) {
    throw new Error("Select a local attachment from this device.");
  }
  if (!Number.isSafeInteger(sizeBytes) || sizeBytes <= 0) {
    throw new Error("The selected attachment is empty or unreadable.");
  }
  if (sizeBytes > ATTACHMENT_MAX_BYTES[input.mediaType]) {
    const limit = Math.round(ATTACHMENT_MAX_BYTES[input.mediaType] / 1024 / 1024);
    throw new Error(`The selected ${input.mediaType} must be ${limit} MB or smaller.`);
  }
  return {
    extension: inferAttachmentExtension(input),
    mimeType: input.mimeType.trim().toLowerCase()
  };
}
