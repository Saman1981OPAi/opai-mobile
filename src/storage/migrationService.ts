import { CURRENT_STORAGE_VERSION } from "@/storage/storageKeys";
import {
  createDefaultCalendarWorkflowEvents,
  createDefaultCourtWorkflowEvents,
  createDefaultFileMetadataPlaceholders,
  createDefaultFollowUpWorkflowReminders,
  createDefaultAIPreferences,
  createDefaultNoteFolders,
  createDefaultNotificationPreference,
  createDefaultRequalificationWorkflowReminders,
  createDefaultScheduledReminders,
  createDefaultStructuredNotes,
  createDefaultTranslationPreferences,
  createDefaultTrainingWorkflowEvents,
  normalizeAIHistory,
  normalizeFileMetadataPlaceholders,
  normalizeIncidentDrafts,
  normalizeNoteFolders,
  normalizeStructuredNotes,
  normalizeTranslationHistory
} from "@/storage/seedDataService";
import type { LocalAppData } from "@/storage/storageTypes";
import type { ConsentState } from "@/types/auth";

const normalizeConsent = (consent: Partial<ConsentState> | undefined): ConsentState => ({
  aiDisclaimer: Boolean(consent?.aiDisclaimer),
  aiProcessing: Boolean(consent?.aiProcessing),
  privacy: Boolean(consent?.privacy),
  prototypeDisclaimer: Boolean(consent?.prototypeDisclaimer),
  ptsdDisclaimer: Boolean(consent?.ptsdDisclaimer),
  terms: Boolean(consent?.terms),
  translationDisclaimer: Boolean(consent?.translationDisclaimer)
});

export const migrationService = {
  migrate(data: LocalAppData): LocalAppData {
    const migrated = {
      ...data,
      audioStatements: data.audioStatements ?? [],
      auth: {
        ...data.auth,
        consent: normalizeConsent(data.auth.consent),
        consentAcceptedAt: data.auth.consentAcceptedAt ?? {}
      },
      aiHistory: normalizeAIHistory(data.aiHistory),
      aiPreferences: data.aiPreferences ?? createDefaultAIPreferences(),
      calendarWorkflowEvents: data.calendarWorkflowEvents ?? createDefaultCalendarWorkflowEvents(),
      courtWorkflowEvents: data.courtWorkflowEvents ?? createDefaultCourtWorkflowEvents(),
      fileMetadataPlaceholders: normalizeFileMetadataPlaceholders(data.fileMetadataPlaceholders ?? createDefaultFileMetadataPlaceholders()),
      followUpWorkflowReminders: data.followUpWorkflowReminders ?? createDefaultFollowUpWorkflowReminders(),
      incidentDrafts: normalizeIncidentDrafts(data.incidentDrafts),
      noteFolders: normalizeNoteFolders(data.noteFolders ?? createDefaultNoteFolders()),
      notificationPreference: data.notificationPreference ?? createDefaultNotificationPreference(),
      preferences: {
        ...data.preferences,
        consentStatus: normalizeConsent(data.preferences.consentStatus)
      },
      requalificationWorkflowReminders: data.requalificationWorkflowReminders ?? createDefaultRequalificationWorkflowReminders(),
      scheduledReminders: data.scheduledReminders ?? createDefaultScheduledReminders(),
      structuredNotes: normalizeStructuredNotes(data.structuredNotes ?? createDefaultStructuredNotes()),
      trainingWorkflowEvents: data.trainingWorkflowEvents ?? createDefaultTrainingWorkflowEvents(),
      translationHistory: normalizeTranslationHistory(data.translationHistory),
      translationPreferences: data.translationPreferences ?? createDefaultTranslationPreferences()
    };

    const hasSprint013Fields =
      Array.isArray(data.fileMetadataPlaceholders) &&
      Array.isArray(data.noteFolders) &&
      Array.isArray(data.structuredNotes);

    const hasAudioStatementFields = Array.isArray(data.audioStatements);

    if (migrated.version === CURRENT_STORAGE_VERSION && hasSprint013Fields && hasAudioStatementFields) {
      return data;
    }

    return {
      ...migrated,
      updatedAt: new Date().toISOString(),
      version: CURRENT_STORAGE_VERSION
    };
  }
};
