import type { ComponentProps } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type ReminderCardProps = {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  subtitle: string;
};

export function ReminderCard({ icon, subtitle, title }: ReminderCardProps) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={icon} size={31} color={colors.primaryBlue} />
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.accentBlue} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.65)",
    borderColor: "rgba(77,163,255,0.18)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 68,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  copy: {
    flex: 1
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900"
  }
});
