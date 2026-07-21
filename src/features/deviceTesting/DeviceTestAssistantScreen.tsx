import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { openExternalUrl } from "@/config/externalLinks";
import { getSuggestedFollowUps } from "@/features/deviceTesting/deviceTestingAssistantService";
import { DeviceTestStepCard } from "@/features/deviceTesting/DeviceTestStepCard";
import { personalReferenceOnlyNotice } from "@/features/deviceTesting/deviceTestingGuardrails";
import type { DeviceTestGuide } from "@/features/deviceTesting/deviceTestingTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import { deviceTestingApi } from "@/services/api/deviceTestingApi";
import type { DeviceTestingExplainResponse } from "@/services/api/apiTypes";

type DeviceTestAssistantScreenProps = {
  guide: DeviceTestGuide;
  onBack: () => void;
};

export function DeviceTestAssistantScreen({ guide, onBack }: DeviceTestAssistantScreenProps) {
  const steps = useMemo(() => [...guide.inspectionSteps, ...guide.testSteps], [guide.inspectionSteps, guide.testSteps]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [explanation, setExplanation] = useState<DeviceTestingExplainResponse | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const safeStep = steps[currentStep] ?? steps[0];
  const followUps = safeStep ? getSuggestedFollowUps(guide.id, safeStep.id) : [];

  const showLocalFollowUp = async (prompt: string) => {
    if (prompt === "Show official source") {
      Alert.alert("Official source", "Use the source link below. External sources may require internet access.");
      return;
    }
    setLoadingExplanation(true);
    try {
      setExplanation(await deviceTestingApi.explain(guide.id, prompt, safeStep ? [safeStep.id] : []));
    } catch (error) {
      Alert.alert("AI explanation unavailable", `${error instanceof Error ? error.message : "Try again later."}\n\nThe verified offline guide remains available.`);
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.primaryBlue} />
          <Text style={styles.backText}>Device Testing</Text>
        </Pressable>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name={guide.icon} size={34} color={colors.primaryBlue} />
          <View style={styles.titleCopy}>
            <Text style={styles.title}>{guide.title}</Text>
            <Text style={styles.subtitle}>{guide.manufacturer} - {guide.model}</Text>
          </View>
        </View>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Verified Local Guide</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Curated Local OPAi Response</Text>
          </View>
        </View>
      </View>

      <View style={styles.metaPanel}>
        <Text style={styles.metaTitle}>Before You Begin</Text>
        {guide.prerequisites.map((item) => (
          <View key={item} style={styles.row}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.ptsdGreen} />
            <Text style={styles.rowText}>{item}</Text>
          </View>
        ))}
      </View>

      {safeStep ? (
        showAll ? (
          <View style={styles.stack}>
            {steps.map((step, index) => (
              <DeviceTestStepCard currentIndex={index} key={step.id} step={step} total={steps.length} />
            ))}
          </View>
        ) : (
          <DeviceTestStepCard currentIndex={currentStep} step={safeStep} total={steps.length} />
        )
      ) : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={currentStep === 0}
          onPress={() => setCurrentStep((value) => Math.max(0, value - 1))}
          style={[styles.actionButton, currentStep === 0 ? styles.actionDisabled : null]}
        >
          <MaterialCommunityIcons name="chevron-left" size={20} color={colors.textPrimary} />
          <Text style={styles.actionText}>Previous</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowAll((value) => !value)}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons name={showAll ? "format-list-bulleted-square" : "format-list-checks"} size={20} color={colors.textPrimary} />
          <Text style={styles.actionText}>{showAll ? "Step Mode" : "Show All"}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={currentStep >= steps.length - 1}
          onPress={() => setCurrentStep((value) => Math.min(steps.length - 1, value + 1))}
          style={[styles.actionButton, currentStep >= steps.length - 1 ? styles.actionDisabled : null]}
        >
          <Text style={styles.actionText}>Next</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.sourcePanel}>
        <Text style={styles.metaTitle}>Official Source</Text>
        <Text style={styles.sourceText}>{guide.sourceTitle}</Text>
        <Text style={styles.sourceMeta}>Revision: {guide.sourceRevision}</Text>
        <Text style={styles.sourceMeta}>Checked: {guide.sourceLastChecked} / Reviewed: {guide.contentLastReviewed}</Text>
        <Pressable accessibilityRole="link" onPress={() => openExternalUrl(guide.sourceUrl)} style={styles.sourceButton}>
          <MaterialCommunityIcons name="open-in-new" size={18} color={colors.textPrimary} />
          <Text style={styles.actionText}>Open Official Source</Text>
        </Pressable>
      </View>

      <View style={styles.metaPanel}>
        <Text style={styles.metaTitle}>Expected Result</Text>
        {guide.expectedResults.map((item) => (
          <Text key={item} style={styles.bullet}>- {item}</Text>
        ))}
        <Text style={styles.fail}>{guide.failureAction}</Text>
      </View>

      <View style={styles.followUps}>
        {followUps.map((prompt) => (
          <Pressable key={prompt} accessibilityRole="button" onPress={() => void showLocalFollowUp(prompt)} style={styles.chip}>
            <Text numberOfLines={1} style={styles.chipText}>{prompt}</Text>
          </Pressable>
        ))}
      </View>

      {loadingExplanation ? <Text style={styles.personal}>Preparing source-grounded explanation...</Text> : null}
      {explanation ? (
        <View style={styles.sourcePanel}>
          <Text style={styles.metaTitle}>{explanation.title}</Text>
          <Text style={styles.sourceText}>{explanation.answer}</Text>
          <Text style={styles.sourceMeta}>Source revision: {explanation.source_revision}</Text>
          {explanation.warnings.map((warning) => <Text key={warning} style={styles.fail}>- {warning}</Text>)}
          <Text style={styles.personal}>AI-generated explanation. Verify against the official source and current service procedure.</Text>
        </View>
      ) : null}

      <View style={styles.metaPanel}>
        <Text style={styles.metaTitle}>Limitations</Text>
        {guide.limitations.map((item) => (
          <Text key={item} style={styles.bullet}>- {item}</Text>
        ))}
        <Text style={styles.personal}>{personalReferenceOnlyNotice}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.18)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: spacing.base
  },
  actionDisabled: {
    opacity: 0.4
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 40
  },
  backText: {
    color: colors.primaryBlue,
    fontSize: typography.small,
    fontWeight: "700"
  },
  badge: {
    backgroundColor: "rgba(127,255,212,0.10)",
    borderColor: "rgba(127,255,212,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: spacing.base
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  badgeText: {
    color: colors.ptsdGreen,
    fontSize: typography.tiny,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  bullet: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.full,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: spacing.base
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  fail: {
    color: colors.warning,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18
  },
  followUps: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  header: {
    backgroundColor: "rgba(7,23,42,0.78)",
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md
  },
  metaPanel: {
    backgroundColor: "rgba(6,29,56,0.62)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  metaTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  personal: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.xs
  },
  rowText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18
  },
  sourceButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(10,132,255,0.20)",
    borderColor: colors.primaryBlue,
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.base
  },
  sourceMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  sourcePanel: {
    backgroundColor: "rgba(127,255,212,0.06)",
    borderColor: "rgba(127,255,212,0.22)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  sourceText: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "700"
  },
  stack: {
    gap: spacing.sm
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700"
  },
  titleCopy: {
    flex: 1,
    minWidth: 0
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  wrap: {
    gap: spacing.md
  }
});
