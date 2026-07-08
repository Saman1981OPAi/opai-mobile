import { calendarEvents, followUpReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";
import type { LocalAppData } from "@/storage/storageTypes";

export const calendarService = {
  getEvents(localData?: LocalAppData) {
    return mockApiClient.get(localData?.calendarEvents ?? calendarEvents).data;
  },
  getFollowUps(localData?: LocalAppData) {
    return mockApiClient.get(localData?.followUpReminders ?? followUpReminders).data;
  }
};
