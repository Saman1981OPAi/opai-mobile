import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DeviceTestStep } from "@/features/deviceTesting/deviceTestingTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type DeviceTestStepCardProps = {
  currentIndex: number;
  step: DeviceTestStep;
  total: number;
};

export function DeviceTestStepCard({ currentIndex, step, total }: DeviceTestStepCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name={step.icon} size={24} color={colors.primaryBlue} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.kicker}>Step {currentIndex + 1} of {total}</Text>
          <Text numberOfLines={2} style={styles.title}>{step.title}</Text>
        </View>
      </View>
      <Text style={styles.instruction}>{step.instruction}</Text>
      {step.warning ? <Text style={styles.warning}>{step.warning}</Text> : null}
      <Pressable accessibilityRole="button" onPress={() => setExpanded((value) => !value)} style={styles.detailsButton}>
        <Text style={styles.detailsText}>{expanded ? "Hide Details" : "Details"}</Text>
        <MaterialCommunityIcons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={colors.primaryBlue} />
      </Pressable>
      {expanded ? (
        <View style={styles.detailsPanel}>
          {step.details.map((detail) => (
            <View key={detail} style={styles.detailRow}>
              <MaterialCommunityIcons name="circle-small" size={20} color={colors.ptsdGreen} />
              <Text style={styles.detail}>{detail}</Text>
            </View>
          ))}
          <Text style={styles.source}>Source: {step.sourceRef}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(6,29,56,0.78)",
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  detail: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18
  },
  detailRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xs
  },
  detailsButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 38,
    paddingHorizontal: spacing.base
  },
  detailsPanel: {
    gap: spacing.xs
  },
  detailsText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: "900"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.14)",
    borderRadius: radius.lg,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  instruction: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "900",
    lineHeight: 23
  },
  kicker: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  source: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: "900"
  },
  warning: {
    color: colors.warning,
    fontSize: typography.caption,
    fontWeight: "900",
    lineHeight: 18
  }
});
