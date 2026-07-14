# Build 26 Open-Meteo Audit

Audit date: 2026-07-13

## Before this change

The Home Today card reached Open-Meteo through:

- `src/services/weather/openMeteoWeatherProvider.ts`
- `src/services/weather/weatherService.ts`
- condition mapping in `src/services/weather/weatherCodeMapper.ts`
- Build 22 provider, privacy, and attribution documentation

The provider accepted city or foreground coordinates and called `api.open-meteo.com` directly from
the mobile app. It did not use a key.

## Build 26 result

- The provider and condition mapper were removed from runtime source.
- Build 26 uses a new weather cache version and deletes the legacy provider cache before reading.
- Native Apple WeatherKit is the only reachable production weather provider.
- No Open-Meteo URL, service identifier, attribution, feature flag, or network request remains in
  `src`, `modules`, `App.tsx`, `app.json`, `eas.json`, or package configuration.
- Historical Build 22 documents may retain dated Open-Meteo facts as release history.
- No Azure weather request or weather backend endpoint was introduced.

Build 25 remains unchanged. Build 26 has not been generated.
