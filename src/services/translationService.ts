import { translationExamples, translationModes } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const translationService = {
  getModes() {
    return mockApiClient.get(translationModes).data;
  },
  getExamples() {
    return mockApiClient.get(translationExamples).data;
  }
};
