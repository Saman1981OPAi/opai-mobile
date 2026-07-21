# Build 27 Location Tools Pre-Coding Audit

Status: AUDIT COMPLETE - IMPLEMENTATION NOT AUTHORIZED

Date: July 20, 2026

This document covers the required audit for the proposed My Location and Distance tools. It does
not authorize package installation, application changes, Google Cloud credential creation,
billing changes, Azure changes, or Build 27 generation.

## 1. Current map and location dependencies

| Item | Current state |
| --- | --- |
| Expo | `~57.0.7` |
| React Native | `0.86.0` |
| `expo-location` | Installed at `~57.0.5` |
| `react-native-maps` | Not installed |
| Native `ios/` directory | Not tracked; the project uses Expo CNG |
| Native `android/` directory | Not tracked; the project uses Expo CNG |
| Current location use | Foreground local weather only |
| Background location | Not configured or approved |
| Google Maps keys in source | None found |
| Google Geocoding integration | None found |

The existing `expo-location` plugin requests foreground location for local weather. Its permission
copy will need to cover both Weather and Location Tools if implementation is authorized.

## 2. Expo SDK compatibility

Expo SDK 57 uses React Native 0.86 and lists `react-native-maps` 1.27.2 as its compatible version.
The package is supported by Expo Go for development, but production use of Google Maps on both
platforms requires native configuration and a new signed binary.

Recommended install after approval:

```text
pnpm exec expo install react-native-maps
```

The resolved version must remain the Expo-recommended 1.27.2 unless a later compatibility check
documents a different SDK 57 patch recommendation.

References:

- https://docs.expo.dev/versions/latest/sdk/map-view/
- https://docs.expo.dev/versions/v57.0.0/sdk/location/
- https://docs.expo.dev/config-plugins/plugins/

## 3. Required package changes

Only one new runtime package is expected:

- `react-native-maps` 1.27.2

No Routes, Directions, Distance Matrix, Navigation, Roads, Places, Street View, Geolocation, area
measurement, analytics, or background-location package is required.

The distance calculation should be a small local utility using a reviewed geodesic formula. Adding
a geospatial dependency is not justified unless numerical testing shows the local utility is
insufficient.

## 4. iOS native configuration

Verified production bundle identifier:

```text
com.opaiapp.police
```

Proposed configuration after approval:

- Add the `react-native-maps` config plugin through dynamic Expo configuration.
- Read `GOOGLE_MAPS_IOS_API_KEY` only during the EAS build.
- Configure the plugin's iOS Google Maps key field.
- Restrict the key to `com.opaiapp.police`.
- Restrict the key to Maps SDK for iOS only.
- Update `NSLocationWhenInUseUsageDescription` to:

```text
OPAi uses your location while you use Weather or Location Tools to display local weather,
coordinates, nearby location details, and map measurements.
```

- Do not add `NSLocationAlwaysUsageDescription`, location background modes, geofencing, or
  background tasks.
- Verify Google attribution is visible and unobscured.

The key is embedded in the signed application by the Maps SDK and is therefore not a secret in the
same sense as a server credential. Its protection depends on strict iOS application and API
restrictions.

## 5. Android native configuration

Verified package identifier:

```text
com.opaiapp.police
```

Proposed configuration after approval:

- Add the `react-native-maps` config plugin through dynamic Expo configuration.
- Read `GOOGLE_MAPS_ANDROID_API_KEY` only during the EAS build.
- Restrict the key to Android apps using the package and approved SHA-1 fingerprints.
- Restrict the key to Maps SDK for Android only.
- Retain `ACCESS_COARSE_LOCATION` and `ACCESS_FINE_LOCATION` only.
- Do not add `ACCESS_BACKGROUND_LOCATION`, `FOREGROUND_SERVICE_LOCATION`, a location foreground
  service, or geofencing.
- Request location only when the user opens My Location, Distance, or explicitly selects local
  Weather.

Android release remains paused. Android compatibility must be preserved, but Google Play
production work is not part of this audit.

## 6. Verified identifiers

