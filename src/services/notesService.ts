import { notesFiles } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const notesService = {
  getNotesAndFiles() {
    return mockApiClient.get(notesFiles).data;
  }
};
