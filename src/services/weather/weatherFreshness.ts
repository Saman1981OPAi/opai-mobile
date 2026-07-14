export const weatherCacheDurationMs = 30 * 60 * 1000;

export function isWeatherCacheStale(fetchedAt: string, now = Date.now()) {
  const fetchedAtMs = new Date(fetchedAt).getTime();
  const age = now - fetchedAtMs;
  return !Number.isFinite(age) || age < 0 || age >= weatherCacheDurationMs;
}
