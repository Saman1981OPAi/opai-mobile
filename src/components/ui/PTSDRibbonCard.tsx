import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

export function PTSDRibbonCard() {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name="ribbon" size={54} color={colors.ptsdGreenSoft} />
      <View style={styles.copy}>
        <Text style={styles.title}>You are not alone.</Text>
        <Text style={styles.text}>PTSD awareness and support resources.</Text>
      </View>
      <MaterialCommunityIcons name="leaf-maple" size={36} color="rgba(77,163,255,0.22)" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "rgba(24,73,52,0.52)",
    borderColor: "rgba(127,255,212,0.30)",
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.base,
    minHeight: 104,
    padding: spacing.md
  },
  copy: {
    flex: 1
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  title: {
    color: colors.ptsdGreenSoft,
    fontSize: 19,
    fontWeight: "900"
  }
});
