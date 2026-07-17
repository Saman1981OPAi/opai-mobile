import type { AudioStatement, AudioStatementRecording } from "@/features/audioStatement/audioStatementTypes";
import {
  AUDIO_STATEMENT_MAX_TITLE_LENGTH,
  normalizeAudioStatementTitle,
  validateAudioDuration
} from "@/features/audioStatement/audioStatementValidationCore";
import { apiConfig } from "@/services/api/apiConfig";

export { AUDIO_STATEMENT_MAX_TITLE_LENGTH };

const allowedMimeTypes = new Set([
  "audio/flac",
  "audio/m4a",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/x-m4a"
]);

export function validateAudioStatementTitle(title: string) {
  return normalizeAudioStatementTitle(title);
}

export function validateAudioStatementRecording(recording: AudioStatementRecording) {
  if (!recording.localUri.startsWith("file:")) throw new Error("The recording is not available on this device.");
  if (!allowedMimeTypes.has(recording.mimeType)) throw new Error("This audio format is not supported.");
  validateAudioDuration(recording.durationSeconds, apiConfig.maxAudioSeconds);
  return recording;
}

export function canTranscribeAudioStatement(statement: AudioStatement) {
  if (statement.fileSizeBytes > apiConfig.maxUploadBytes) throw new Error("The recording exceeds the 10 MB transcription limit.");
  validateAudioStatementRecording(statement);
  return statement;
}
