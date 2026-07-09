import * as Notifications from "expo-notifications";
import type { ScheduledReminder } from "@/types/notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export type LocalScheduleRequest = {
  id?: string;
  title: string;
  body: string;
  scheduledAt?: string;
  secondsFromNow?: number;
  data?: Record<string, string>;
};

export const notificationScheduler = {
  async scheduleLocalNotification(request: LocalScheduleRequest): Promise<string> {
    const trigger: Notifications.NotificationTriggerInput = request.secondsFromNow
      ? {
          repeats: false,
          seconds: request.secondsFromNow,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL as Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
        }
      : {
          date: new Date(request.scheduledAt ?? Date.now() + 60 * 1000),
          type: Notifications.SchedulableTriggerInputTypes.DATE as Notifications.SchedulableTriggerInputTypes.DATE
        };
    const content: Notifications.NotificationContentInput = {
      body: request.body,
      sound: "default",
      title: request.title
    };

    if (request.data) {
      content.data = request.data;
    }

    const notificationRequest: Notifications.NotificationRequestInput = {
      content,
      trigger
    };

    if (request.id) {
      notificationRequest.identifier = request.id;
    }

    return Notifications.scheduleNotificationAsync(notificationRequest);
  },

  async cancelLocalNotification(localNotificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(localNotificationId);
  },

  async cancelAllLocalNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async listScheduledLocalNotifications(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync();
  },

  async scheduleReminder(reminder: ScheduledReminder): Promise<ScheduledReminder> {
    const localNotificationId = await this.scheduleLocalNotification({
      body: reminder.body,
      data: {
        relatedEntityId: reminder.relatedEntityId,
        relatedEntityType: reminder.relatedEntityType,
        type: reminder.type
      },
      id: reminder.id,
      scheduledAt: reminder.scheduledAt,
      title: reminder.title
    });

    return {
      ...reminder,
      localNotificationId,
      updatedAt: new Date().toISOString()
    };
  }
};
