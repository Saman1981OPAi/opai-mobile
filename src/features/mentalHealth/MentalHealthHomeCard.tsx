import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { confirm988Choice } from "@/features/mentalHealth/mentalHealthResourceActions";
import { colors, radius, spacing } from "@/theme/tokens";

export function MentalHealthHomeCard({ onViewResources }: { onViewResources: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="ribbon" size={32} color={colors.ptsdGreenSoft} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Mental Health Resources</Text>
          <Text style={styles.subtitle}>Confidential support and crisis resources</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <View style={styles.action}>
          <SecondaryButton label="Resources" onPress={onViewResources}>
            <MaterialCommunityIcons name="view-list-outline" size={19} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <View style={styles.action}>
          <PrimaryButton label="Call/Text 9-8-8" onPress={confirm988Choice}>
            <MaterialCommunityIcons name="message-alert-outline" size={19} color={colors.textPrimary} />
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  action: { flex: 1, minWidth: 150 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  card: {
    backgroundColor: "rgba(24,73,52,0.46)",
    borderColor: "rgba(127,255,212,0.34)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md
  },
  copy: { flex: 1 },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.base },
  iconWrap: { alignItems: "center", justifyContent: "center", width: 44 },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: spacing.xs },
  title: { color: colors.ptsdGreenSoft, fontSize: 19, fontWeight: "900" }
});
