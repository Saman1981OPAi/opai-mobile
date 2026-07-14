import * as Location from "expo-location";
import {
  getCurrentWeather,
  getWeatherAttribution,
  isNativeWeatherKitAvailable
} from "../../../modules/opai-weatherkit";
import {
  canadianWeatherCities,
  defaultWeatherCity,
  searchCanadianWeatherCities
} from "@/services/weather/canadianWeatherCities";
import {
  clearWeatherState,
  loadCachedWeather,
  loadSelectedWeatherCity,
  saveCachedWeather,
  saveSelectedWeatherCity
} from "@/services/weather/weatherCache";
import type { WeatherAttribution, WeatherCity, WeatherSnapshot } from "@/services/weather/weatherTypes";

export const manualWeatherCities = canadianWeatherCities;
export const appleWeatherDataSourcesUrl = "https://developer.apple.com/weatherkit/data-source-attribution/";

function unavailableWeather(city = "Canada"): WeatherSnapshot {
  return {
    city,
    condition: "Weather unavailable",
    conditionCode: "unavailable",
    feelsLikeC: 0,
    fetchedAt: new Date().toISOString(),
    highC: 0,
    isApproximate: true,
    isStale: false,
    lowC: 0,
    observedAt: new Date().toISOString(),
    source: "Unavailable",
    symbolName: "cloud.slash",
    temperatureC: 0
  };
}

function cityLabel(city: WeatherCity) {
  return `${city.city}, ${city.province}`;
}

async function fetchNativeWeather(city: WeatherCity, isApproximate: boolean) {
  const current = await getCurrentWeather({
    latitude: city.latitude,
    locale: "en-CA",
    longitude: city.longitude,
    temperatureUnit: "celsius"
  });
  const snapshot: WeatherSnapshot = {
    city: cityLabel(city),
    condition: current.conditionLabel,
    conditionCode: current.conditionCode,
    feelsLikeC: Math.round(current.feelsLikeC),
    fetchedAt: new Date().toISOString(),
    highC: Math.round(current.highC),
    isApproximate,
    isStale: false,
    lowC: Math.round(current.lowC),
    observedAt: current.observedAt,
    source: "Apple Weather",
    symbolName: current.symbolName,
    temperatureC: Math.round(current.temperatureC)
  };
  await saveCachedWeather(snapshot);
  return snapshot;
}

const fallbackAttribution: WeatherAttribution = {
  combinedMarkDarkURL: "",
  combinedMarkLightURL: "",
  legalPageURL: appleWeatherDataSourcesUrl,
  serviceName: "Apple Weather"
};

export const weatherService = {
  async loadInitialWeather() {
    const cached = await loadCachedWeather();
    if (cached) return cached;

    const selectedCity = (await loadSelectedWeatherCity()) ?? defaultWeatherCity;
    if (!isNativeWeatherKitAvailable()) return unavailableWeather(cityLabel(selectedCity));

    try {
      return await fetchNativeWeather(selectedCity, false);
    } catch {
      return unavailableWeather(cityLabel(selectedCity));
    }
  },

  async refreshSelectedWeather() {
    const selectedCity = (await loadSelectedWeatherCity()) ?? defaultWeatherCity;
    return fetchNativeWeather(selectedCity, false);
  },

  async requestForegroundLocationWeather() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      throw new Error("Location permission was not granted.");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });
    const locationTarget: WeatherCity = {
      city: "Current Area",
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      province: "Canada",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    return fetchNativeWeather(locationTarget, true);
  },

  async selectManualCity(city: WeatherCity) {
    await saveSelectedWeatherCity(city);
    return fetchNativeWeather(city, false);
  },

  async searchCanadianCities(query: string) {
    return searchCanadianWeatherCities(query);
  },

  async getAttribution(): Promise<WeatherAttribution> {
    if (!isNativeWeatherKitAvailable()) return fallbackAttribution;
    try {
      return await getWeatherAttribution();
    } catch {
      return fallbackAttribution;
    }
  },

  async clearLocalWeatherData() {
    await clearWeatherState();
  }
};
