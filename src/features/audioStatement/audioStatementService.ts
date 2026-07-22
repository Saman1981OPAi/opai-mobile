import type {
  AudioStatement,
  AudioStatementTranscriptionResponse
} from "@/features/audioStatement/audioStatementTypes";
import { canTranscribeAudioStatement } from "@/features/audioStatement/audioStatementValidation";
import { apiClient } from "@/services/api/apiClient";
import { translationApi } from "@/services/api/translationApi";

function uploadForm(statement: AudioStatement, sourceLanguage?: string) {
  canTranscribeAudioStatement(statement);
  const form = new FormData();
  form.append(
    "file",
    {
      name: `audio-statement.${statement.mimeType === "audio/webm" ? "webm" : "m4a"}`,
      type: statement.mimeType,
      uri: statement.localUri
    } as unknown as Blob
  );
  form.append("duration_seconds", String(statement.durationSeconds));
  form.append("audio_statement_id", statement.id);
  if (sourceLanguage) form.append("source_language", sourceLanguage);
  return form;
}

export const audioStatementService = {
  transcribe(statement: AudioStatement, sourceLanguage?: string, signal?: AbortSignal) {
    return apiClient.post<AudioStatementTranscriptionResponse>(
      "/audio-statements/transcribe",
      uploadForm(statement, sourceLanguage),
      {
        headers: { "Idempotency-Key": statement.transcriptionRequestKey },
        ...(signal ? { signal } : {}),
        timeoutMs: 60_000
      }
    );
  },

  async translateTranscript(text: string, targetLanguage: string, sourceLanguage?: string) {
    return translationApi.text({
      text,
      targetLanguage,
      ...(sourceLanguage ? { sourceLanguage } : {})
    });
  }
};
