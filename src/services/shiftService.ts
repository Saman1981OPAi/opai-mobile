import { shiftReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";
import type { LocalAppData } from "@/storage/storageTypes";

export const shiftService = {
  getReminders(localData?: LocalAppData) {
    return mockApiClient.get(localData?.shiftReminders ?? shiftReminders).data;
  },
  createSession() {
    return mockApiClient.post({
      id: "mock-shift-session-001",
      status: "ready",
      reminderCount: shiftReminders.length
    }).data;
  }
};
