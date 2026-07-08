import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type AIInputBarProps = {
  placeholder?: string;
};

export function AIInputBar({ placeholder = "Ask OPAi..." }: AIInputBarProps) {
  return (
    <View style={styles.wrap} accessibilityLabel="Static AI input preview">
      <View style={styles.spark}>
        <MaterialCommunityIcons name="auto-fix" size={22} color={colors.accentBlue} />
      </View>
      <Text numberOfLines={1} style={styles.placeholder}>{placeholder}</Text>
      <View style={styles.send}>
        <Ionicons name="arrow-up" size={22} color={colors.primaryBlue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 18
  },
  send: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.16)",
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  spark: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.16)",
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  wrap: {
    alignItems: "center",
    backgroundColor: "rgba(6,15,29,0.92)",
    borderColor: colors.primaryBlue,
    borderRadius: radius.xxl,
    borderWidth: 2,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 62,
    padding: spacing.sm
  }
});
