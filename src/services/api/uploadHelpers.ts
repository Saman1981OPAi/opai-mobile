import { apiConfig } from "@/services/api/apiConfig";
import type { UploadAsset } from "@/services/api/apiTypes";

export function validateUpload(asset: UploadAsset, allowedTypes: readonly string[]) {
  if (!allowedTypes.includes(asset.mimeType)) throw new Error("This file type is not supported.");
  if (asset.size !== undefined && asset.size > apiConfig.maxUploadBytes) throw new Error("The selected file exceeds the 10 MB limit.");
  return asset;
}
