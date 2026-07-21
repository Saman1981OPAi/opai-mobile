import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import {
  deviceTestingCoreNotice,
  deviceTestingFailureNotice,
  deviceTestingReferenceNotice,
  deviceTestingVariationNotice
} from "@/features/deviceTesting/deviceTestingGuardrails";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function DeviceSafetyNotice() {
  return (
    <View accessibilityRole="summary" style={styles.notice}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="shield-alert-outline" size={22} color={colors.ptsdGreen} />
        <Text style={styles.title}>Reference only</Text>
      </View>
      <Text style={styles.copy}>{deviceTestingCoreNotice}</Text>
      <Text style={styles.meta}>{deviceTestingVariationNotice}</Text>
      <Text style={styles.fail}>{deviceTestingFailureNotice}</Text>
      <Text style={styles.meta}>{deviceTestingReferenceNotice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20
  },
  fail: {
    color: colors.warning,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 18
  },
  notice: {
    backgroundColor: "rgba(127,255,212,0.08)",
    borderColor: "rgba(127,255,212,0.26)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  title: {
    color: colors.ptsdGreen,
    flexShrink: 1,
    fontSize: typography.small,
    fontWeight: "700",
    textTransform: "uppercase"
  }
});
