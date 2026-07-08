import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { BrandMark } from "@/components/ui/BrandMark";
import { colors, radius, spacing } from "@/theme/tokens";

type AppHeaderProps = {
  eyebrow?: string;
  title?: string;
  showTesting?: boolean;
};

export function AppHeader({ eyebrow = "Canadian Police Officers", title, showTesting = true }: AppHeaderProps) {
  return (
    <View style={styles.wrap}>
      <BrandMark compact={!title} />
      <View style={styles.copy}>
        {title ? <Text numberOfLines={1} style={styles.title}>{title}</Text> : null}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="leaf-maple" size={15} color={colors.canadianRed} />
            <Text numberOfLines={1} style={styles.badgeText}>{eyebrow}</Text>
          </View>
          {showTesting ? (
            <View style={[styles.badge, styles.testingBadge]}>
              <Text style={styles.testingText}>Testing</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderColor: "rgba(77,163,255,0.25)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800"
  },
  copy: {
    flex: 1
  },
  testingBadge: {
    borderColor: "rgba(110,219,143,0.35)"
  },
  testingText: {
    color: colors.ptsdGreen,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900"
  },
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg
  }
});
