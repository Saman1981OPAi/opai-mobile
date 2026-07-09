import { CURRENT_STORAGE_VERSION } from "@/storage/storageKeys";
import { createDefaultNotificationPreference, createDefaultScheduledReminders } from "@/storage/seedDataService";
import type { LocalAppData } from "@/storage/storageTypes";

export const migrationService = {
  migrate(data: LocalAppData): LocalAppData {
    const migrated = {
      ...data,
      notificationPreference: data.notificationPreference ?? createDefaultNotificationPreference(),
      scheduledReminders: data.scheduledReminders ?? createDefaultScheduledReminders()
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