| Platform | Identifier | Source |
| --- | --- | --- |
| iOS | `com.opaiapp.police` | `app.json` |
| Android | `com.opaiapp.police` | `app.json` |

The app uses remote EAS versioning. EAS profiles are `development`, `internal-staging`,
`production`, and `testflight`, with shared Node 22.23.1 and pnpm 11.9.0 settings.

Production API:

```text
https://api.opaiapp.com
```

Staging API:

```text
https://opai-backend-staging.onrender.com
```

## 7. Signing-fingerprint requirements

No Android keystore or signing certificate is tracked locally, and no SHA-1 fingerprint is present
in source. That is correct for security, but credential creation is blocked until an authorized
operator records:

- development-build SHA-1;
- EAS internal/preview SHA-1;
- EAS production SHA-1;
- Google Play App Signing SHA-1, if and when Play release work resumes.

Each package and SHA-1 pair must be explicitly listed on the Android Maps key. Unknown or obsolete
fingerprints must not be added. Fingerprints are identifiers, not private keys, but should still be
kept in restricted release documentation rather than app source.

## 8. Google Cloud services required

Only these services are justified:

- Maps SDK for iOS;
- Maps SDK for Android;
- Geocoding API for backend reverse geocoding.

No existing Google Cloud Maps project or Maps credential is evidenced in either repository. A
Google Cloud Console inventory is required before creating a project or key. No Google Cloud
project, service, credential, quota, or billing setting was created or changed during this audit.

## 9. API-key separation and restrictions

Three credentials are required:

| Credential | Application restriction | API restriction | Storage |
| --- | --- | --- | --- |
| iOS Maps | iOS app `com.opaiapp.police` | Maps SDK for iOS | EAS secret/build environment |
| Android Maps | Android package plus approved SHA-1 values | Maps SDK for Android | EAS secret/build environment |
| Backend Geocoding | Stable server egress IP, if available | Geocoding API only | Azure Key Vault |

Recommended variable names:

- `GOOGLE_MAPS_IOS_API_KEY`
- `GOOGLE_MAPS_ANDROID_API_KEY`
- `GOOGLE_GEOCODING_API_KEY`

Recommended Azure Key Vault secret name:

```text
GOOGLE-GEOCODING-API-KEY
```

The current Azure Container Apps environment is VNet-integrated and exposes HTTPS ingress, but the
repository defines no NAT Gateway, firewall, or other fixed outbound IP resource. Production
Geocoding credential creation must therefore wait for one of these separately approved controls:

1. a verified stable Azure outbound IP that can be used as an IP application restriction; or
2. Geocoding API v4 with an approved server-side OAuth 2.0 design.

An API-only restriction without a server application restriction does not satisfy the intended
production security gate. A new NAT or identity design may affect the approved Azure budget and
must receive cost approval before provisioning.

References:

- https://developers.google.com/maps/api-security-best-practices
- https://developers.google.com/maps/documentation/geocoding/geocoding-v4-overview

## 10. Backend endpoint design

The FastAPI backend uses `settings.api_v1_prefix = "/api/v1"` and also exposes a hidden
compatibility alias at `/v1`. The canonical endpoint should be:

```text
POST /api/v1/location/describe
```

It must:

- require the existing JWT user dependency;
- accept latitude from -90 through 90 and longitude from -180 through 180;
- accept a nullable, bounded non-negative accuracy value;
- reject NaN, infinity, malformed input, and out-of-range values;
- use a short timeout and no unbounded retries;
- avoid logging request or provider bodies;
- avoid storing coordinates or Google responses;
- return a sanitized structured response;
- map provider auth, quota, timeout, and unavailable states to stable OPAi error codes;
- use a per-user limit and a project-wide daily limit;
- support an emergency `LOCATION_TOOLS_ENABLED` or `GOOGLE_GEOCODING_ENABLED` kill switch.

Request:

```json
{
  "latitude": 44.0,
  "longitude": -79.0,
  "accuracy_meters": 12.0
}
```

Response:

```json
{
  "latitude": 44.0,
  "longitude": -79.0,
  "formatted_address": null,
  "intersection": null,
  "intersection_status": "unavailable",
  "route": null,
  "locality": null,
  "administrative_area": "Ontario",
  "country": "Canada",
  "provider": "google",
  "resolved_at": "2026-07-20T21:20:00Z"
}
```

