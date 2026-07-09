export type TranslationMode = "text" | "voice" | "conversation" | "camera" | "document";

export type TranslationLanguage =
  | "English"
  | "French"
  | "Arabic"
  | "Farsi / Persian"
  | "Spanish"
  | "Mandarin"
  | "Punjabi"
  | "Urdu"
  | "Hindi"
  | "Russian"
  | "Ukrainian"
  | "Portuguese"
  | "Other";

export type TranslationPreferences = {
  preferredSourceLanguage: TranslationLanguage;
  preferredTargetLanguage: TranslationLanguage;
  saveToHistory: boolean;
  lastUpdatedAt: string;
};

export type TranslationRecord = {
  id: string;
  mode: TranslationMode;
  sourceLanguage: TranslationLanguage;
  targetLanguage: TranslationLanguage;
  sourceText: string;
  translatedText: string;
  createdAt: string;
  relatedIncidentId: string;
  notes: string;
};

