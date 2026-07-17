import * as FileSystem from "expo-file-system/legacy";
import type { AudioStatement, AudioStatementRecording } from "@/features/audioStatement/audioStatementTypes";
import {
  validateAudioStatementRecording,
  validateAudioStatementTitle
} from "@/features/audioStatement/audioStatementValidation";

const directory = `${FileSystem.documentDirectory ?? ""}audio-statements/`;

function createId() {
  return `audio-statement-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function ensureDirectory() {
  if (!FileSystem.documentDirectory) throw new Error("Local recording storage is unavailable.");
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
}

async function persistRecording(recording: AudioStatementRecording, id: string) {
  await ensureDirectory();
  const extension = recording.mimeType === "audio/webm" ? "webm" : "m4a";
  const target = `${directory}${id}.${extension}`;
  if (recording.localUri !== target) {
    await FileSystem.copyAsync({ from: recording.localUri, to: target });
    await FileSystem.deleteAsync(recording.localUri, { idempotent: true }).catch(() => undefined);
  }
  const info = await FileSystem.getInfoAsync(target);
  if (!info.exists) throw new Error("The recording could not be saved.");
  return { localUri: target, fileSizeBytes: "size" in info ? info.size : 0 };
}

async function deleteRecording(statement: AudioStatement) {
  await FileSystem.deleteAsync(statement.localUri, { idempotent: true });
}

export const audioStatementRepository = {
  async create(recordingInput: AudioStatementRecording, titleInput?: string): Promise<AudioStatement> {
    const recording = validateAudioStatementRecording(recordingInput);
    const id = createId();
    const persisted = await persistRecording(recording, id);
    const timestamp = new Date().toISOString();
    return {
      id,
      title: validateAudioStatementTitle(titleInput || `Audio Statement ${new Date().toLocaleDateString("en-CA")}`),
      localUri: persisted.localUri,
      createdAt: timestamp,
      updatedAt: timestamp,
      durationSeconds: recording.durationSeconds,
      fileSizeBytes: persisted.fileSizeBytes,
      mimeType: recording.mimeType,
      transcriptionStatus: "notRequested",
      transcriptionRequestKey: `${id}-${Date.now()}`
    };
  },

  rename(statement: AudioStatement, title: string): AudioStatement {
    return { ...statement, title: validateAudioStatementTitle(title), updatedAt: new Date().toISOString() };
  },

  async delete(statement: AudioStatement) {
    await deleteRecording(statement);
  },

  async deleteAll(statements: AudioStatement[]) {
    await Promise.all(statements.map((statement) => deleteRecording(statement).catch(() => undefined)));
    if (FileSystem.documentDirectory) {
      await FileSystem.deleteAsync(directory, { idempotent: true }).catch(() => undefined);
    }
  }
};
