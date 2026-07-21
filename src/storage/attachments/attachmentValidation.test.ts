import assert from "node:assert/strict";
import test from "node:test";
import { validateAttachmentImport } from "./attachmentValidation.ts";

test("attachment validation accepts approved local image", () => {
  assert.deepEqual(
    validateAttachmentImport(
      {
        extension: "jpg",
        mediaType: "image",
        mimeType: "image/jpeg",
        sourceUri: "file:///synthetic/photo.jpg"
      },
      1024
    ),
    { extension: "jpg", mimeType: "image/jpeg" }
  );
});

test("attachment validation rejects mismatched extension", () => {
  assert.throws(() =>
    validateAttachmentImport(
      {
        extension: "png",
        mediaType: "image",
        mimeType: "image/jpeg",
        sourceUri: "file:///synthetic/photo.png"
      },
      1024
    )
  );
});

test("attachment validation rejects remote and oversized content", () => {
  assert.throws(() =>
    validateAttachmentImport(
      { mediaType: "audio", mimeType: "audio/mp4", sourceUri: "https://example.invalid/audio.m4a" },
      1024
    )
  );
  assert.throws(() =>
    validateAttachmentImport(
      { mediaType: "audio", mimeType: "audio/mp4", sourceUri: "file:///synthetic/audio.m4a" },
      30 * 1024 * 1024
    )
  );
});

