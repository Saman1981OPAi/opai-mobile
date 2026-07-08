import { incidentExamples, incidentSteps } from "@/data/uiMockups";
import { mockApiClient } from "@/services/mockApiClient";
import type { LocalAppData } from "@/storage/storageTypes";

export const incidentService = {
  getWorkflowSteps() {
    return mockApiClient.get(incidentSteps).data;
  },
  getExamples(localData?: LocalAppData) {
    const localDrafts = localData?.incidentDrafts.map((draft) => ({
      icon: "file-document-edit-outline" as const,
      subtitle: `${draft.status} - ${draft.location}`,
      title: draft.incidentType
    }));

    return mockApiClient.get(localDrafts ?? incidentExamples).data;
  }
};
