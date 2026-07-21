import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type QualifiedTechnicianGateProps = {
  onConfirm: () => void;
  onReturn: () => void;
};

export function QualifiedTechnicianGate({ onConfirm, onReturn }: QualifiedTechnicianGateProps) {
  return (
    <View style={styles.panel}>
      <MaterialCommunityIcons name="account-key-outline" size={42} color={colors.ptsdGreen} />
      <Text style={styles.title}>Qualified technician only</Text>
      <Text style={styles.copy}>
        This guide is intended only for a qualified technician designated under applicable Canadian law and trained on the exact approved instrument.
      </Text>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onConfirm} style={styles.primary}>
          <Text style={styles.primaryText}>I Am a Qualified Technician</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onReturn} style={styles.secondary}>
          <Text style={styles.secondaryText}>Return</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
    width: "100%"
  },
  copy: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 21,
    textAlign: "center"
  },
  panel: {
    alignItems: "center",
    backgroundColor: "rgba(7,23,42,0.82)",
    borderColor: "rgba(127,255,212,0.28)",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  primary: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.22)",
    borderColor: colors.primaryBlue,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: spacing.md
  },
  primaryText: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "700",
    textAlign: "center"
  },
  secondary: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: spacing.md
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: "700"
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700",
    textAlign: "center"
  }
});
