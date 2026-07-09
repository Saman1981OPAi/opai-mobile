import { CURRENT_STORAGE_VERSION } from "@/storage/storageKeys";
import {
  createDefaultCalendarWorkflowEvents,
  createDefaultCourtWorkflowEvents,
  createDefaultFollowUpWorkflowReminders,
  createDefaultNotificationPreference,
  createDefaultRequalificationWorkflowReminders,
  createDefaultScheduledReminders,
  createDefaultTrainingWorkflowEvents
} from "@/storage/seedDataService";
import type { LocalAppData } from "@/storage/storageTypes";

export const migrationService = {
  migrate(data: LocalAppData): LocalAppData {
    const migrated = {
      ...data,
      calendarWorkflowEvents: data.calendarWorkflowEvents ?? createDefaultCalendarWorkflowEvents(),
      courtWorkflowEvents: data.courtWorkflowEvents ?? createDefaultCourtWorkflowEvents(),
      followUpWorkflowReminders: data.followUpWorkflowReminders ?? createDefaultFollowUpWorkflowReminders(),
      notificationPreference: data.notificationPreference ?? createDefaultNotificationPreference(),
      requalificationWorkflowReminders: data.requalificationWorkflowReminders ?? createDefaultRequalificationWorkflowReminders(),
      scheduledReminders: data.scheduledReminders ?? createDefaultScheduledReminders(),
      trainingWorkflowEvents: data.trainingWorkflowEvents ?? createDefaultTrainingWorkflowEvents()
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
