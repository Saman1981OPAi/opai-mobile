import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { BrandMark } from "@/components/ui/BrandMark";
import { resolveAppRuntimeEnvironment } from "@/config/runtimeEnvironment";
import { colors, radius, spacing } from "@/theme/tokens";

type AppHeaderProps = {
  compact?: boolean;
  eyebrow?: string;
  title?: string;
};

export function AppHeader({ compact = false, eyebrow = "Canadian Police", title }: AppHeaderProps) {
  const isInternalCertification = resolveAppRuntimeEnvironment() === "staging";

  return (
    <View style={[styles.wrap, compact ? styles.wrapCompact : null]}>
      <View style={styles.brandSide}>
        <BrandMark compact />
        {title ? <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>{title}</Text> : null}
      </View>
      <View style={styles.badgeColumn}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="leaf-maple" size={14} color={colors.canadianRed} />
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.badgeText}>{eyebrow}</Text>
        </View>
        {isInternalCertification ? (
          <Text accessibilityRole="text" style={styles.certificationText}>Internal Certification</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-end",
    borderColor: "rgba(77,163,255,0.25)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 28,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  badgeColumn: {
    alignItems: "flex-end",
    flexShrink: 0,
    gap: spacing.xs,
    maxWidth: 150
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 10.5,
    fontWeight: "700"
  },
  certificationText: {
    color: colors.warning,
    fontSize: 9.5,
    fontWeight: "700"
  },
  brandSide: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: spacing.sm,
    minWidth: 0
  },
  title: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: "700"
  },
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  wrapCompact: {
    marginBottom: 0
  }
});
