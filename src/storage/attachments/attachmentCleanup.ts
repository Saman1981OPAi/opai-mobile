import * as FileSystem from "expo-file-system/legacy";

const temporaryRoot = `${FileSystem.cacheDirectory ?? ""}opai-vault-temporary/`;

export async function clearAttachmentTemporaryFiles() {
  if (!FileSystem.cacheDirectory) return;
  await FileSystem.deleteAsync(temporaryRoot, { idempotent: true }).catch(() => undefined);
}

