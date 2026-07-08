import { calendarEvents, followUpReminders, trainingReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const notificationService = {
  getNotifications() {
    return mockApiClient.get([...calendarEvents, ...trainingReminders, ...followUpReminders]).data;
  },
  getPreferences() {
    return mockApiClient.get({
      courtReminders: true,
      persistentReminders: true,
      requalificationReminders: true,
      shiftReminders: true
    }).data;
  }
};
