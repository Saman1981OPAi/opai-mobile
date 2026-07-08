import type { ComponentProps } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

type EventCardProps = {
  accent: string;
  date: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  meta: string;
  time: string;
  title: string;
};

export function EventCard({ accent, date, icon, meta, time, title }: EventCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={[styles.icon, { backgroundColor: `${accent}22` }]}>
        <MaterialCommunityIcons name={icon} size={26} color={accent} />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={styles.meta}>{meta}</Text>
      </View>
      <View style={styles.time}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.date, { color: accent }]}>{date}</Text>
        <Text style={styles.hour}>{time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  accent: {
    alignSelf: "stretch",
    borderRadius: radius.sm,
    width: 4
  },
  card: {
    alignItems: "center",
    backgroundColor: "rgba(10,32,58,0.72)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 72,
    overflow: "hidden",
    padding: spacing.sm
  },
  copy: {
    flex: 1
  },
  date: {
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right"
  },
  hour: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
    textAlign: "right"
  },
  icon: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3
  },
  time: {
    width: 62
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900"
  }
});
