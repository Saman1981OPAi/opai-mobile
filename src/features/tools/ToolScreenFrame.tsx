import type { ReactNode } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function ToolScreenFrame({ children, onBack, subtitle, title }: {
  children: ReactNode;
  onBack: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Back to Tools" accessibilityRole="button" hitSlop={8} onPress={onBack} style={styles.back}>
          <MaterialCommunityIcons color={colors.primaryBlue} name="chevron-left" size={30} />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  back: { alignItems: "center", borderColor: colors.borderStrong, borderRadius: radius.full, borderWidth: 1, height: 46, justifyContent: "center", width: 46 },
  header: { alignItems: "center", flexDirection: "row", gap: spacing.base, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  page: { backgroundColor: colors.background, flex: 1, paddingBottom: 94 },
  subtitle: { color: colors.textMuted, fontSize: typography.small },
  title: { color: colors.textPrimary, fontSize: typography.h2, fontWeight: "700" },
  titleWrap: { flex: 1 }
});
