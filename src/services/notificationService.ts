import { notificationPermissionService } from "@/services/notificationPermissionService";
import { notificationScheduler } from "@/services/notificationScheduler";
import type { LocalAppData, LocalCalendarEvent, LocalReminderCard } from "@/storage/storageTypes";
import type { NotificationCategory, NotificationLeadTime, NotificationPreference, ScheduledReminder } from "@/types/notifications";

const leadTimeOffsets: Record<NotificationLeadTime, number> = {
  "15Minutes": 15 * 60 * 1000,
  "1Day": 24 * 60 * 60 * 1000,
  "1Hour": 60 * 60 * 1000,
  "1Week": 7 * 24 * 60 * 60 * 1000,
  atTime: 0
};

const fallbackFutureDate = (hoursFromNow: number, leadTime: NotificationLeadTime) => {
  const target = Date.now() + hoursFromNow * 60 * 60 * 1000 - leadTimeOffsets[leadTime];
  return new Date(Math.max(target, Date.now() + 60 * 1000)).toISOString();
};

function createReminderFromCard(
  item: LocalReminderCard,
  type: NotificationCategory,
  relatedEntityType: ScheduledReminder["relatedEntityType"],
  leadTime: NotificationLeadTime,
  hoursFromNow: number
): ScheduledReminder {
  const now = new Date().toISOString();

  return {
    body: `${item.title}: ${item.subtitle}. Verify official obligations through authorized systems.`,
    createdAt: now,
    enabled: item.enabled,
    id: `notification-${item.id}`,
    relatedEntityId: item.id,
    relatedEntityType,
    scheduledAt: fallbackFutureDate(hoursFromNow, leadTime),
    title: item.title,
    type,
    updatedAt: now
  };
}

function createReminderFromCalendarEvent(
  item: LocalCalendarEvent,
  type: NotificationCategory,
  leadTime: NotificationLeadTime,
  hoursFromNow: number
): ScheduledReminder {
  const now = new Date().toISOString();

  return {
    body: `${item.title} at ${item.time}. Verify schedule details through authorized systems.`,
    createdAt: now,
    enabled: item.reminderEnabled,
    id: `notification-${item.id}`,
    relatedEntityId: item.id,
    relatedEntityType: "calendar",
    scheduledAt: fallbackFutureDate(hoursFromNow, leadTime),
    title: item.title,
    type,
    updatedAt: now
  };
}

export const notificationService = {
  getPreference(localData: LocalAppData): NotificationPreference {
    return localData.notificationPreference;
  },

  getScheduledReminders(localData: LocalAppData): ScheduledReminder[] {
    return localData.scheduledReminders;
  },

  buildScheduledReminderMetadata(localData: LocalAppData): ScheduledReminder[] {
    const preference = localData.notificationPreference;
    const requalificationReminder: ScheduledReminder = {
      body: "Annual qualification deadline demo. Verify official qualification deadlines through authorized systems.",
      createdAt: new Date().toISOString(),
      enabled: preference.requalificationRemindersEnabled,
      id: "notification-requalification-demo",
      relatedEntityId: "requalification-demo",
      relatedEntityType: "requalification",
      scheduledAt: fallbackFutureDate(6, preference.reminderLeadTimes.requalificationReminder),
      title: "Requalification Deadline",
      type: "requalificationReminder",
      updatedAt: new Date().toISOString()
    };

    return [
      ...localData.courtReminders
        .filter((item) => item.enabled && preference.courtRemindersEnabled)
        .map((item, index) =>
          createReminderFromCard(item, "courtReminder", "court", preference.reminderLeadTimes.courtReminder, index + 1)
        ),
      ...localData.trainingReminders
        .filter((item) => item.enabled && preference.trainingRemindersEnabled)
        .map((item, index) =>
          createReminderFromCard(item, "trainingReminder", "training", preference.reminderLeadTimes.trainingReminder, index + 2)
        ),
      ...localData.shiftReminders
        .filter((item) => item.enabled && preference.startShiftRemindersEnabled)
        .slice(0, 2)
        .map((item, index) =>
          createReminderFromCard(item, "startShiftReminder", "shift", preference.reminderLeadTimes.startShiftReminder, index + 3)
        ),
      ...localData.followUpReminders
        .filter((item) => item.enabled && preference.followUpRemindersEnabled)
        .map((item, index) =>
          createReminderFromCard(item, "followUpReminder", "followUp", preference.reminderLeadTimes.followUpReminder, index + 4)
        ),
      ...localData.calendarEvents
        .filter((item) => item.reminderEnabled && preference.calendarEventRemindersEnabled)
        .map((item, index) =>
          createReminderFromCalendarEvent(item, item.kind === "court" ? "courtReminder" : "calendarEventReminder", preference.reminderLeadTimes.calendarEventReminder, index + 5)
        ),
      requalificationReminder
    ].filter((item) => item.enabled);
  },

  async checkPermission() {
    return notificationPermissionService.checkPermissionStatus();
  },

  async requestPermission() {
    return notificationPermissionService.requestPermission();
  },

  async scheduleTestNotification() {
    return notificationScheduler.scheduleLocalNotification({
      body: "This is a local prototype notification. No remote push service was used.",
      data: {
        type: "systemReminder"
      },
      secondsFromNow: 10,
      title: "OPAi Test Reminder"
    });
  },

  async scheduleDemoCourtReminder() {
    return notificationScheduler.scheduleLocalNotification({
      body: "Demo court reminder. Verify official court details through authorized systems.",
      data: {
        relatedEntityType: "court",
        type: "courtReminder"
      },
      secondsFromNow: 10,
      title: "Demo Court Reminder"
    });
  },

  async scheduleDemoTrainingReminder() {
    return notificationScheduler.scheduleLocalNotification({
      body: "Demo training reminder. Confirm official training details through authorized systems.",
      data: {
        relatedEntityType: "training",
        type: "trainingReminder"
      },
      secondsFromNow: 10,
      title: "Demo Training Reminder"
    });
  },

  async scheduleReminder(reminder: ScheduledReminder) {
    return notificationScheduler.scheduleReminder(reminder);
  },

  async cancelAll() {
    return notificationScheduler.cancelAllLocalNotifications();
  },

  async listScheduledLocalNotifications() {
    return notificationScheduler.listScheduledLocalNotifications();
  }
};
