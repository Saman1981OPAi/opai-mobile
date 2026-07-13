import { apiClient } from "@/services/api/apiClient";
import type { AIRequestMode, AIResponseContract, AIUsageResponse, ReportAction, ReportResponse } from "@/services/api/apiTypes";

export const aiApi = {
  sendAIMessage(input: { message: string; mode: AIRequestMode; conversationId?: string; previousResponseId?: string }) {
    return aiApi.chat(input);
  },
  chat(input: { message: string; mode: AIRequestMode; conversationId?: string; previousResponseId?: string }) {
    return apiClient.post<AIResponseContract>("/ai/chat", {
      message: input.message,
      mode: input.mode,
      locale: "en-CA",
      conversation_id: input.conversationId,
      previous_response_id: input.previousResponseId,
      attachments: []
    });
  },
  report(suppliedFacts: string, action: ReportAction = "create_draft") {
    return apiClient.post<ReportResponse>("/ai/report", {
      supplied_facts: suppliedFacts,
      action,
      locale: "en-CA"
    });
  },
  usage() {
    return apiClient.get<AIUsageResponse>("/ai/usage");
  },
  getAIUsage() {
    return aiApi.usage();
  },
  deleteConversation(conversationId: string) {
    return apiClient.delete<void>(`/ai/conversations/${encodeURIComponent(conversationId)}`);
  },
  deleteAIConversation(conversationId: string) {
    return aiApi.deleteConversation(conversationId);
  }
};
