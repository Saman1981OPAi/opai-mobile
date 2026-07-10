import { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View, type AlertButton } from "react-native";
import { getTodayContext, startMinuteTicker, type TodayContext } from "@/services/timeService";
import { manualWeatherCities, weatherService } from "@/services/weather/weatherService";
import type { WeatherSnapshot } from "@/services/weather/weatherTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function TodayContextCard() {
  const [today, setToday] = useState<TodayContext>(() => getTodayContext());
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = startMinuteTicker(setToday);
    weatherService.loadInitialWeather().then(setWeather).catch(() => setWeather(null));
    return () => clearInterval(timer);
  }, []);

  const refreshWeather = async () => {
    setLoading(true);
    try {
      setWeather(await weatherService.refreshDefaultWeather());
    } catch {
      Alert.alert("Weather Unavailable", "Weather could not be refreshed. The app will keep working without it.");
    } finally {
      setLoading(false);
    }
  };

  const useLocationWeather = async () => {
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

  const chooseCity = () => {
    const buttons: AlertButton[] = manualWeatherCities.map((city) => ({
      text: city.name,
      onPress: async () => {
        setLoading(true);
        try {
          setWeather(await weatherService.selectManualCity(city));
        } catch {
          Alert.alert("Weather Unavailable", "That city could not be loaded right now.");
        } finally {
          setLoading(false);
        }
      }
    }));
    buttons.push({ text: "Cancel", style: "cancel" });

    Alert.alert(
      "Weather City",
      "Choose a Canadian city for local weather.",
      buttons
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.primaryRow}>
        <View style={styles.iconBubble}>
          <Ionicons name="time-outline" size={22} color={colors.primaryBlue} />
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.time}>{today.timeLabel}</Text>
          <Text numberOfLines={1} style={styles.date}>{today.dayLabel} · {today.dateLabel}</Text>
        </View>
        <View style={styles.weatherPill}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={18} color={colors.ptsdGreen} />
          <Text numberOfLines={1} style={styles.weatherTemp}>
            {weather && weather.source !== "Unavailable" ? `${weather.temperatureC}C` : "--"}
          </Text>
        </View>
      </View>

      <View style={styles.weatherRow}>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.weatherTitle}>
            {weather ? weather.city : "Loading weather"}
          </Text>
          <Text numberOfLines={1} style={styles.weatherMeta}>
            {weather && weather.source !== "Unavailable"
              ? `${weather.condition} · Feels ${weather.feelsLikeC}C · H ${weather.highC} / L ${weather.lowC}`
              : "Open-Meteo preview · no API key"}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <SmallAction disabled={loading} icon="refresh" label="Refresh" onPress={refreshWeather} />
        <SmallAction disabled={loading} icon="location-outline" label="Local" onPress={useLocationWeather} />
        <SmallAction disabled={loading} icon="map-outline" label="City" onPress={chooseCity} />
      </View>
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
    fontWeight: "900"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  card: {
    backgroundColor: "rgba(7,23,42,0.82)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "800",
    marginTop: 2
  },
  disabled: {
    opacity: 0.55
  },
  iconBubble: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.14)",
    borderRadius: radius.lg,
    height: 42,
    justifyContent: "center",
    width: 42
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
    fontSize: typography.h2,
    fontVariant: ["tabular-nums"],
    fontWeight: "900"
  },
  weatherMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "800"
  },
  weatherPill: {
    alignItems: "center",
    backgroundColor: "rgba(127,255,212,0.10)",
    borderColor: "rgba(127,255,212,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  weatherRow: {
    flexDirection: "row"
  },
  weatherTemp: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontVariant: ["tabular-nums"],
    fontWeight: "900"
  },
  weatherTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "900"
  }
});
