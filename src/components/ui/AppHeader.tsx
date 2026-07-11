import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { BrandMark } from "@/components/ui/BrandMark";
import { colors, radius, spacing } from "@/theme/tokens";

type AppHeaderProps = {
  eyebrow?: string;
  title?: string;
  showTesting?: boolean;
};

export function AppHeader({ eyebrow = "Canada Police", title, showTesting = true }: AppHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.brandSide}>
        <BrandMark compact />
        {title ? <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>{title}</Text> : null}
      </View>
      <View style={styles.badgeColumn}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="leaf-maple" size={14} color={colors.canadianRed} />
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.badgeText}>{eyebrow}</Text>
        </View>
        {showTesting ? (
          <View style={[styles.badge, styles.testingBadge]}>
            <Text numberOfLines={1} style={styles.testingText}>Beta</Text>
          </View>
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
    maxWidth: 132
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800"
  },
  brandSide: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: spacing.sm,
    minWidth: 0
  },
  testingBadge: {
    backgroundColor: "rgba(127,255,212,0.10)",
    borderColor: "rgba(127,255,212,0.35)"
  },
  testingText: {
    color: colors.ptsdGreen,
    fontSize: 11,
    fontWeight: "900"
  },
  title: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: "900"
  },
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    marginBottom: spacing.lg
  }
});
