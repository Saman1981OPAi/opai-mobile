import type { AudioStatementTranscriptionResponse } from "@/features/audioStatement/audioStatementTypes";
import { apiClient } from "@/services/api/apiClient";

export type AssistantVoiceAsset = {
  durationSeconds: number;
  mimeType: "audio/mp4" | "audio/webm";
  uri: string;
};

export const assistantVoiceApi = {
  transcribe(asset: AssistantVoiceAsset, requestId: string, signal: AbortSignal) {
    const form = new FormData();
    form.append(
      "file",
      {
        name: asset.mimeType === "audio/webm" ? "opai-prompt.webm" : "opai-prompt.m4a",
        type: asset.mimeType,
        uri: asset.uri
      } as unknown as Blob
    );
    form.append("duration_seconds", String(asset.durationSeconds));
    form.append("audio_statement_id", `assistant-voice-${requestId}`);

    return apiClient.post<AudioStatementTranscriptionResponse>(
      "/audio-statements/transcribe",
      form,
      {
        headers: { "Idempotency-Key": requestId },
        signal,
        timeoutMs: 60_000
      }
    );
  }
};
