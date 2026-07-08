import { courtReminders } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";
import type { LocalAppData } from "@/storage/storageTypes";

export const courtService = {
  getEvents(localData?: LocalAppData) {
    return mockApiClient.get(localData?.courtReminders ?? courtReminders).data;
  }
};
