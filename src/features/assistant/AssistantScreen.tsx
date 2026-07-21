import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { Ionicons } from "@expo/vector-icons";
import { AssistantComposer } from "@/features/assistant/AssistantComposer";
import { AssistantMessageList } from "@/features/assistant/AssistantMessageList";
import { assistantRepository } from "@/features/assistant/assistantRepository";
import { useAssistantVoiceInput } from "@/features/assistant/useAssistantVoiceInput";
import {
  assistantErrorMessage,
  buildBoundedContext,
  conversationTitle,
  createConversation,
  createMessage,
  createStableId,
  updateAssistantMessage,
  type AssistantConversation,
  type AssistantMessage,
  type LegacyAssistantRecord
} from "@/features/assistant/assistantTypes";
import { aiApi } from "@/services/api/aiApi";
import { ApiError } from "@/services/api/apiClient";
import { colors, layout, radius, spacing, typography } from "@/theme/tokens";

type AssistantScreenProps = {
  legacyHistory: LegacyAssistantRecord[];
  onLegacyMigrationVerified: () => void;
  userId: string;
};

type ActiveRequest = {
  assistantMessageId: string;
  controller: AbortController;
  conversationId: string;
  requestId: string;
};

function normalizeRestoredConversation(conversation: AssistantConversation): AssistantConversation {
  return {
    ...conversation,
    messages: conversation.messages.map((message) =>
      message.status === "pending"
        ? {
            ...message,
            content: assistantErrorMessage("REQUEST_CANCELLED"),
            errorCode: "REQUEST_CANCELLED",
            status: "cancelled"
          }
        : message
    )
  };
}

