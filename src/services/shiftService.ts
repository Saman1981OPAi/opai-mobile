import { shiftReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const shiftService = {
  getReminders() {
    return mockApiClient.get(shiftReminders).data;
  },
  createSession() {
    return mockApiClient.post({
      id: "mock-shift-session-001",
      status: "ready",
      reminderCount: shiftReminders.length
    }).data;
  }
};
