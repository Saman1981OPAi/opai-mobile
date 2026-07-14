# Build 26 Native Apple WeatherKit

## Architecture

`TodayContextCard` calls the TypeScript weather service, which calls the local
`modules/opai-weatherkit` Expo module. On iOS, its Swift bridge uses `WeatherService.shared` from
Apple WeatherKit. Weather does not pass through the OPAi backend or Azure.

## User flow

- Toronto is the default city when no city has been selected.
- City opens a searchable local catalogue of 18 approved Canadian cities.
- Local first explains exactly how foreground location will be used. iOS permission is requested
  only after the user chooses Continue.
- Denial or service failure leaves Home, time, date, and manual city selection usable.
- Weather details show current temperature, feels-like temperature, high/low, last update, stale
  status, Apple Weather attribution, and the legal data-source link.

## Privacy and storage

- No background location, geofencing, continuous tracking, location history, AI prompt location, or
  analytics location is implemented.
- Foreground coordinates are used for one native WeatherKit request and are not saved or sent to the
  OPAi backend.
- The selected manual city and last successful response are stored locally.
- Clear Local Data removes selected city and cached weather.

## Cache

The last successful response is cached for 30 minutes. Older data can remain visible offline with a
subtle saved/stale label and last-updated time. Weather does not refresh on the minute ticker.
The Build 26 cache uses a new version and removes the legacy Open-Meteo cache during migration.

## Platform behavior

- iOS 16.4 or later: native WeatherKit after capability/provisioning is complete.
- Android: the native module is optional and reports unavailable; Android compatibility is
  preserved while Android release remains paused.

## Status

Source implementation is complete. Native EAS compilation and physical-iPhone behavior remain
blocked on the Apple WeatherKit capability and a later reviewed Build 26 generation step.