export function AssistantScreen({
  legacyHistory,
  onLegacyMigrationVerified,
  userId
}: AssistantScreenProps) {
  const [conversations, setConversations] = useState<AssistantConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [composer, setComposer] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [storageError, setStorageError] = useState("");
  const activeRequest = useRef<ActiveRequest | null>(null);
  const legacyHistoryRef = useRef(legacyHistory);
  const migrationCallbackRef = useRef(onLegacyMigrationVerified);

  useEffect(() => {
    legacyHistoryRef.current = legacyHistory;
    migrationCallbackRef.current = onLegacyMigrationVerified;
  }, [legacyHistory, onLegacyMigrationVerified]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [activeConversationId, conversations]
  );
  const appendVoiceTranscript = useCallback((transcript: string) => {
    setComposer((current) =>
      [current.trim(), transcript.trim()].filter(Boolean).join(" ")
    );
  }, []);
  const voiceInput = useAssistantVoiceInput({
    disabled: isSending || Boolean(storageError && conversations.length === 0),
    onTranscript: appendVoiceTranscript
  });

  const persist = useCallback(
    async (next: AssistantConversation[]) => {
      await assistantRepository.save(userId, next);
    },
    [userId]
  );

  useEffect(() => {
    let mounted = true;
    if (!userId) {
      queueMicrotask(() => {
        if (!mounted) return;
        setStorageError("A signed-in account is required to unlock protected chat history.");
        setLoading(false);
      });
      return () => undefined;
    }
    assistantRepository
      .load(userId, legacyHistoryRef.current)
      .then((result) => {
        if (!mounted) return;
        const restored = result.conversations
          .map(normalizeRestoredConversation)
          .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
        setConversations(restored);
        setActiveConversationId(restored[0]?.id ?? "");
        if (result.shouldClearLegacyPlaintext) migrationCallbackRef.current();
      })
      .catch(() => {
        if (!mounted) return;
        setStorageError("Protected chat history could not be opened. Existing history was not erased.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      activeRequest.current?.controller.abort();
      activeRequest.current = null;
    };
  }, [userId]);

  const commit = useCallback(
    (updater: (current: AssistantConversation[]) => AssistantConversation[]) => {
      setConversations((current) => {
        const next = updater(current);
        void persist(next).catch(() => {
          setStorageError("The latest chat could not be saved. Previous protected history remains available.");
        });
        return next;
      });
    },
    [persist]
  );

  const stop = useCallback(() => {
    const request = activeRequest.current;
    if (!request) return;
    request.controller.abort();
    activeRequest.current = null;
    setIsSending(false);
    commit((current) =>
      updateAssistantMessage(
        current,
        request.conversationId,
        request.assistantMessageId,
        {
          content: assistantErrorMessage("REQUEST_CANCELLED"),
          errorCode: "REQUEST_CANCELLED",
          status: "cancelled"
        },
        new Date().toISOString()
      )
    );
  }, [commit]);

  const submit = useCallback(
    async (rawPrompt: string, retryMessage?: AssistantMessage) => {
      const prompt = rawPrompt.trim();
      if (!prompt || activeRequest.current) return;

      const now = new Date().toISOString();
      let conversation =
        conversations.find((item) => item.id === activeConversationId) ?? createConversation(now);
      const retryTarget = retryMessage
        ? conversation.messages.findIndex((message) => message.id === retryMessage.id)
        : -1;
      const previousUser =
        retryTarget > 0 && conversation.messages[retryTarget - 1]?.role === "user"
          ? conversation.messages[retryTarget - 1]
          : undefined;
      const userMessage = previousUser ?? createMessage(conversation.id, "user", prompt, "complete", now);
      const assistantMessage = createMessage(conversation.id, "assistant", "", "pending", now);
      const requestId = createStableId("assistant-request");

      const baseMessages =
        retryTarget >= 0
          ? conversation.messages.filter((message) => message.id !== retryMessage?.id)
          : [...conversation.messages, userMessage];
      conversation = {
        ...conversation,
        messages: [...baseMessages, assistantMessage],
        title:
          conversation.messages.length === 0
            ? conversationTitle(userMessage.content)
            : conversation.title,
        updatedAt: now
      };
      const nextConversations = [
        conversation,
        ...conversations.filter((item) => item.id !== conversation.id)
      ];
      setConversations(nextConversations);
      setActiveConversationId(conversation.id);
      setComposer("");
      setStorageError("");
      await persist(nextConversations).catch(() => {
        setStorageError("Your message is visible but could not yet be saved to protected history.");
      });

      const controller = new AbortController();
      activeRequest.current = {
        assistantMessageId: assistantMessage.id,
        controller,
        conversationId: conversation.id,
        requestId
      };
      setIsSending(true);

      try {
        const context = buildBoundedContext(
          conversation.messages.filter((message) => message.id !== assistantMessage.id)
        );
        const response = await aiApi.chat({
          conversationId: conversation.id,
          message: userMessage.content,
          messages: context,
          mode: "general",
          requestId,
          signal: controller.signal
        });
        const active = activeRequest.current;
        if (
          !active ||
          active.requestId !== requestId ||
          active.conversationId !== conversation.id
        ) {
          return;
        }
        activeRequest.current = null;
        setIsSending(false);
        commit((current) =>
          updateAssistantMessage(
            current,
            conversation.id,
            assistantMessage.id,
            { content: response.answer, status: "complete" },
            new Date().toISOString()
          )
        );
      } catch (error) {
        const active = activeRequest.current;
        if (!active || active.requestId !== requestId) return;
        activeRequest.current = null;
        setIsSending(false);
        const code = error instanceof ApiError ? error.code : "UNEXPECTED_RESPONSE";
        commit((current) =>
          updateAssistantMessage(
            current,
            conversation.id,
            assistantMessage.id,
            {
              content: assistantErrorMessage(code),
              errorCode: code,
              status: code === "REQUEST_CANCELLED" ? "cancelled" : "failed"
            },
            new Date().toISOString()
          )
        );
      }
    },
    [activeConversationId, commit, conversations, persist]
  );

  const newChat = () => {
    stop();
    setActiveConversationId("");
    setComposer("");
  };

  const retry = (assistantMessage: AssistantMessage) => {
    const conversation = conversations.find(
      (item) => item.id === assistantMessage.conversationId
    );
    const index = conversation?.messages.findIndex((message) => message.id === assistantMessage.id) ?? -1;
    const userMessage = index > 0 ? conversation?.messages[index - 1] : undefined;
    if (!conversation || userMessage?.role !== "user") return;
    setActiveConversationId(conversation.id);
    void submit(userMessage.content, assistantMessage);
  };

  const deleteConversation = (conversationId: string) => {
    if (activeRequest.current?.conversationId === conversationId) stop();
    commit((current) => current.filter((conversation) => conversation.id !== conversationId));
    if (activeConversationId === conversationId) setActiveConversationId("");
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primaryBlue} />
        <Text style={styles.muted}>Opening protected chat history</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <Ionicons color={colors.primaryBlue} name="sparkles" size={22} />
          </View>
          <View style={styles.headerCopy}>
            <Text numberOfLines={1} style={styles.title}>OPAi</Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {activeConversation?.title ?? "New conversation"}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel="Conversation history"
            accessibilityRole="button"
            onPress={() => setHistoryVisible(true)}
            style={styles.iconButton}
          >
            <Ionicons color={colors.textSecondary} name="time-outline" size={21} />
          </Pressable>
          <Pressable
            accessibilityLabel="New chat"
            accessibilityRole="button"
            onPress={newChat}
            style={styles.iconButton}
          >
            <Ionicons color={colors.primaryBlue} name="create-outline" size={21} />
          </Pressable>
        </View>
      </View>

      {storageError ? (
        <View style={styles.storageError}>
          <Ionicons color={colors.warning} name="lock-closed-outline" size={17} />
          <Text style={styles.storageErrorText}>{storageError}</Text>
        </View>
      ) : null}

      <AssistantMessageList messages={activeConversation?.messages ?? []} onRetry={retry} />

      <View style={styles.composerArea}>
        <AssistantComposer
          disabled={Boolean(storageError && conversations.length === 0)}
          isRecording={voiceInput.isRecording}
          isSending={isSending}
          isTranscribing={voiceInput.isTranscribing}
          onChangeText={setComposer}
          onSend={() => void submit(composer)}
          onStop={stop}
          onVoicePress={() => void voiceInput.onPress()}
          value={composer}
        />
        {voiceInput.isRecording || voiceInput.isTranscribing ? (
          <Text accessibilityLiveRegion="polite" style={styles.voiceStatus}>
            {voiceInput.isRecording
              ? `Listening ${Math.floor(voiceInput.durationMillis / 1000)}s - tap Stop when finished`
              : "Transcribing voice into the message field"}
          </Text>
        ) : null}
        <Text style={styles.disclaimer}>AI can be inaccurate. Verify before use.</Text>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setHistoryVisible(false)}
        presentationStyle="pageSheet"
        transparent
        visible={historyVisible}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.historySheet}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>History</Text>
              <Pressable
                accessibilityLabel="Close history"
                accessibilityRole="button"
                onPress={() => setHistoryVisible(false)}
                style={styles.iconButton}
              >
                <Ionicons color={colors.textPrimary} name="close" size={23} />
              </Pressable>
            </View>
            {conversations.length === 0 ? (
              <Text style={styles.muted}>No saved conversations.</Text>
            ) : (
              conversations.map((conversation) => (
                <Pressable
                  accessibilityLabel={`Open ${conversation.title}`}
                  accessibilityRole="button"
                  key={conversation.id}
                  onPress={() => {
                    setActiveConversationId(conversation.id);
                    setHistoryVisible(false);
                  }}
                  style={({ pressed }) => [styles.historyItem, pressed ? styles.pressed : null]}
                >
                  <View style={styles.historyCopy}>
                    <Text numberOfLines={1} style={styles.historyItemTitle}>{conversation.title}</Text>
                    <Text style={styles.historyMeta}>
                      {new Date(conversation.updatedAt).toLocaleDateString("en-CA")}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityLabel={`Delete ${conversation.title}`}
                    accessibilityRole="button"
                    onPress={(event) => {
                      event.stopPropagation();
                      Alert.alert("Delete conversation?", "This removes the protected local copy.", [
                        { style: "cancel", text: "Cancel" },
                        {
                          onPress: () => deleteConversation(conversation.id),
                          style: "destructive",
                          text: "Delete"
                        }
                      ]);
                    }}
                    style={styles.iconButton}
                  >
                    <Ionicons color={colors.danger} name="trash-outline" size={19} />
                  </Pressable>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm
  },
  brandIcon: {
    alignItems: "center",
    backgroundColor: colors.glassBlue,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  composerArea: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingBottom: layout.bottomNavHeight + spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    textAlign: "center"
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 62,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.xs
  },
  headerCopy: {
    flex: 1
  },
  historyCopy: {
    flex: 1
  },
  historyHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  historyItem: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 64,
    paddingVertical: spacing.sm
  },
  historyItemTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "700"
  },
  historyMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: spacing.xs
  },
  historySheet: {
    backgroundColor: colors.elevated,
    borderColor: colors.borderStrong,
    borderRadius: radius.xl,
    borderWidth: 1,
    maxHeight: "76%",
    maxWidth: 620,
    padding: spacing.md,
    width: "100%"
  },
  historyTitle: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700"
  },
  iconButton: {
    alignItems: "center",
    borderRadius: radius.lg,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  loading: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center"
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.68)",
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.md
  },
  muted: {
    color: colors.textMuted,
    fontSize: typography.small
  },
  pressed: {
    opacity: 0.72
  },
  screen: {
    alignSelf: "center",
    backgroundColor: colors.background,
    flex: 1,
    maxWidth: layout.contentMaxWidth,
    width: "100%"
  },
  storageError: {
    alignItems: "center",
    backgroundColor: "rgba(255,209,102,0.09)",
    borderBottomColor: "rgba(255,209,102,0.28)",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  storageErrorText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: typography.caption,
    lineHeight: 17
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.caption
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700"
  },
  voiceStatus: {
    color: colors.accentBlue,
    fontSize: typography.tiny,
    fontWeight: "700",
    textAlign: "center"
  }
});
