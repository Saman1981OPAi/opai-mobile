import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { colors, spacing } from "@/theme/tokens";

type SectionHeaderProps = {
  title: string;
  action?: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
};

export function SectionHeader({ action, icon, title }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.titleWrap}>
        {icon ? <MaterialCommunityIcons name={icon} size={22} color={colors.primaryBlue} /> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700"
  },
  titleWrap: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm
  },
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  }
});
