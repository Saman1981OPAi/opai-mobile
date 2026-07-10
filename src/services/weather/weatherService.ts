import * as Location from "expo-location";
import { loadCachedWeather, saveCachedWeather } from "@/services/weather/weatherCache";
import { getOpenMeteoWeather, searchOpenMeteoCity } from "@/services/weather/openMeteoWeatherProvider";
import type { WeatherCity, WeatherSnapshot } from "@/services/weather/weatherTypes";

const defaultCity: WeatherCity = {
  latitude: 43.6532,
  longitude: -79.3832,
  name: "Toronto",
  province: "Ontario"
};

export const manualWeatherCities: WeatherCity[] = [
  defaultCity,
  { latitude: 45.4215, longitude: -75.6972, name: "Ottawa", province: "Ontario" },
  { latitude: 43.2557, longitude: -79.8711, name: "Hamilton", province: "Ontario" },
  { latitude: 44.3894, longitude: -79.6903, name: "Barrie", province: "Ontario" },
  { latitude: 49.2827, longitude: -123.1207, name: "Vancouver", province: "British Columbia" },
  { latitude: 51.0447, longitude: -114.0719, name: "Calgary", province: "Alberta" },
  { latitude: 45.5019, longitude: -73.5674, name: "Montreal", province: "Quebec" }
];

function unavailableWeather(city = "Canada"): WeatherSnapshot {
  return {
    city,
    condition: "Weather unavailable",
    feelsLikeC: 0,
    fetchedAt: new Date().toISOString(),
    highC: 0,
    isApproximate: true,
    lowC: 0,
    source: "Unavailable",
    temperatureC: 0
  };
}

export const weatherService = {
  async loadInitialWeather() {
    const cached = await loadCachedWeather();
    if (cached) return cached;

    try {
      const snapshot = await getOpenMeteoWeather(defaultCity);
      await saveCachedWeather(snapshot);
      return snapshot;
    } catch {
      return unavailableWeather(defaultCity.name);
    }
  },

  async refreshDefaultWeather() {
    const snapshot = await getOpenMeteoWeather(defaultCity);
    await saveCachedWeather(snapshot);
    return snapshot;
  },

  async requestForegroundLocationWeather() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      throw new Error("Location permission was not granted.");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });
    const city: WeatherCity = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      name: "Current Area"
    };
    const snapshot = await getOpenMeteoWeather(city);
    await saveCachedWeather(snapshot);
    return snapshot;
  },

  async selectManualCity(city: WeatherCity) {
    const snapshot = await getOpenMeteoWeather(city);
    await saveCachedWeather(snapshot);
    return snapshot;
  },

  async searchCanadianCities(query: string) {
    return searchOpenMeteoCity(query);
  }
};
