import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { openExternalUrl } from "@/config/externalLinks";
import type { WeatherAttribution, WeatherSnapshot } from "@/services/weather/weatherTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type Props = {
  attribution: WeatherAttribution | null;
  onClose: () => void;
  visible: boolean;
  weather: WeatherSnapshot | null;
};

export function WeatherDetailModal({ attribution, onClose, visible, weather }: Props) {
  const legalUrl = attribution?.legalPageURL ?? "https://developer.apple.com/weatherkit/data-source-attribution/";
  const markUrl = attribution?.combinedMarkDarkURL || attribution?.combinedMarkLightURL;

  return (
    <Modal animationType="fade" onRequestClose={onClose} presentationStyle="pageSheet" visible={visible}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text maxFontSizeMultiplier={1.4} style={styles.title}>Weather details</Text>
            <Text maxFontSizeMultiplier={1.4} style={styles.subtitle}>{weather?.city ?? "Weather unavailable"}</Text>
          </View>
          <Pressable accessibilityLabel="Close weather details" accessibilityRole="button" onPress={onClose} style={styles.iconButton}>
            <MaterialCommunityIcons color={colors.textPrimary} name="close" size={24} />
          </Pressable>
        </View>

        <View style={styles.conditions}>
          <MaterialCommunityIcons color={colors.primaryBlue} name="weather-partly-cloudy" size={44} />
          <View style={styles.conditionsCopy}>
            <Text maxFontSizeMultiplier={1.4} style={styles.temperature}>
              {weather?.source === "Apple Weather" ? `${weather.temperatureC} C` : "--"}
            </Text>
            <Text maxFontSizeMultiplier={1.4} style={styles.condition}>{weather?.condition ?? "Unavailable"}</Text>
          </View>
        </View>

        <View style={styles.factGrid}>
          <WeatherFact label="Feels like" value={weather ? `${weather.feelsLikeC} C` : "--"} />
          <WeatherFact label="High / Low" value={weather ? `${weather.highC} / ${weather.lowC} C` : "--"} />
          <WeatherFact label="Updated" value={weather ? new Date(weather.fetchedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "--"} />
          <WeatherFact label="Status" value={weather?.isStale ? "Saved - may be outdated" : "Current"} />
        </View>

        <View style={styles.attributionPanel}>
          {markUrl ? <Image accessibilityLabel="Apple Weather" resizeMode="contain" source={{ uri: markUrl }} style={styles.appleMark} /> : (
            <Text style={styles.appleText}>{attribution?.serviceName ?? "Apple Weather"}</Text>
          )}
          <Pressable
            accessibilityLabel="Open Apple Weather data sources"
            accessibilityRole="link"
            onPress={() => void openExternalUrl(legalUrl)}
            style={({ pressed }) => [styles.legalLink, pressed ? styles.pressed : null]}
          >
            <Text style={styles.legalText}>Weather data sources</Text>
            <MaterialCommunityIcons color={colors.accentBlue} name="open-in-new" size={17} />
          </Pressable>
        </View>

        <Text maxFontSizeMultiplier={1.4} style={styles.disclaimer}>
          Weather is informational only. It is not an emergency, dispatch, tactical, road-safety, or operational weather source.
        </Text>
      </View>
    </Modal>
  );
}

function WeatherFact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text maxFontSizeMultiplier={1.4} style={styles.factLabel}>{label}</Text>
      <Text maxFontSizeMultiplier={1.4} style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appleMark: { height: 32, width: 150 },
  appleText: { color: colors.textPrimary, fontSize: typography.body, fontWeight: "700" },
  attributionPanel: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  condition: { color: colors.textSecondary, fontSize: typography.body, fontWeight: "700" },
  conditions: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg
  },
  conditionsCopy: { flex: 1, minWidth: 0 },
  disclaimer: { color: colors.textMuted, fontSize: typography.caption, lineHeight: 20, textAlign: "center" },
  fact: { backgroundColor: colors.surface, borderRadius: radius.md, flex: 1, gap: spacing.xs, minWidth: 130, padding: spacing.md },
  factGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  factLabel: { color: colors.textMuted, fontSize: typography.caption, fontWeight: "700" },
  factValue: { color: colors.textPrimary, fontSize: typography.small, fontWeight: "700" },
  header: { alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, minWidth: 0 },
  iconButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  legalLink: { alignItems: "center", flexDirection: "row", gap: spacing.xs, minHeight: 44 },
  legalText: { color: colors.accentBlue, fontSize: typography.small, fontWeight: "700" },
  pressed: { opacity: 0.72 },
  screen: { backgroundColor: colors.background, flex: 1, gap: spacing.lg, padding: spacing.lg, paddingTop: spacing.xl },
  subtitle: { color: colors.textMuted, fontSize: typography.caption, marginTop: 2 },
  temperature: { color: colors.textPrimary, fontSize: 34, fontWeight: "700" },
  title: { color: colors.textPrimary, fontSize: typography.h3, fontWeight: "700" }
});
