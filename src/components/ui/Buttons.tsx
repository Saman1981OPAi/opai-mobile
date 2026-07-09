import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type ButtonProps = {
  accessibilityHint?: string;
  children?: ReactNode;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress?: () => void;
};

export function PrimaryButton({ accessibilityHint, children, disabled = false, label, loading = false, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.primary, disabled ? styles.disabled : null, pressed ? styles.pressed : null]}
    >
      {loading ? <ActivityIndicator color={colors.textPrimary} /> : children}
      <Text maxFontSizeMultiplier={1.25} numberOfLines={1} adjustsFontSizeToFit style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ accessibilityHint, children, disabled = false, label, loading = false, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.secondary, disabled ? styles.disabled : null, pressed ? styles.pressed : null]}
    >
      {loading ? <ActivityIndicator color={colors.primaryBlue} /> : children}
      <Text maxFontSizeMultiplier={1.25} numberOfLines={1} adjustsFontSizeToFit style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.55
  },
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
    minWidth: 44,
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
    minWidth: 44,
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
