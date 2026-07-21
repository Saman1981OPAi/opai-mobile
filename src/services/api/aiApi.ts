import { apiClient } from "@/services/api/apiClient";
import type { AIRequestMode, AIResponseContract, AIUsageResponse, ReportAction, ReportResponse } from "@/services/api/apiTypes";
import type { AssistantContextMessage } from "@/features/assistant/assistantTypes";

type ChatInput = {
  message: string;
  messages?: AssistantContextMessage[];
  mode: AIRequestMode;
  conversationId?: string;
  previousResponseId?: string;
  requestId?: string;
  signal?: AbortSignal;
};

export const aiApi = {
  sendAIMessage(input: ChatInput) {
    return aiApi.chat(input);
  },
  chat(input: ChatInput) {
    const options = {
      ...(input.requestId ? { headers: { "X-Client-Request-ID": input.requestId } } : {}),
      ...(input.signal ? { signal: input.signal } : {})
    };
    return apiClient.post<AIResponseContract>("/ai/chat", {
      message: input.message,
      messages: input.messages ?? [],
      mode: input.mode,
      locale: "en-CA",
      conversation_id: input.conversationId,
      previous_response_id: input.previousResponseId,
      attachments: []
    }, options);
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
