import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type FeatureCardProps = {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  subtitle?: string;
  onPress?: () => void;
  compact?: boolean;
};

export function FeatureCard({ compact = false, icon, onPress, subtitle, title }: FeatureCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, compact ? styles.compact : null, pressed ? styles.pressed : null]}
    >
      <MaterialCommunityIcons name={icon} size={compact ? 30 : 38} color={colors.primaryBlue} />
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>{title}</Text>
      {subtitle ? <Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.76)",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: radius.xl,
    borderWidth: 1,
    flexBasis: "48%",
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 108,
    padding: spacing.sm
  },
  compact: {
    flexBasis: "31%",
    minHeight: 96
  },
  pressed: {
    opacity: 0.72,
    transform: [{ translateY: 1 }]
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center"
  }
});
