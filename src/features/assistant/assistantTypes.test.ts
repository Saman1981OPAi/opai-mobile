import assert from "node:assert/strict";
import test from "node:test";
import {
  ASSISTANT_CONTEXT_CHARACTER_LIMIT,
  ASSISTANT_CONTEXT_MESSAGE_LIMIT,
  buildBoundedContext,
  isSafeAssistantLink,
  migrateLegacyRecords,
  updateAssistantMessage,
  type AssistantConversation,
  type AssistantMessage
} from "./assistantTypes.ts";

function message(index: number, role: "user" | "assistant", content = `message-${index}`): AssistantMessage {
  return {
    content,
    conversationId: "conversation-1",
    createdAt: `2026-07-20T00:00:${String(index).padStart(2, "0")}.000Z`,
    id: `message-${index}`,
    role,
    status: "complete"
  };
}

test("legacy records migrate into stable ordered two-message conversations", () => {
  const legacy = [{
    createdAt: "2026-07-01T10:00:00.000Z",
    id: "legacy-1",
    mockResponse: "Previous answer",
    prompt: "Previous question",
    updatedAt: "2026-07-01T10:01:00.000Z"
  }];

  const first = migrateLegacyRecords(legacy);
  const second = migrateLegacyRecords(legacy);

  assert.deepEqual(second, first);
  assert.equal(first[0]?.id, "migrated-legacy-1");
  assert.deepEqual(first[0]?.messages.map((item) => item.role), ["user", "assistant"]);
  assert.deepEqual(first[0]?.messages.map((item) => item.content), ["Previous question", "Previous answer"]);
});

test("bounded context preserves chronological order and the newest message", () => {
  const messages = Array.from({ length: ASSISTANT_CONTEXT_MESSAGE_LIMIT + 4 }, (_, index) =>
    message(index, index % 2 === 0 ? "user" : "assistant")
  );
  const context = buildBoundedContext(messages);

  assert.equal(context.length, ASSISTANT_CONTEXT_MESSAGE_LIMIT);
  assert.equal(context.at(-1)?.content, messages.at(-1)?.content);
  assert.equal(context[0]?.content, messages.at(-ASSISTANT_CONTEXT_MESSAGE_LIMIT)?.content);
});

test("bounded context excludes failed, cancelled, pending, and error messages", () => {
  const messages: AssistantMessage[] = [
    message(1, "user", "keep"),
    { ...message(2, "assistant", "pending"), status: "pending" },
    { ...message(3, "assistant", "failed"), errorCode: "TIMEOUT", status: "failed" },
    { ...message(4, "assistant", "cancelled"), status: "cancelled" }
  ];
  assert.deepEqual(buildBoundedContext(messages), [{ content: "keep", role: "user" }]);
});

test("bounded context enforces the character budget without dropping the newest item", () => {
  const content = "a".repeat(Math.floor(ASSISTANT_CONTEXT_CHARACTER_LIMIT / 2) + 1);
  const context = buildBoundedContext([
    message(1, "user", content),
    message(2, "assistant", content),
    message(3, "user", "newest")
  ]);
  assert.equal(context.at(-1)?.content, "newest");
  assert.ok(context.reduce((total, item) => total + item.content.length, 0) <= ASSISTANT_CONTEXT_CHARACTER_LIMIT);
});

test("Assistant links allow HTTPS only", () => {
  assert.equal(isSafeAssistantLink("https://opaiapp.com/support"), true);
  assert.equal(isSafeAssistantLink("http://opaiapp.com"), false);
  assert.equal(isSafeAssistantLink("javascript:alert(1)"), false);
  assert.equal(isSafeAssistantLink("file:///tmp/private"), false);
  assert.equal(isSafeAssistantLink("not-a-url"), false);
});

test("a response updates only its matching conversation and message", () => {
  const first: AssistantConversation = {
    createdAt: "2026-07-20T00:00:00.000Z",
    id: "first",
    messages: [{ ...message(1, "assistant", ""), conversationId: "first", status: "pending" }],
    title: "First",
    updatedAt: "2026-07-20T00:00:00.000Z",
    version: 1
  };
  const second: AssistantConversation = {
    ...first,
    id: "second",
    messages: [{ ...message(2, "assistant", ""), conversationId: "second", status: "pending" }],
    title: "Second"
  };
  const updated = updateAssistantMessage(
    [first, second],
    "second",
    "message-2",
    { content: "Right thread", status: "complete" },
    "2026-07-20T00:01:00.000Z"
  );

  assert.equal(updated[0]?.messages[0]?.status, "pending");
  assert.equal(updated[1]?.messages[0]?.content, "Right thread");
  assert.equal(updated[1]?.messages.length, 1);
});
