import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type ButtonProps = {
  children?: ReactNode;
  label: string;
  onPress?: () => void;
};

export function PrimaryButton({ children, label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primary, pressed ? styles.pressed : null]}
    >
      {children}
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ children, label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondary, pressed ? styles.pressed : null]}
    >
      {children}
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.76,
    transform: [{ translateY: 1 }]
  },
  primary: {
    alignItems: "center",
    backgroundColor: colors.primaryBlue,
    borderColor: colors.accentBlue,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.base
  },
  primaryText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900"
  },
  secondary: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: "rgba(77,163,255,0.34)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.base
  },
  secondaryText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800"
  }
});
