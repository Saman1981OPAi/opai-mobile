export type AssistantMessageRole = "user" | "assistant";
export type AssistantMessageStatus = "pending" | "complete" | "failed" | "cancelled";

export type AssistantMessage = {
  id: string;
  conversationId: string;
  role: AssistantMessageRole;
  content: string;
  status: AssistantMessageStatus;
  createdAt: string;
  errorCode?: string;
};

export type AssistantConversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AssistantMessage[];
  version: number;
};

export type LegacyAssistantRecord = {
  id?: string;
  prompt?: string;
  mockResponse?: string;
  response?: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AssistantStorageMigration = {
  completedAt: string;
  sourceCount: number;
  version: number;
};

export type AssistantStore = {
  version: number;
  userId: string;
  conversations: AssistantConversation[];
  migration?: AssistantStorageMigration;
  legacyRollback?: LegacyAssistantRecord[];
};

export type AssistantContextMessage = {
  role: AssistantMessageRole;
  content: string;
};

export const ASSISTANT_STORE_VERSION = 1;
export const ASSISTANT_CONVERSATION_VERSION = 1;
export const ASSISTANT_CONTEXT_MESSAGE_LIMIT = 12;
export const ASSISTANT_CONTEXT_CHARACTER_LIMIT = 18_000;

export function createStableId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${random}`;
}

export function createConversation(now = new Date().toISOString()): AssistantConversation {
  return {
    createdAt: now,
    id: createStableId("assistant-conversation"),
    messages: [],
    title: "New conversation",
    updatedAt: now,
    version: ASSISTANT_CONVERSATION_VERSION
  };
}

export function createMessage(
  conversationId: string,
  role: AssistantMessageRole,
  content: string,
  status: AssistantMessageStatus,
  now = new Date().toISOString()
): AssistantMessage {
  return {
    content,
    conversationId,
    createdAt: now,
    id: createStableId(`assistant-${role}`),
    role,
    status
  };
}

export function conversationTitle(content: string) {
  const compact = content.trim().replace(/\s+/g, " ");
  if (!compact) return "New conversation";
  return compact.length > 46 ? `${compact.slice(0, 43)}...` : compact;
}

export function buildBoundedContext(messages: AssistantMessage[]): AssistantContextMessage[] {
  const eligible = messages.filter(
    (message) =>
      message.content.trim().length > 0 &&
      message.status === "complete" &&
      !message.errorCode
  );
  const bounded: AssistantContextMessage[] = [];
  let characters = 0;

  for (let index = eligible.length - 1; index >= 0; index -= 1) {
    const message = eligible[index];
    if (!message) continue;
    if (bounded.length >= ASSISTANT_CONTEXT_MESSAGE_LIMIT) break;
    if (bounded.length > 0 && characters + message.content.length > ASSISTANT_CONTEXT_CHARACTER_LIMIT) break;
    bounded.unshift({ content: message.content, role: message.role });
    characters += message.content.length;
  }

  return bounded;
}

export function migrateLegacyRecords(records: LegacyAssistantRecord[]): AssistantConversation[] {
  return records.map((record, index) => {
    const createdAt = record.createdAt ?? new Date().toISOString();
    const id = record.id ? `migrated-${record.id}` : `migrated-assistant-${index + 1}`;
    const prompt = record.prompt ?? record.title ?? "Previous OPAi message";
    const answer =
      record.mockResponse ??
      record.response ??
      "Previous response unavailable. Verify information before use.";
    return {
      createdAt,
      id,
      messages: [
        {
          content: prompt,
          conversationId: id,
          createdAt,
          id: `${id}-user`,
          role: "user",
          status: "complete"
        },
        {
          content: answer,
          conversationId: id,
          createdAt: record.updatedAt ?? createdAt,
          id: `${id}-assistant`,
          role: "assistant",
          status: "complete"
        }
      ],
      title: conversationTitle(prompt),
      updatedAt: record.updatedAt ?? createdAt,
      version: ASSISTANT_CONVERSATION_VERSION
    };
  });
}

export function assistantErrorMessage(code: string) {
  if (code === "NETWORK_ERROR") return "Offline. Your message is saved; reconnect and retry.";
  if (code === "TIMEOUT" || code === "REFRESH_TIMEOUT" || code === "PROVIDER_TIMEOUT") return "The request timed out. Retry when ready.";
  if (code === "SESSION_EXPIRED") return "Your session expired. Sign in again.";
  if (code === "REQUEST_CANCELLED") return "Response stopped.";
  if (code === "DAILY_QUOTA_REACHED") return "Daily AI usage limit reached.";
  if (code === "RATE_LIMITED" || code === "PROVIDER_RATE_LIMITED") return "Too many requests. Wait briefly, then retry.";
  if (
    code === "AI_DISABLED" ||
    code === "PROVIDER_UNAVAILABLE" ||
    code === "USAGE_CONTROL_UNAVAILABLE" ||
    code.startsWith("HTTP_5")
  ) return "OPAi is temporarily unavailable.";
  if (
    code === "HTTP_401" ||
    code === "HTTP_403" ||
    code === "INVALID_CREDENTIALS" ||
    code === "TOKEN_INVALID"
  ) return "Authentication failed. Sign in again.";
  return "The response could not be completed. Retry when ready.";
}

export function isSafeAssistantLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function updateAssistantMessage(
  conversations: AssistantConversation[],
  conversationId: string,
  messageId: string,
  update: Partial<Pick<AssistantMessage, "content" | "errorCode" | "status">>,
  updatedAt: string
) {
  return conversations.map((conversation) =>
    conversation.id === conversationId
      ? {
          ...conversation,
          messages: conversation.messages.map((message) =>
            message.id === messageId ? { ...message, ...update } : message
          ),
          updatedAt
        }
      : conversation
  );
}
