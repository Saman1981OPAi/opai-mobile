import { aiApi } from "@/services/api/aiApi";
import type { ReportAction } from "@/services/api/apiTypes";

export function generateReportDraft(suppliedFacts: string, action: ReportAction = "create_draft") {
  return aiApi.report(suppliedFacts, action);
}
