import { calendarEvents, followUpReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const calendarService = {
  getEvents() {
    return mockApiClient.get(calendarEvents).data;
  },
  getFollowUps() {
    return mockApiClient.get(followUpReminders).data;
  }
};
