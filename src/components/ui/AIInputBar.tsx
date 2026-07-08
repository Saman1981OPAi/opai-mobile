import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type AIInputBarProps = {
  onPress?: () => void;
  placeholder?: string;
};

export function AIInputBar({ onPress, placeholder = "Ask OPAi..." }: AIInputBarProps) {
  return (
    <Pressable
      accessibilityLabel="Static AI input preview"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed ? styles.pressed : null]}
    >
      <View style={styles.spark}>
        <MaterialCommunityIcons name="auto-fix" size={22} color={colors.accentBlue} />
      </View>
      <Text numberOfLines={1} style={styles.placeholder}>{placeholder}</Text>
      <View style={styles.send}>
        <Ionicons name="arrow-up" size={22} color={colors.primaryBlue} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 18
  },
  pressed: {
    opacity: 0.76,
    transform: [{ translateY: 1 }]
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
