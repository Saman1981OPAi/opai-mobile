import { apiClient } from "@/services/api/apiClient";
import { apiConfig } from "@/services/api/apiConfig";
import type { TranslationResponse, UploadAsset } from "@/services/api/apiTypes";

function validateAsset(asset: UploadAsset) {
  if (asset.size !== undefined && asset.size > apiConfig.maxUploadBytes) {
    throw new Error("The selected file exceeds the 10 MB limit.");
  }
}

function uploadForm(asset: UploadAsset, targetLanguage: string) {
  validateAsset(asset);
  const form = new FormData();
  form.append("file", { uri: asset.uri, name: asset.name, type: asset.mimeType } as unknown as Blob);
  form.append("target_language", targetLanguage);
  return form;
}

export const translationApi = {
  clearTranslationHistory() {
    return apiClient.delete<void>("/translation/history");
  },
  deleteTranslationHistoryItem(id: string) {
    return apiClient.delete<void>(`/translation/history/${encodeURIComponent(id)}`);
  },
  text(input: { text: string; sourceLanguage?: string; targetLanguage: string }) {
    return apiClient.post<TranslationResponse>("/translation/text", {
      text: input.text,
      source_language: input.sourceLanguage,
      target_language: input.targetLanguage,
      preserve_formatting: true,
      context: "Canadian policing productivity assistance",
      style: "plain"
    });
  },
  audio(asset: UploadAsset, targetLanguage: string, durationSeconds: number, sourceLanguage?: string) {
    if (durationSeconds > apiConfig.maxAudioSeconds) throw new Error("Audio must be 120 seconds or shorter.");
    const form = uploadForm(asset, targetLanguage);
    form.append("duration_seconds", String(durationSeconds));
    if (sourceLanguage) form.append("source_language", sourceLanguage);
    return apiClient.post<TranslationResponse>("/translation/audio", form);
  },
  image(asset: UploadAsset, targetLanguage: string) {
    return apiClient.post<TranslationResponse>("/translation/image", uploadForm(asset, targetLanguage));
  },
  document(asset: UploadAsset, targetLanguage: string) {
    return apiClient.post<TranslationResponse>("/translation/document", uploadForm(asset, targetLanguage));
  }
};