The service must never fabricate an intersection. The response fallback order is intersection,
street/address, route, then unavailable. City fallback is locality, postal town, sublocality, then
administrative area.

## 11. Location privacy analysis

Exact coordinates are sensitive personal data. My Location requires precise foreground access for
coordinates, accuracy, and intersection lookup. Distance can work without uploading measurement
points; its calculations must stay on-device.

Required controls:

- no background or continuous tracking;
- no location history;
- no automatic sharing;
- no analytics or advertising use;
- no coordinate values in URLs, crash reports, logs, notifications, or screenshots;
- no persistent storage by default;
- no reverse-geocoding call until the authenticated user explicitly opens My Location;
- transport encryption and bounded timeouts;
- provider and application logs redact request and response bodies;
- copy and share actions remain explicit;
- GPS coordinates and local distance remain available without internet where the OS provides them.

Apple App Privacy must be reviewed for Precise Location and any ephemeral off-device processing by
Google and the OPAi backend. Google Play Data Safety must disclose precise and approximate location
as applicable, including ephemeral transmission. The public privacy policy currently covers only
WeatherKit foreground location and must be updated before release.

References:

- https://developer.apple.com/app-store/app-privacy-details/
- https://support.google.com/googleplay/android-developer/answer/10787469
- https://support.google.com/googleplay/android-developer/answer/17033915

## 12. Expected Google Maps costs and quotas

As of July 20, 2026:

- Maps SDK has an unlimited no-charge usage cap.
- Geocoding includes 10,000 no-charge monthly events.
- Geocoding from 10,001 through 100,000 events is USD 5.00 per 1,000 events.
- Google documents a default Geocoding limit of 3,000 queries per minute and supports lower daily
  quotas.
- Billing is required even when use remains inside the no-charge cap.

Conservative launch proposal, subject to explicit billing approval:

- Google project daily Geocoding quota: 250 requests;
- backend per-user quota: 5 requests per minute and 25 per day;
- one lookup on screen entry, plus user-initiated Refresh only;
- no geocoding during map movement or distance measurement;
- no automatic retries for quota, auth, or billing failures;
- at most one bounded retry for a transient provider failure;
- alerts at USD 1, USD 5, and USD 10;
- daily usage report without coordinates;
- emergency backend kill switch.

A 250-request daily cap permits at most 7,750 requests in a 31-day month, leaving test and billing
headroom below the current 10,000-event no-charge cap. Budget alerts are notifications, not hard
spending caps; quota and the backend kill switch are the controlling safeguards.

References:

- https://developers.google.com/maps/billing-and-pricing/pricing
- https://developers.google.com/maps/documentation/geocoding/usage-and-billing
- https://developers.google.com/maps/billing-and-pricing/manage-costs

No billing, quota, alert, API, or credential was changed during this audit.

## 13. Expected files after implementation approval

Mobile:

```text
app.config.ts
app.json
eas.json
package.json
pnpm-lock.yaml
src/components/AppShell.tsx
src/components/ui/BottomNavigation.tsx
src/features/locationTools/ToolsScreen.tsx
src/features/locationTools/MyLocationScreen.tsx
src/features/locationTools/DistanceScreen.tsx
src/features/locationTools/components/*
src/features/locationTools/hooks/*
src/features/locationTools/services/*
src/features/locationTools/types/*
src/features/locationTools/*.test.ts
src/services/api/locationApi.ts
src/theme/*
docs/build-27-location-tools.md
```

Backend:

```text
app/api/v1/router.py
app/api/v1/routes/location.py
app/core/config.py
app/schemas/location.py
app/services/location_service.py
app/services/location_usage_limiter.py
tests/test_location.py
alembic/versions/*_add_location_usage_limits.py
infra/azure/container-app.bicep
docs/build-27-location-backend.md
```

Website and release metadata:

```text
opai-website/app/privacy-policy/page.tsx
App Store privacy answers
Google Play Data Safety answers
App Review notes
```

