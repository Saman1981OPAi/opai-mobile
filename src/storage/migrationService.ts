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

export const migrationService = {
  migrate(data: LocalAppData): LocalAppData {
    const migrated = {
      ...data,
      aiHistory: normalizeAIHistory(data.aiHistory),
      aiPreferences: data.aiPreferences ?? createDefaultAIPreferences(),
      calendarWorkflowEvents: data.calendarWorkflowEvents ?? createDefaultCalendarWorkflowEvents(),
      courtWorkflowEvents: data.courtWorkflowEvents ?? createDefaultCourtWorkflowEvents(),
      fileMetadataPlaceholders: normalizeFileMetadataPlaceholders(data.fileMetadataPlaceholders ?? createDefaultFileMetadataPlaceholders()),
      followUpWorkflowReminders: data.followUpWorkflowReminders ?? createDefaultFollowUpWorkflowReminders(),
      incidentDrafts: normalizeIncidentDrafts(data.incidentDrafts),
      noteFolders: normalizeNoteFolders(data.noteFolders ?? createDefaultNoteFolders()),
      notificationPreference: data.notificationPreference ?? createDefaultNotificationPreference(),
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

    if (migrated.version === CURRENT_STORAGE_VERSION && hasSprint013Fields) {
      return data;
    }

    return {
      ...migrated,
      updatedAt: new Date().toISOString(),
      version: CURRENT_STORAGE_VERSION
    };
  }
};
