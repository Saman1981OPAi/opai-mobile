export function describeWeatherCode(code: number | undefined) {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Mainly clear";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code ?? -1)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code ?? -1)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return "Snow";
  if ([95, 96, 99].includes(code ?? -1)) return "Storm";
  return "Weather";
}
