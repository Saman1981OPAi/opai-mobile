import { useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, Alert, FlatList, Linking, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Markdown, { MarkdownIt, type RenderRules } from "react-native-markdown-display";
import type { AssistantMessage } from "@/features/assistant/assistantTypes";
import { isSafeAssistantLink } from "@/features/assistant/assistantTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import { getScriptAwareTextStyle } from "@/theme/typography";

type AssistantMessageListProps = {
  messages: AssistantMessage[];
  onRetry: (message: AssistantMessage) => void;
};

const markdown = MarkdownIt({
  breaks: true,
  html: false,
  linkify: false,
  typographer: false
});

const markdownRules: RenderRules = {
  html_block: () => null,
  html_inline: () => null,
  image: () => null
};

function confirmSafeLink(url: string) {
  if (!isSafeAssistantLink(url)) {
    Alert.alert("Link blocked", "OPAi opens secure HTTPS links only.");
    return false;
  }
  Alert.alert("Open external link?", url, [
    { style: "cancel", text: "Cancel" },
    { onPress: () => void Linking.openURL(url), text: "Open" }
  ]);
  return false;
}

function markdownStyleFor(content: string) {
  return {
    ...markdownStyles,
    body: {
      ...markdownStyles.body,
      ...getScriptAwareTextStyle(content)
    }
  };
}

export function AssistantMessageList({ messages, onRetry }: AssistantMessageListProps) {
  const listRef = useRef<FlatList<AssistantMessage>>(null);
  const nearEnd = useRef(true);
  const data = useMemo(() => messages, [messages]);

  useEffect(() => {
    const newest = messages.at(-1);
    if (nearEnd.current || newest?.role === "user" || newest?.status === "pending") {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messages]);

  return (
    <FlatList
      contentContainerStyle={data.length === 0 ? styles.emptyList : styles.list}
      data={data}
      initialNumToRender={14}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons color={colors.primaryBlue} name="chatbubbles-outline" size={28} />
          </View>
          <Text style={styles.emptyTitle}>What can I help with?</Text>
          <Text style={styles.emptyText}>Write a message below to start a private, device-saved conversation.</Text>
        </View>
      }
      maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      maxToRenderPerBatch={16}
      onScroll={({ nativeEvent }) => {
        const remaining =
          nativeEvent.contentSize.height -
          nativeEvent.layoutMeasurement.height -
          nativeEvent.contentOffset.y;
        nearEnd.current = remaining < 96;
      }}
      ref={listRef}
      removeClippedSubviews
      renderItem={({ item }) => (
        <View style={[styles.messageRow, item.role === "user" ? styles.userRow : styles.assistantRow]}>
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.assistantBubble,
              item.role === "assistant" && (item.status === "failed" || item.status === "cancelled")
                ? styles.errorBubble
                : null
            ]}
          >
            {item.role === "assistant" && item.status !== "pending" ? (
              <View style={styles.assistantLabel}>
                <Ionicons
                  color={
                    item.status === "failed" || item.status === "cancelled"
                      ? colors.warning
                      : colors.accentBlue
                  }
                  name={
                    item.status === "failed" || item.status === "cancelled"
                      ? "warning-outline"
                      : "sparkles"
                  }
                  size={14}
                />
                <Text
                  style={[
                    styles.assistantLabelText,
                    item.status === "failed" || item.status === "cancelled"
                      ? styles.warningLabelText
                      : null
                  ]}
                >
                  {item.status === "failed" || item.status === "cancelled"
                    ? "OPAi warning"
                    : "OPAi response"}
                </Text>
              </View>
            ) : null}
            {item.status === "pending" ? (
              <View style={styles.pending}>
                <ActivityIndicator color={colors.primaryBlue} size="small" />
                <Text style={styles.pendingText}>OPAi is responding</Text>
              </View>
            ) : item.role === "assistant" ? (
              <Markdown
                markdownit={markdown}
                onLinkPress={confirmSafeLink}
                rules={markdownRules}
                style={markdownStyleFor(item.content)}
              >
                {item.content}
              </Markdown>
            ) : (
              <Text selectable style={styles.userText}>{item.content}</Text>
            )}
            {item.status === "failed" || item.status === "cancelled" ? (
              <View style={styles.messageActions}>
                <Pressable
                  accessibilityLabel="Retry message"
                  accessibilityRole="button"
                  onPress={() => onRetry(item)}
                  style={styles.action}
                >
                  <Ionicons color={colors.primaryBlue} name="refresh" size={17} />
                  <Text style={styles.actionText}>Retry</Text>
                </Pressable>
              </View>
            ) : null}
            {item.status === "complete" && item.content ? (
              <View style={styles.messageActions}>
                <Pressable
                  accessibilityLabel="Copy message"
                  accessibilityRole="button"
                  onPress={() => void Clipboard.setStringAsync(item.content)}
                  style={styles.action}
                >
                  <Ionicons color={colors.textMuted} name="copy-outline" size={16} />
                  <Text style={styles.copyText}>Copy</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      )}
      scrollEventThrottle={32}
      showsVerticalScrollIndicator={false}
      windowSize={9}
    />
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 36,
    paddingHorizontal: spacing.xs
  },
  actionText: {
    color: colors.primaryBlue,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  assistantBubble: {
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: "rgba(77,163,255,0.46)"
  },
  assistantLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.xs
  },
  assistantLabelText: {
    color: colors.accentBlue,
    fontSize: typography.tiny,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  assistantRow: {
    justifyContent: "flex-start"
  },
  bubble: {
    borderRadius: radius.xl,
    borderWidth: 1,
    maxWidth: "92%",
    minWidth: 74,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm
  },
  copyText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  empty: {
    alignItems: "center",
    gap: spacing.sm,
    maxWidth: 320
  },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: colors.glassBlue,
    borderRadius: radius.full,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  emptyList: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
    textAlign: "center"
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700"
  },
  errorBubble: {
    backgroundColor: "rgba(255,209,102,0.09)",
    borderColor: "rgba(255,209,102,0.34)"
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.base
  },
  messageActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: spacing.xs
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: spacing.base,
    width: "100%"
  },
  pending: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 28
  },
  pendingText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "700"
  },
  userBubble: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.accentBlue
  },
  userRow: {
    justifyContent: "flex-end"
  },
  userText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 22
  },
  warningLabelText: {
    color: colors.warning
  }
});

const markdownStyles = StyleSheet.create({
  blockquote: {
    backgroundColor: colors.glassBlue,
    borderColor: colors.primaryBlue,
    borderLeftWidth: 3,
    color: colors.textSecondary,
    paddingHorizontal: spacing.sm
  },
  body: {
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 23
  },
  code_block: {
    backgroundColor: colors.backgroundBlue,
    borderColor: colors.border,
    color: colors.textSecondary,
    fontSize: typography.small,
    padding: spacing.sm
  },
  code_inline: {
    backgroundColor: colors.backgroundBlue,
    color: colors.accentBlue,
    fontSize: typography.small
  },
  heading1: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700"
  },
  heading2: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: "700"
  },
  link: {
    color: colors.accentBlue,
    textDecorationLine: "underline"
  },
  paragraph: {
    marginBottom: spacing.sm,
    marginTop: 0
  },
  table: {
    borderColor: colors.border,
    borderWidth: 1
  },
  td: {
    borderColor: colors.border,
    color: colors.textPrimary,
    padding: spacing.xs
  },
  th: {
    borderColor: colors.border,
    color: colors.textPrimary,
    fontWeight: "700",
    padding: spacing.xs
  }
});
