import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { confirm988Choice, confirmMentalHealthAction } from "@/features/mentalHealth/mentalHealthResourceActions";
import { colors, radius, spacing } from "@/theme/tokens";

export function CrisisSupportNotice() {
  return (
    <View accessibilityRole="summary" style={styles.notice}>
      <View style={styles.heading}>
        <MaterialCommunityIcons name="lifebuoy" size={28} color={colors.ptsdGreenSoft} />
        <View style={styles.copy}>
          <Text style={styles.title}>Need immediate support?</Text>
          <Text style={styles.text}>If your safety is at risk, call 9-1-1. For suicide crisis support in Canada, call or text 9-8-8.</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <View style={styles.action}>
          <SecondaryButton label="Call 9-1-1" onPress={() => confirmMentalHealthAction("call", "9-1-1", "911")}>
            <MaterialCommunityIcons name="phone-alert-outline" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <View style={styles.action}>
          <PrimaryButton label="Call/Text 9-8-8" onPress={confirm988Choice}>
            <MaterialCommunityIcons name="message-alert-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  action: { flex: 1, minWidth: 150 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  copy: { flex: 1 },
  heading: { alignItems: "flex-start", flexDirection: "row", gap: spacing.base },
  notice: {
    backgroundColor: "rgba(127,255,212,0.08)",
    borderColor: "rgba(127,255,212,0.42)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md
  },
  text: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: spacing.xs },
  title: { color: colors.ptsdGreenSoft, fontSize: 20, fontWeight: "700" }
});
