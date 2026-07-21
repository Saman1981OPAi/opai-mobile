import { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { WeatherCityPickerModal } from "@/components/weather/WeatherCityPickerModal";
import { WeatherDetailModal } from "@/components/weather/WeatherDetailModal";
import { getTimeAwareGreeting, getTodayContext, startMinuteTicker, type TodayContext } from "@/services/timeService";
import { weatherService } from "@/services/weather/weatherService";
import type { WeatherAttribution, WeatherCity, WeatherSnapshot } from "@/services/weather/weatherTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function TodayContextCard({ firstName }: { firstName: string }) {
  const [today, setToday] = useState<TodayContext>(() => getTodayContext());
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [attribution, setAttribution] = useState<WeatherAttribution | null>(null);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = startMinuteTicker(setToday);
    weatherService.loadInitialWeather().then(setWeather).catch(() => setWeather(null));
    weatherService.getAttribution().then(setAttribution).catch(() => setAttribution(null));
    return () => clearInterval(timer);
  }, []);

  const refreshWeather = async () => {
    setLoading(true);
    try {
      setWeather(await weatherService.refreshSelectedWeather());
    } catch {
      Alert.alert("Weather Unavailable", "Weather could not be refreshed. The app will keep working without it.");
    } finally {
      setLoading(false);
    }
  };

  const requestLocationWeather = async () => {
    setLoading(true);
    try {
      setWeather(await weatherService.requestForegroundLocationWeather());
    } catch {
      Alert.alert(
        "Location Weather Not Enabled",
        "You can keep using the default city weather. OPAi does not track location in the background."
      );
    } finally {
      setLoading(false);
    }
  };

  const explainLocationWeather = () => {
    Alert.alert(
      "Use Approximate Location?",
      "OPAi will ask iOS for your foreground location once to request Apple Weather on this iPhone. OPAi does not save coordinates, track in the background, create location history, send location to AI, or transmit location to the OPAi backend.",
      [
        { style: "cancel", text: "Not Now" },
        { onPress: () => void requestLocationWeather(), text: "Continue" }
      ]
    );
  };

  const selectCity = async (city: WeatherCity) => {
    setCityPickerOpen(false);
    setLoading(true);
    try {
      setWeather(await weatherService.selectManualCity(city));
    } catch {
      Alert.alert("Weather Unavailable", "That city could not be loaded right now. Saved weather may still be shown.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.greeting}>
        {getTimeAwareGreeting(firstName)}
      </Text>
      <View style={styles.primaryRow}>
        <View style={styles.copy}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.time}>{today.timeLabel}</Text>
          <Text numberOfLines={1} style={styles.date}>{today.dayLabel}, {today.dateLabel}</Text>
        </View>
        <View style={styles.weatherPill}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={18} color={colors.ptsdGreen} />
          <Text numberOfLines={1} style={styles.weatherTemp}>
            {weather && weather.source !== "Unavailable" ? `${weather.temperatureC}C` : "--"}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityHint="Opens weather details and Apple attribution"
        accessibilityLabel={`${weather?.city ?? "Weather"}. ${weather?.condition ?? "Unavailable"}`}
        accessibilityRole="button"
        onPress={() => setDetailsOpen(true)}
        style={({ pressed }) => [styles.weatherRow, pressed ? styles.pressed : null]}
      >
        <Ionicons name="location-outline" size={17} color={colors.accentBlue} />
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.weatherTitle}>
            {weather ? weather.city : "Loading weather"}
          </Text>
          <Text numberOfLines={1} style={styles.weatherMeta}>
            {weather && weather.source !== "Unavailable"
              ? `${weather.condition}${weather.isStale ? " - saved" : ""}`
              : "Weather optional"}
          </Text>
        </View>
        <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
      </Pressable>

      <View style={styles.actions}>
        <SmallAction disabled={loading} icon="refresh" label="Refresh" onPress={refreshWeather} />
        <SmallAction disabled={loading} icon="location-outline" label="Local" onPress={explainLocationWeather} />
        <SmallAction disabled={loading} icon="map-outline" label="City" onPress={() => setCityPickerOpen(true)} />
      </View>

      <WeatherCityPickerModal onClose={() => setCityPickerOpen(false)} onSelect={(city) => void selectCity(city)} visible={cityPickerOpen} />
      <WeatherDetailModal attribution={attribution} onClose={() => setDetailsOpen(false)} visible={detailsOpen} weather={weather} />
    </View>
  );
}

function SmallAction({
  disabled,
  icon,
  label,
  onPress
}: {
  disabled: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`${label} weather`}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed ? styles.pressed : null, disabled ? styles.disabled : null]}
    >
      <Ionicons name={icon} size={15} color={colors.accentBlue} />
      <Text numberOfLines={1} style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 34,
    paddingHorizontal: spacing.sm
  },
  actionText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  card: {
    backgroundColor: "rgba(7,23,42,0.82)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.xxl,
    borderWidth: 1,
    gap: spacing.base,
    padding: spacing.md
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    marginTop: 2
  },
  disabled: {
    opacity: 0.55
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.72
  },
  primaryRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  time: {
    color: colors.textPrimary,
    fontSize: 34,
    fontVariant: ["tabular-nums"],
    fontWeight: "700",
    lineHeight: 38
  },
  weatherMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  weatherPill: {
    alignItems: "center",
    backgroundColor: "rgba(127,255,212,0.10)",
    borderColor: "rgba(127,255,212,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    flexShrink: 0,
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  weatherRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  weatherTemp: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontVariant: ["tabular-nums"],
    fontWeight: "700"
  },
  weatherTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "700"
  }
});
