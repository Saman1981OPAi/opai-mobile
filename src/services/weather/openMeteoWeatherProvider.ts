import { describeWeatherCode } from "@/services/weather/weatherCodeMapper";
import type { WeatherCity, WeatherSnapshot } from "@/services/weather/weatherTypes";

type ForecastResponse = {
  current?: {
    apparent_temperature?: number;
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};

type GeocodeResponse = {
  results?: Array<{
    admin1?: string;
    country_code?: string;
    latitude: number;
    longitude: number;
    name: string;
  }>;
};

const forecastBaseUrl = "https://api.open-meteo.com/v1/forecast";
const geocodeBaseUrl = "https://geocoding-api.open-meteo.com/v1/search";

function roundCoordinate(value: number) {
  return Number(value.toFixed(2));
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7_000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getOpenMeteoWeather(city: WeatherCity, approximate = true): Promise<WeatherSnapshot> {
  const latitude = roundCoordinate(city.latitude);
  const longitude = roundCoordinate(city.longitude);
  const params = new URLSearchParams({
    current: "temperature_2m,apparent_temperature,weather_code",
    daily: "temperature_2m_max,temperature_2m_min",
    forecast_days: "1",
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: "auto"
  });
  const forecast = await fetchJson<ForecastResponse>(`${forecastBaseUrl}?${params.toString()}`);

  return {
    city: city.province ? `${city.name}, ${city.province}` : city.name,
    condition: describeWeatherCode(forecast.current?.weather_code),
    feelsLikeC: Math.round(forecast.current?.apparent_temperature ?? forecast.current?.temperature_2m ?? 0),
    fetchedAt: new Date().toISOString(),
    highC: Math.round(forecast.daily?.temperature_2m_max?.[0] ?? forecast.current?.temperature_2m ?? 0),
    isApproximate: approximate,
    lowC: Math.round(forecast.daily?.temperature_2m_min?.[0] ?? forecast.current?.temperature_2m ?? 0),
    source: "Open-Meteo",
    temperatureC: Math.round(forecast.current?.temperature_2m ?? 0)
  };
}

export async function searchOpenMeteoCity(query: string): Promise<WeatherCity[]> {
  const params = new URLSearchParams({
    count: "5",
    format: "json",
    language: "en",
    name: query
  });
  const response = await fetchJson<GeocodeResponse>(`${geocodeBaseUrl}?${params.toString()}`);

  return (response.results ?? [])
    .filter((result) => result.country_code === "CA")
    .map((result) => {
      const city: WeatherCity = {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name
      };
      return result.admin1 ? { ...city, province: result.admin1 } : city;
    });
}
