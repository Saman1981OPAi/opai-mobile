export type NotificationCategory =
  | "courtReminder"
  | "trainingReminder"
  | "requalificationReminder"
  | "startShiftReminder"
  | "followUpReminder"
  | "calendarEventReminder"
  | "systemReminder";

export type NotificationPermissionStatus = "unknown" | "undetermined" | "granted" | "denied" | "maybeLater";

export type NotificationLeadTime = "atTime" | "15Minutes" | "1Hour" | "1Day" | "1Week";

export type NotificationPreference = {
  enabled: boolean;
  courtRemindersEnabled: boolean;
  trainingRemindersEnabled: boolean;
  requalificationRemindersEnabled: boolean;
  startShiftRemindersEnabled: boolean;
  followUpRemindersEnabled: boolean;
  calendarEventRemindersEnabled: boolean;
  reminderLeadTimes: Record<NotificationCategory, NotificationLeadTime>;
  permissionStatus: NotificationPermissionStatus;
  permissionPromptSeen: boolean;
  lastUpdatedAt: string;
};

export type ScheduledReminder = {
  id: string;
  type: NotificationCategory;
  title: string;
  body: string;
  scheduledAt: string;
  relatedEntityId: string;
  relatedEntityType: "court" | "training" | "requalification" | "shift" | "followUp" | "calendar" | "system";
  enabled: boolean;
  localNotificationId?: string;
  createdAt: string;
  updatedAt: string;
};
