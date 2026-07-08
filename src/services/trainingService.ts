import { trainingReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";
import type { LocalAppData } from "@/storage/storageTypes";

export const trainingService = {
  getEvents(localData?: LocalAppData) {
    return mockApiClient.get(localData?.trainingReminders ?? trainingReminders).data;
  },
  getRequalification(localData?: LocalAppData) {
    return mockApiClient.get(localData?.trainingReminders ?? trainingReminders).data;
  }
};
