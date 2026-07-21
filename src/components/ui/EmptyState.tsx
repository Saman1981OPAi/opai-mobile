import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { SecondaryButton } from "@/components/ui/Buttons";
import { colors, radius, spacing } from "@/theme/tokens";

type EmptyStateProps = {
  actionLabel?: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  message: string;
  onAction?: () => void;
};

export function EmptyState({ actionLabel, icon = "progress-wrench", message, onAction, title }: EmptyStateProps) {
  return (
    <View accessibilityRole="text" style={styles.wrap}>
      <MaterialCommunityIcons name={icon} size={42} color={colors.primaryBlue} />
      <Text maxFontSizeMultiplier={1.25} style={styles.title}>{title}</Text>
      <Text maxFontSizeMultiplier={1.35} style={styles.message}>{message}</Text>
      {actionLabel && onAction ? <SecondaryButton label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center"
  },
  wrap: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.64)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  }
});
