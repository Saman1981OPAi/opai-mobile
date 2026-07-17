export const AUDIO_STATEMENT_MAX_TITLE_LENGTH = 80;

export function normalizeAudioStatementTitle(title: string) {
  const normalized = title.trim();
  if (!normalized) throw new Error("Add a short title before saving.");
  if (normalized.length > AUDIO_STATEMENT_MAX_TITLE_LENGTH) {
    throw new Error(`Keep the title under ${AUDIO_STATEMENT_MAX_TITLE_LENGTH} characters.`);
  }
  return normalized;
}

export function validateAudioDuration(durationSeconds: number, maxDurationSeconds: number) {
  if (durationSeconds <= 0) throw new Error("The recording is empty.");
  if (durationSeconds > maxDurationSeconds) {
    throw new Error(`Audio Statements must be ${maxDurationSeconds} seconds or shorter.`);
  }
  return durationSeconds;
}
