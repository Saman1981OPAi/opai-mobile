import { aiTools } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const aiService = {
  getSuggestedActions() {
    return mockApiClient.get(aiTools).data;
  },
  getMockResponse() {
    return mockApiClient.post({
      message:
        "Mock AI preview only. Future responses must be verified and will require secure backend routing."
    }).data;
  }
};
