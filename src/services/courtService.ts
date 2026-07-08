import { courtReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const courtService = {
  getEvents() {
    return mockApiClient.get(courtReminders).data;
  }
};
