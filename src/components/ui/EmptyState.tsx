import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type EmptyStateProps = {
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  message: string;
};

export function EmptyState({ icon = "progress-wrench", message, title }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons name={icon} size={42} color={colors.primaryBlue} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
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
    fontWeight: "900",
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
