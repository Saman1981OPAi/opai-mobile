/** Legacy plaintext record retained only until encrypted Assistant migration verifies. */
export type AIConversation = {
  id: string;
  prompt: string;
  mockResponse: string;
  requestId?: string;
  verificationRequired?: boolean;
  warnings?: string[];
  summary?: string;
  missingInformation?: string[];
  sources?: { title: string; url?: string | null }[];
  refusalReason?: string;
  relatedIncidentId?: string;
  relatedNoteId?: string;
  createdAt: string;
  updatedAt: string;
};

export type AIPreferences = {
  saveHistory: boolean;
  protectedStorageVersion: number;
  lastUpdatedAt: string;
};
