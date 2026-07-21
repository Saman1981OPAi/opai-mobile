import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { colors, radius, spacing } from "@/theme/tokens";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View style={styles.wrap} accessibilityLabel="OPAi Police brand mark">
      <View style={[styles.shield, compact ? styles.shieldCompact : null]}>
        <MaterialCommunityIcons
          name="leaf-maple"
          size={compact ? 18 : 24}
          color={colors.canadianRed}
        />
      </View>
      <View>
        <Text style={[styles.logo, compact ? styles.logoCompact : null]}>
          OPA<Text style={styles.logoBlue}>i</Text>
        </Text>
        {!compact ? <Text style={styles.subline}>POLICE</Text> : null}
      </View>
    </View>
  );
}

export function MapleShield({ size = 42 }: { size?: number }) {
  return (
    <View
      style={[
        styles.shield,
        {
          height: size,
          width: size,
          borderRadius: Math.max(radius.md, Math.round(size * 0.22))
        }
      ]}
    >
      <MaterialCommunityIcons
        name="leaf-maple"
        size={Math.round(size * 0.48)}
        color={colors.canadianRed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 34
  },
  logoBlue: {
    color: colors.primaryBlue
  },
  logoCompact: {
    fontSize: 22,
    lineHeight: 25
  },
  shield: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: colors.textPrimary,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  shieldCompact: {
    borderRadius: radius.md,
    height: 38,
    width: 38
  },
  subline: {
    color: colors.primaryBlue,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 6
  },
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  }
});
