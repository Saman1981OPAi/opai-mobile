import { CURRENT_STORAGE_VERSION } from "@/storage/storageKeys";
import {
  createDefaultAIPreferences,
  createDefaultNoteFolders,
  createDefaultNotificationPreference,
  createDefaultTranslationPreferences,
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
      canvassEntries: data.canvassEntries ?? [],
      canvassSessions: data.canvassSessions ?? [],
      auth: {
        ...data.auth,
        consent: normalizeConsent(data.auth.consent),
        consentAcceptedAt: data.auth.consentAcceptedAt ?? {}
      },
      aiHistory: normalizeAIHistory(data.aiHistory),
      aiPreferences: {
        ...createDefaultAIPreferences(),
        ...(data.aiPreferences ?? {}),
        protectedStorageVersion: 1
      },
      calendarWorkflowEvents: data.calendarWorkflowEvents ?? [],
      courtWorkflowEvents: data.courtWorkflowEvents ?? [],
      fileMetadataPlaceholders: normalizeFileMetadataPlaceholders(data.fileMetadataPlaceholders),
      followUpWorkflowReminders: data.followUpWorkflowReminders ?? [],
      incidentDrafts: normalizeIncidentDrafts(data.incidentDrafts),
      noteFolders: normalizeNoteFolders(data.noteFolders ?? createDefaultNoteFolders()),
      notificationPreference: data.notificationPreference ?? createDefaultNotificationPreference(),
      paidDuties: data.paidDuties ?? [],
      preferences: {
        ...data.preferences,
        consentStatus: normalizeConsent(data.preferences.consentStatus)
      },
      requalificationWorkflowReminders: data.requalificationWorkflowReminders ?? [],
      scheduledReminders: data.scheduledReminders ?? [],
      structuredNotes: normalizeStructuredNotes(data.structuredNotes),
      trainingWorkflowEvents: data.trainingWorkflowEvents ?? [],
      translationHistory: normalizeTranslationHistory(data.translationHistory),
      translationPreferences: data.translationPreferences ?? createDefaultTranslationPreferences()
    };

    const hasSprint013Fields =
      Array.isArray(data.fileMetadataPlaceholders) &&
      Array.isArray(data.noteFolders) &&
      Array.isArray(data.structuredNotes);

    const hasAudioStatementFields = Array.isArray(data.audioStatements);
    const hasPaidDutyCanvassFields = Array.isArray(data.paidDuties) && Array.isArray(data.canvassSessions) && Array.isArray(data.canvassEntries);

    if (migrated.version === CURRENT_STORAGE_VERSION && hasSprint013Fields && hasAudioStatementFields && hasPaidDutyCanvassFields) {
      return data;
    }

    return {
      ...migrated,
      updatedAt: new Date().toISOString(),
      version: CURRENT_STORAGE_VERSION
    };
  }
};
