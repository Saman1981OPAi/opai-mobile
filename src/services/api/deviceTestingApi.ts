import { apiClient } from "@/services/api/apiClient";
import type { DeviceTestingExplainResponse } from "@/services/api/apiTypes";

export const deviceTestingApi = {
  explain(guideId: string, question: string, sectionIds: string[] = []) {
    return apiClient.post<DeviceTestingExplainResponse>("/device-testing/explain", {
      guide_id: guideId,
      question,
      section_ids: sectionIds.slice(0, 5)
    });
  }
};
