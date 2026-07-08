import { trainingReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const trainingService = {
  getEvents() {
    return mockApiClient.get(trainingReminders).data;
  },
  getRequalification() {
    return mockApiClient.get(trainingReminders).data;
  }
};
