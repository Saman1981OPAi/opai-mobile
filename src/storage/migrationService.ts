import { CURRENT_STORAGE_VERSION } from "@/storage/storageKeys";
import {
  createDefaultCalendarWorkflowEvents,
  createDefaultCourtWorkflowEvents,
  createDefaultFollowUpWorkflowReminders,
  createDefaultAIPreferences,
  createDefaultNotificationPreference,
  createDefaultRequalificationWorkflowReminders,
  createDefaultScheduledReminders,
  createDefaultTranslationPreferences,
  createDefaultTrainingWorkflowEvents,
  normalizeAIHistory,
  normalizeIncidentDrafts,
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
      followUpWorkflowReminders: data.followUpWorkflowReminders ?? createDefaultFollowUpWorkflowReminders(),
      incidentDrafts: normalizeIncidentDrafts(data.incidentDrafts),
      notificationPreference: data.notificationPreference ?? createDefaultNotificationPreference(),
      requalificationWorkflowReminders: data.requalificationWorkflowReminders ?? createDefaultRequalificationWorkflowReminders(),
      scheduledReminders: data.scheduledReminders ?? createDefaultScheduledReminders(),
      trainingWorkflowEvents: data.trainingWorkflowEvents ?? createDefaultTrainingWorkflowEvents(),
      translationHistory: normalizeTranslationHistory(data.translationHistory),
      translationPreferences: data.translationPreferences ?? createDefaultTranslationPreferences()
    };

    if (migrated.version === CURRENT_STORAGE_VERSION) {
      return data;
    }

    return {
      ...migrated,
      updatedAt: new Date().toISOString(),
      version: CURRENT_STORAGE_VERSION
    };
  }
};
