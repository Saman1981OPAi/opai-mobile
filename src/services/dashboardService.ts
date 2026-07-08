import { calendarEvents, followUpReminders, homeFeatures } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const dashboardService = {
  getDashboard() {
    return mockApiClient.get({
      features: homeFeatures,
      upcoming: calendarEvents,
      followUps: followUpReminders
    }).data;
  },
  getReminders() {
    return mockApiClient.get(followUpReminders).data;
  },
  getUpcoming() {
    return mockApiClient.get(calendarEvents).data;
  }
};
