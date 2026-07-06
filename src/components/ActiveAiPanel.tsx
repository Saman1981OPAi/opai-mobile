import { StyleSheet, Text, View } from "react-native";
import { ActionButton, Card, Pill } from "@/components/Primitives";
import { aiActions } from "@/data/workflows";
import { colors, spacing, typography } from "@/theme/tokens";
import type { AppModule } from "@/types/navigation";

export function ActiveAiPanel({ activeModule }: { activeModule: AppModule }) {
  const contextualActions = aiActions.slice(0, 6);

  return (
    <Card eyebrow="Active AI" title={`Ready for ${activeModule.shortLabel}`}>
      <Text style={styles.body}>{activeModule.summary}</Text>
      <View style={styles.prompt}>
        <Text style={styles.promptText}>Ask OPAi anything about this workflow...</Text>
        <Pill tone="blue">Secure draft</Pill>
      </View>
      <View style={styles.actions}>
        {contextualActions.map((action) => (
          <View key={action} style={styles.actionChip}>
            <Text style={styles.actionChipText}>{action}</Text>
          </View>
        ))}
      </View>
      <ActionButton label="Open AI Assistant" variant="secondary" />
    </Card>
  );
}

const styles = StyleSheet.create({
  actionChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  actionChipText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22
  },
  prompt: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: 8,
    backgroundColor: colors.elevated,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    padding: spacing.md
  },
  promptText: {
    color: colors.textSubtle,
    flex: 1,
    fontSize: typography.small
  }
});
