import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { colors, radius, shadows, spacing, typography } from "@/theme/tokens";

type CardProps = {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
};

export function Card({ action, children, eyebrow, title }: CardProps) {
  return (
    <View style={styles.card}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      <View style={styles.cardBody}>{children}</View>
      {action ? <View style={styles.cardAction}>{action}</View> : null}
    </View>
  );
}

type PillProps = {
  children: ReactNode;
  tone?: "blue" | "green" | "neutral" | "danger" | "warning";
};

export function Pill({ children, tone = "blue" }: PillProps) {
  return (
    <View style={[styles.pill, styles[`pill_${tone}`]]}>
      <Text style={[styles.pillText, tone === "neutral" ? styles.pillTextNeutral : null]}>{children}</Text>
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

export function ActionButton({ label, onPress, variant = "primary" }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles[`button_${variant}`], pressed ? styles.pressed : null]}
    >
      <Text style={[styles.buttonText, variant === "secondary" ? styles.buttonTextSecondary : null]}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionHeading}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionText: {
    color: colors.textPrimary
  },
  button: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12
  },
  button_ghost: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.border
  },
  button_primary: {
    backgroundColor: colors.primaryBlue
  },
  button_secondary: {
    backgroundColor: "rgba(10,132,255,0.12)",
    borderWidth: 1,
    borderColor: colors.borderStrong
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "700"
  },
  buttonTextSecondary: {
    color: colors.accentBlue
  },
  card: {
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
    padding: spacing.md
  },
  cardAction: {
    marginTop: spacing.md
  },
  cardBody: {
    marginTop: spacing.sm,
    gap: spacing.sm
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700",
    lineHeight: 26,
    marginTop: spacing.xs
  },
  eyebrow: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  pill: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  pill_blue: {
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: "rgba(77,163,255,0.38)"
  },
  pill_danger: {
    backgroundColor: "rgba(255,90,95,0.14)",
    borderColor: "rgba(255,90,95,0.40)"
  },
  pill_green: {
    backgroundColor: "rgba(127,255,212,0.12)",
    borderColor: "rgba(127,255,212,0.38)"
  },
  pill_neutral: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: colors.border
  },
  pill_warning: {
    backgroundColor: "rgba(255,209,102,0.14)",
    borderColor: "rgba(255,209,102,0.40)"
  },
  pillText: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  pillTextNeutral: {
    color: colors.textSecondary
  },
  pressed: {
    opacity: 0.76,
    transform: [{ translateY: 1 }]
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: typography.h1,
    fontWeight: "700",
    lineHeight: 30,
    marginTop: spacing.xs
  },
  sectionTitle: {
    gap: spacing.xs
  }
});
