import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WeatherSnapshot } from "@/services/weather/weatherTypes";

const cacheKey = "opai.weather.snapshot.v1";
const cacheMs = 30 * 60 * 1000;

export async function loadCachedWeather() {
  const raw = await AsyncStorage.getItem(cacheKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as WeatherSnapshot;
    const age = Date.now() - new Date(parsed.fetchedAt).getTime();
    return age < cacheMs ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveCachedWeather(snapshot: WeatherSnapshot) {
  await AsyncStorage.setItem(cacheKey, JSON.stringify(snapshot));
}

export async function clearCachedWeather() {
  await AsyncStorage.removeItem(cacheKey);
}
