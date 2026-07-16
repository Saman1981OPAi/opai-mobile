import type { WeatherCity } from "@/services/weather/weatherTypes";

export const canadianWeatherCities: WeatherCity[] = [
  { city: "Toronto", province: "Ontario", latitude: 43.6532, longitude: -79.3832, timezone: "America/Toronto" },
  { city: "Ottawa", province: "Ontario", latitude: 45.4215, longitude: -75.6972, timezone: "America/Toronto" },
  { city: "Montreal", province: "Quebec", latitude: 45.5019, longitude: -73.5674, timezone: "America/Toronto" },
  { city: "Vancouver", province: "British Columbia", latitude: 49.2827, longitude: -123.1207, timezone: "America/Vancouver" },
  { city: "Calgary", province: "Alberta", latitude: 51.0447, longitude: -114.0719, timezone: "America/Edmonton" },
  { city: "Edmonton", province: "Alberta", latitude: 53.5461, longitude: -113.4938, timezone: "America/Edmonton" },
  { city: "Winnipeg", province: "Manitoba", latitude: 49.8954, longitude: -97.1385, timezone: "America/Winnipeg" },
  { city: "Halifax", province: "Nova Scotia", latitude: 44.6488, longitude: -63.5752, timezone: "America/Halifax" },
  { city: "Quebec City", province: "Quebec", latitude: 46.8139, longitude: -71.208, timezone: "America/Toronto" },
  { city: "Hamilton", province: "Ontario", latitude: 43.2557, longitude: -79.8711, timezone: "America/Toronto" },
  { city: "London", province: "Ontario", latitude: 42.9849, longitude: -81.2453, timezone: "America/Toronto" },
  { city: "Mississauga", province: "Ontario", latitude: 43.589, longitude: -79.6441, timezone: "America/Toronto" },
  { city: "Brampton", province: "Ontario", latitude: 43.7315, longitude: -79.7624, timezone: "America/Toronto" },
  { city: "Markham", province: "Ontario", latitude: 43.8561, longitude: -79.337, timezone: "America/Toronto" },
  { city: "Vaughan", province: "Ontario", latitude: 43.8361, longitude: -79.4983, timezone: "America/Toronto" },
  { city: "Richmond Hill", province: "Ontario", latitude: 43.8828, longitude: -79.4403, timezone: "America/Toronto" },
  { city: "Aurora", province: "Ontario", latitude: 44.0065, longitude: -79.4504, timezone: "America/Toronto" },
  { city: "Newmarket", province: "Ontario", latitude: 44.0592, longitude: -79.4613, timezone: "America/Toronto" }
];

export const defaultWeatherCity = canadianWeatherCities[0]!;

export function searchCanadianWeatherCities(query: string) {
  const normalized = query.trim().toLocaleLowerCase("en-CA");
  if (!normalized) return canadianWeatherCities;

  return canadianWeatherCities.filter((item) =>
    `${item.city} ${item.province}`.toLocaleLowerCase("en-CA").includes(normalized)
  );
}
