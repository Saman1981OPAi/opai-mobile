import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { openExternalUrl } from "@/config/externalLinks";
import { useOfForceNotice } from "@/features/deviceTesting/deviceTestingGuardrails";
import { colors, radius, spacing, typography } from "@/theme/tokens";

const domains = [
  { title: "Situation", items: ["environment", "persons", "distance", "weapons", "resources"] },
  { title: "Subject Behaviour", items: ["cooperation", "resistance", "threat cues", "change"] },
  { title: "Officer Perception", items: ["threat", "training", "condition", "position"] },
  { title: "Tactics", items: ["communication", "de-escalation", "cover", "assistance"] },
  { title: "Reassessment", items: ["monitor", "adjust", "reduce", "medical aid", "reporting"] }
];

const nationalSource = "https://www.publicsafety.gc.ca/lbrr/archives/cnmcs-plcng/cn31151-eng.pdf";
const ontarioSource = "https://www.ontario.ca/laws/regulation/r23391";

export function UseOfForceReference() {
  return (
    <View style={styles.wrap}>
      <View style={styles.core}>
        <MaterialCommunityIcons name="shield-alert-outline" size={36} color={colors.primaryBlue} />
        <Text style={styles.coreText}>ASSESS {">"} PLAN {">"} ACT {">"} REASSESS</Text>
      </View>
      <View style={styles.grid}>
        {domains.map((domain) => (
          <View key={domain.title} style={styles.domain}>
            <Text style={styles.domainTitle}>{domain.title}</Text>
            <Text style={styles.domainItems}>{domain.items.join("  /  ")}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.notice}>{useOfForceNotice}</Text>
      <View style={styles.actions}>
        <Pressable accessibilityRole="link" onPress={() => openExternalUrl(nationalSource)} style={styles.linkButton}>
          <Text style={styles.linkText}>National Source</Text>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => openExternalUrl(ontarioSource)} style={styles.linkButton}>
          <Text style={styles.linkText}>Ontario Regulation</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  core: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  coreText: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: "700",
    textAlign: "center"
  },
  domain: {
    backgroundColor: "rgba(6,29,56,0.7)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    gap: spacing.xs,
    minWidth: 150,
    padding: spacing.base
  },
  domainItems: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18
  },
  domainTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "700"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  linkButton: {
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: "rgba(77,163,255,0.26)",
    borderRadius: radius.full,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.base
  },
  linkText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  notice: {
    color: colors.warning,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18
  },
  wrap: {
    gap: spacing.md
  }
});
