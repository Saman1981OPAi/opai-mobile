import * as Notifications from "expo-notifications";
import type { NotificationPermissionStatus } from "@/types/notifications";

function toLocalPermissionStatus(status: Notifications.NotificationPermissionsStatus): NotificationPermissionStatus {
  if (status.granted || status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return "granted";
  }

  if (status.status === "denied") {
    return "denied";
  }

  return "undetermined";
}

export const notificationPermissionService = {
  async checkPermissionStatus(): Promise<NotificationPermissionStatus> {
    const status = await Notifications.getPermissionsAsync();
    return toLocalPermissionStatus(status);
  },

  async requestPermission(): Promise<NotificationPermissionStatus> {
    const status = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true
      }
    });

    return toLocalPermissionStatus(status);
  }
};
