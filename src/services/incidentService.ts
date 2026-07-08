import { incidentExamples, incidentSteps } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";

export const incidentService = {
  getWorkflowSteps() {
    return mockApiClient.get(incidentSteps).data;
  },
  getExamples() {
    return mockApiClient.get(incidentExamples).data;
  }
};
