# Build 26 WeatherKit Test Results

Test date: 2026-07-13

## Automated and static results

| Check | Result |
| --- | --- |
| TypeScript typecheck | Passed |
| Expo lint | Passed with 0 errors and 19 pre-existing warnings |
| iOS Expo export with clear cache | Passed |
| Android Expo export with clear cache | Passed for compatibility only |
| Metro smoke test | Passed; HTTP 200, server stopped after test |
| Canadian city catalogue size and ordering | Passed |
| Local city/province search | Passed |
| Coordinate and timezone validation | Passed |
| Cache fresh/stale threshold | Passed |
| Invalid/future cache timestamp handling | Passed |
| Expo module autolinking | Passed; `opai-weatherkit` resolved for Apple |
| WeatherKit entitlement config plugin | Passed introspection; Boolean `true`; native build pending |
| Open-Meteo runtime source/config scan | Passed: none found |
| Azure weather source/config scan | Passed: none found |
| Location sent to OPAi backend | Passed: no path found |
| Secret and prohibited-file scan | Passed; no secret values or prohibited artifacts found |
| Direct OpenAI and background-location scan | Passed: none introduced |

## Human/native checks still required

- Enable WeatherKit on App ID `com.opaiapp.police` and refresh provisioning.
- Compile the Swift module through EAS.
- Confirm allowed and denied location flows on a physical iPhone.
- Confirm current conditions, Celsius, high/low, manual city, offline cache, stale state, failure
  handling, Apple mark, legal link, and Clear Local Data.
- Confirm iPhone 15 Pro Max layout, Dynamic Type, and VoiceOver.

These pending items are not represented as passed. Build 26 remains NO-GO.
