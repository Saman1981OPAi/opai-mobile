import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SecondaryButton } from "@/components/ui/Buttons";
import { confirmMentalHealthAction } from "@/features/mentalHealth/mentalHealthResourceActions";
import type { MentalHealthResource } from "@/features/mentalHealth/mentalHealthResourceTypes";
import { colors, radius, spacing } from "@/theme/tokens";

export function MentalHealthResourceCard({ resource }: { resource: MentalHealthResource }) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="heart-pulse" size={24} color={colors.ptsdGreenSoft} />
        </View>
        <View style={styles.copy}>
          <Text accessibilityRole="header" style={styles.organization}>{resource.organization}</Text>
          <Text style={styles.service}>{resource.service}</Text>
        </View>
      </View>

      {resource.displayNumber ? <Text style={styles.number}>{resource.displayNumber}</Text> : null}

      <View style={styles.facts}>
        <Text style={styles.fact}><Text style={styles.factLabel}>Coverage: </Text>{resource.coverage}</Text>
        <Text style={styles.fact}><Text style={styles.factLabel}>Available: </Text>{resource.hours}</Text>
        <Text style={styles.fact}><Text style={styles.factLabel}>For: </Text>{resource.audience}</Text>
      </View>

      {resource.disclosure ? <Text style={styles.disclosure}>{resource.disclosure}</Text> : null}

      <View style={styles.actions}>
        {resource.callNumber ? (
          <View style={styles.action}>
            <SecondaryButton label="Call" onPress={() => confirmMentalHealthAction("call", resource.organization, resource.callNumber!)}>
              <MaterialCommunityIcons name="phone-outline" size={19} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
        ) : null}
        {resource.textNumber ? (
          <View style={styles.action}>
            <SecondaryButton label="Text" onPress={() => confirmMentalHealthAction("text", resource.organization, resource.textNumber!)}>
              <MaterialCommunityIcons name="message-text-outline" size={19} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
        ) : null}
        <View style={styles.action}>
          <SecondaryButton label="Website" onPress={() => confirmMentalHealthAction("website", resource.organization, resource.officialUrl)}>
            <MaterialCommunityIcons name="open-in-new" size={19} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  action: { flexGrow: 1, minWidth: 108 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderColor: "rgba(127,255,212,0.24)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.base,
    padding: spacing.md
  },
  copy: { flex: 1 },
  disclosure: {
    backgroundColor: "rgba(255,197,61,0.08)",
    borderRadius: radius.sm,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    padding: spacing.sm
  },
  fact: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  factLabel: { color: colors.textPrimary, fontWeight: "800" },
  facts: { gap: spacing.xs },
  heading: { alignItems: "flex-start", flexDirection: "row", gap: spacing.base },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "rgba(127,255,212,0.10)",
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  number: { color: colors.ptsdGreenSoft, fontSize: 18, fontWeight: "900" },
  organization: { color: colors.textPrimary, fontSize: 18, fontWeight: "900", lineHeight: 23 },
  service: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: spacing.xs }
});
