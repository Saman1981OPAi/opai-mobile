# Build 26 GO / NO-GO

Decision date: 2026-07-13

## Current decision

**BUILD 26 GENERATION: NO-GO**

**PUBLIC RELEASE: HOLD**

Build 25 remains the certified and unchanged TestFlight binary connected to the Render staging
backend.

## Completed source gates

- Native Apple WeatherKit local Expo module implemented.
- Foreground-only location explanation and permission flow implemented.
- Searchable 18-city Canadian catalogue implemented.
- Local cache, stale/offline state, and Clear Local Data coverage implemented.
- Apple Weather mark and legal attribution locations implemented.
- Reachable Open-Meteo and Azure weather paths removed.
- Typecheck, lint, unit tests, clean iOS/Android exports, and Metro smoke test passed.
- No weather key, OpenAI key, credential, binary, paid Azure resource, or DNS change added.

## Blocking gates

- Human review and merge of the Build 26 WeatherKit PR.
- WeatherKit capability enabled for App ID `com.opaiapp.police`.
- Refreshed App Store provisioning profile containing the entitlement.
- Native EAS iOS compilation of the Swift module.
- Physical iPhone WeatherKit, permission-denied, offline, attribution, Dynamic Type, and VoiceOver
  certification.
- Human-approved Azure Pricing Calculator estimate at or below CAD 75/month before OpenAI and taxes.
- Production Azure backend deployment, security certification, health checks, and API-domain cutover.
- Mobile production API configuration and final privacy/App Store metadata review.

Do not generate Build 26, provision paid Azure resources, modify DNS, or submit a new Apple binary
until the applicable gates are approved.