This is an expected change map, not permission to edit every listed file.

## 14. Test plan

Automated mobile tests:

- foreground permission state mapping;
- stale versus current position labels;
- coordinate validation and decimal/DMS formatting;
- accuracy and timestamp presentation;
- copy/share payload construction;
- geodesic two-point and multi-segment calculations;
- zero, one, duplicate, boundary, and antipodal points;
- metric and imperial formatting without false precision;
- ruler off/on interaction, Undo, Clear, and stable point IDs;
- no network call during distance calculation;
- no area result;
- offline and provider-error state mapping;
- no background permission or sensitive logging.

Automated backend tests:

- authenticated access only;
- invalid-coordinate rejection;
- per-user and project limits;
- bounded provider timeout;
- provider auth/quota/error sanitization;
- no request-body or response-body logging;
- no persistent coordinate storage;
- safe intersection and locality fallback;
- backend key never returned;
- kill switch.

Build and static gates:

- TypeScript;
- lint;
- unit tests;
- iOS Expo export;
- Android compatibility export;
- Expo Doctor;
- Metro smoke test;
- backend Ruff, mypy, pytest, and dependency audit;
- secret and prohibited-file scans;
- generated iOS/Android permission inspection.

Physical certification:

- iPhone and iPad;
- Android compatibility device;
- Allow Once, approximate, precise, denied, disabled services, timeout, Wi-Fi, cellular, offline;
- Standard, Satellite, and Hybrid maps;
- two-point and multi-segment distance;
- attribution visibility;
- redacted or synthetic evidence only.

## 15. Implementation sequence

After separate approval:

1. Approve Google Cloud project ownership, billing cap, quota, and backend restriction design.
2. Inventory signing fingerprints without exposing signing keys.
3. Install the Expo-compatible map package and create secret-backed dynamic app configuration.
4. Implement local geodesic utilities and tests first.
5. Implement the authenticated backend endpoint, rate limits, redaction, and tests.
6. Implement isolated `locationTools` screens and hooks.
7. Change navigation to OPAi, Report, Translate, Tools, Settings.
8. Add My Location, Distance, and Calendar to Tools.
9. Update privacy policy, store disclosures, permission copy, and review notes.
10. Create and restrict credentials only after configuration is ready.
11. Run automated, staging, quota, offline, and physical-device certification.
12. Request explicit Build 27 authorization only after every release gate passes.

## 16. Risks and decision

| Risk | Severity | Required mitigation |
| --- | --- | --- |
| Backend key lacks a stable server restriction | High | Approve fixed egress IP or OAuth design before key creation |
| Precise-location disclosure is incomplete | High | Update policy and store disclosures before release |
| Key abuse creates cost | High | Separate restricted keys, 250/day quota, alerts, rate limits, kill switch |
| Wrong Android SHA-1 blocks maps or weakens restriction | High | Inventory every signing certificate before key creation |
| Exact coordinates enter logs or diagnostics | High | Body redaction, no persistence, log tests |
| Intersection result is inaccurate or unavailable | Medium | Honest label and deterministic fallback |
| Map controls obscure Google attribution | Medium | Layout and physical-device checks |
| Foreground permission becomes background access | High | Generated-manifest and Info.plist inspection |
| CNG plugin regression breaks native builds | Medium | Prebuild/export/config inspection before EAS build |
| Android 17 precise-location policy changes | Medium | Recheck Play policy before Android launch |
| Build 27 scope is already large | High | Implement in an isolated feature and review separately |

Decision:

```text
LOCATION TOOLS PRE-CODING AUDIT: COMPLETE
LOCATION CODE: NOT AUTHORIZED
GOOGLE CLOUD CREDENTIALS: NOT CREATED
GOOGLE MAPS BILLING: NOT AUTHORIZED
INFRASTRUCTURE CHANGES: NOT AUTHORIZED
BUILD 27 GENERATION: NO-GO
PUBLIC SUBMISSION: NO-GO
```

The next required human decision is whether to approve implementation and which secure backend
Geocoding restriction strategy to use. Until then, the current OPAi/Report/Translate/Calendar/
Settings navigation remains unchanged.
