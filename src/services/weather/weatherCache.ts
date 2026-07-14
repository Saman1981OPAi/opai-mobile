import AsyncStorage from "@react-native-async-storage/async-storage";
import { isWeatherCacheStale } from "@/services/weather/weatherFreshness";
import type { WeatherCity, WeatherSnapshot } from "@/services/weather/weatherTypes";

const cacheKey = "opai.weather.snapshot.v2";
const legacyCacheKey = "opai.weather.snapshot.v1";
const selectedCityKey = "opai.weather.selected-city.v1";

export async function loadCachedWeather() {
  await AsyncStorage.removeItem(legacyCacheKey);
  const raw = await AsyncStorage.getItem(cacheKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as WeatherSnapshot;
    if (!parsed.fetchedAt) return null;
    return { ...parsed, isStale: isWeatherCacheStale(parsed.fetchedAt) };
  } catch {
    return null;
  }
}

export async function saveCachedWeather(snapshot: WeatherSnapshot) {
  await AsyncStorage.setItem(cacheKey, JSON.stringify({ ...snapshot, isStale: false }));
}

export async function loadSelectedWeatherCity() {
  const raw = await AsyncStorage.getItem(selectedCityKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as WeatherCity;
  } catch {
    return null;
  }
}

export async function saveSelectedWeatherCity(city: WeatherCity) {
  await AsyncStorage.setItem(selectedCityKey, JSON.stringify(city));
}

export async function clearWeatherState() {
  await Promise.all([
    AsyncStorage.removeItem(cacheKey),
    AsyncStorage.removeItem(legacyCacheKey),
    AsyncStorage.removeItem(selectedCityKey)
  ]);
}
