import { calendarEvents, followUpReminders, homeFeatures } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";
import type { LocalAppData } from "@/storage/storageTypes";

export const dashboardService = {
  getDashboard(localData?: LocalAppData) {
    return mockApiClient.get({
      features: homeFeatures,
      followUps: localData?.followUpReminders ?? followUpReminders,
      upcoming: localData?.calendarEvents ?? calendarEvents
    }).data;
  },
  getReminders(localData?: LocalAppData) {
    return mockApiClient.get(localData?.followUpReminders ?? followUpReminders).data;
  },
  getUpcoming(localData?: LocalAppData) {
    return mockApiClient.get(localData?.calendarEvents ?? calendarEvents).data;
  }
};
