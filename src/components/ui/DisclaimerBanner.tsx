import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type DisclaimerBannerProps = {
  message?: string;
};

export function DisclaimerBanner({
  message = "Testing preview. Reminders and AI outputs are support tools, not official direction."
}: DisclaimerBannerProps) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="information-circle-outline" size={18} color={colors.ptsdGreen} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 12,
    lineHeight: 17
  },
  wrap: {
    alignItems: "center",
    backgroundColor: "rgba(24,73,52,0.42)",
    borderColor: "rgba(110,219,143,0.28)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.base
  }
});
