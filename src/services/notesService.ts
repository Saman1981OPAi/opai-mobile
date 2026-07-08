import { notesFiles } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";
import type { LocalAppData } from "@/storage/storageTypes";

export const notesService = {
  getNotesAndFiles(localData?: LocalAppData) {
    return mockApiClient.get(localData?.notesFiles ?? notesFiles).data;
  }
};
