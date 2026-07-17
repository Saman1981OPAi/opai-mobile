export type AudioStatementTranscriptionStatus = "notRequested" | "transcribing" | "completed" | "failed";

export type AudioStatement = {
  id: string;
  title: string;
  localUri: string;
  createdAt: string;
  updatedAt: string;
  durationSeconds: number;
  fileSizeBytes: number;
  mimeType: string;
  transcriptionStatus: AudioStatementTranscriptionStatus;
  transcriptionRequestKey: string;
  originalAiTranscript?: string;
  editedTranscript?: string;
  detectedLanguage?: string;
  translatedText?: string;
  targetLanguage?: string;
  notes?: string;
};

export type AudioStatementRecording = {
  localUri: string;
  durationSeconds: number;
  mimeType: string;
};

export type AudioStatementTranscriptionResponse = {
  requestId: string;
  transcript: string;
  detectedLanguage?: string;
  durationSeconds: number;
  uncertaintyWarnings: string[];
  verificationRequired: boolean;
  usageCharged: boolean;
  providerModel: string;
  refusalReason?: string;
};
