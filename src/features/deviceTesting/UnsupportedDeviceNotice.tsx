import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type UnsupportedDeviceNoticeProps = {
  manufacturer: string;
  model: string;
  refusal: string;
  warning: string;
  onBack: () => void;
  onReturn: () => void;
};

export function UnsupportedDeviceNotice({ manufacturer, model, refusal, warning, onBack, onReturn }: UnsupportedDeviceNoticeProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="shield-off-outline" size={34} color={colors.warning} />
      </View>
      <Text style={styles.title}>No verified guide</Text>
      <Text style={styles.model}>{manufacturer} - {model}</Text>
      <Text style={styles.copy}>{refusal}</Text>
      <Text style={styles.warning}>{warning}</Text>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.button}>
          <Text style={styles.buttonText}>Select Another Model</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onReturn} style={[styles.button, styles.secondary]}>
          <Text style={styles.buttonText}>Return to Device Testing</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.18)",
    borderColor: "rgba(77,163,255,0.34)",
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "900",
    textAlign: "center"
  },
  copy: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 21,
    textAlign: "center"
  },
  iconWrap: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,209,102,0.12)",
    borderRadius: radius.full,
    height: 66,
    justifyContent: "center",
    width: 66
  },
  model: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "800",
    textAlign: "center"
  },
  panel: {
    backgroundColor: "rgba(7,23,42,0.82)",
    borderColor: "rgba(255,209,102,0.28)",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  secondary: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.16)"
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "900",
    textAlign: "center"
  },
  warning: {
    color: colors.warning,
    fontSize: typography.caption,
    fontWeight: "900",
    lineHeight: 18,
    textAlign: "center"
  }
});
