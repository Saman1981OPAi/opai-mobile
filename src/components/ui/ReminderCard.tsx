import type { ComponentProps } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { colors, radius, spacing } from "@/theme/tokens";

type ReminderCardProps = {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  active?: boolean;
  onPress?: () => void;
  title: string;
  subtitle: string;
};

export function ReminderCard({ active = false, icon, onPress, subtitle, title }: ReminderCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, active ? styles.cardActive : null, pressed ? styles.pressed : null]}
    >
      <MaterialCommunityIcons name={icon} size={31} color={colors.primaryBlue} />
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.accentBlue} />
    </Pressable>
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
  cardActive: {
    backgroundColor: "rgba(10,132,255,0.18)",
    borderColor: colors.primaryBlue
  },
  copy: {
    flex: 1
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3
  },
  pressed: {
    opacity: 0.76,
    transform: [{ translateY: 1 }]
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700"
  }
});
