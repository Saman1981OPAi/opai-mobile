import type { LocalAppData, LocalIncidentDraft } from "@/storage/storageTypes";
import type { TranslationLanguage, TranslationMode, TranslationPreferences, TranslationRecord } from "@/types/translation";

export const supportedTranslationLanguages: TranslationLanguage[] = [
  "English",
  "French",
  "Arabic",
  "Farsi / Persian",
  "Spanish",
  "Mandarin",
  "Punjabi",
  "Urdu",
  "Hindi",
  "Russian",
  "Ukrainian",
  "Portuguese",
  "Other"
];

export const translationModes: Array<{
  id: TranslationMode | "history";
  label: string;
  notice: string;
}> = [
  { id: "text", label: "Text", notice: "Mock text translation only." },
  { id: "voice", label: "Voice", notice: "Voice translation placeholder. No microphone access." },
  { id: "conversation", label: "Conversation", notice: "Two-person conversation placeholder." },
  { id: "camera", label: "Camera/OCR", notice: "Camera and OCR placeholder. No image processing." },
  { id: "document", label: "Document", notice: "Document placeholder. No file upload." },
  { id: "history", label: "History", notice: "Local prototype history only." }
];

export const translationService = {
  getSupportedLanguages() {
    return supportedTranslationLanguages;
  },

  getTranslationModes() {
    return translationModes;
  },

  getTranslationPreferences(localData: LocalAppData): TranslationPreferences {
    return localData.translationPreferences;
  },

  saveTranslationPreferences(localData: LocalAppData, preferences: TranslationPreferences): LocalAppData {
    return {
      ...localData,
      translationPreferences: preferences,
      updatedAt: new Date().toISOString()
    };
  },

  mockTranslateText(sourceText: string) {
    const trimmed = sourceText.trim();
    return trimmed.length > 0
      ? `[Mock Translation] This feature is currently in testing. Future versions may provide real-time translation support. Source preview: ${trimmed.slice(0, 80)}`
      : "[Mock Translation] Enter prototype text to preview a future translation result.";
  },

  getTranslationHistory(localData: LocalAppData) {
    return localData.translationHistory;
  },

  saveTranslationRecord(localData: LocalAppData, record: TranslationRecord): LocalAppData {
    return {
      ...localData,
      translationHistory: [
        record,
        ...localData.translationHistory.filter((item) => item.id !== record.id)
      ].slice(0, 40),
      updatedAt: new Date().toISOString()
    };
  },

  deleteTranslationRecord(localData: LocalAppData, id: string): LocalAppData {
    return {
      ...localData,
      translationHistory: localData.translationHistory.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString()
    };
  },

  clearTranslationHistory(localData: LocalAppData): LocalAppData {
    return {
      ...localData,
      translationHistory: [],
      updatedAt: new Date().toISOString()
    };
  },

  attachTranslationToIncidentDraft(record: TranslationRecord, incident: LocalIncidentDraft): TranslationRecord {
    return {
      ...record,
      notes: `${record.notes}${record.notes ? " " : ""}Linked locally to incident draft: ${incident.incidentType}.`,
      relatedIncidentId: incident.id
    };
  }
};
