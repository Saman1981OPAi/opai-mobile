# Build 26 GO / NO-GO

Decision date: 2026-07-16

## Current decision

**BUILD 26 GENERATION: NO-GO**

**PUBLIC RELEASE: HOLD**

Build 25 was rejected by Apple, removed from the active submission, and is historical only. It must
not be reused or resubmitted.

## Completed source gates

- Native Apple WeatherKit PR #33 merged to `main`.
- Foreground-only location explanation and permission flow implemented.
- Searchable 18-city Canadian catalogue implemented.
- Local cache, stale/offline state, and Clear Local Data coverage implemented.
- Apple Weather mark and legal attribution locations implemented.
- Reachable Open-Meteo and Azure weather paths removed.
- Focused source branches implement Apple remediation, Audio Statement, Paid Duty, Canvass, Mental
  Health Resources, audio transcription, production-backend hardening, and the public website.
- The final mobile branch prepares version `1.0.0`, production wording, current App Review notes,
  current metadata, and conservative privacy-answer mapping.
- No weather key, OpenAI key, credential, binary, paid Azure resource, or DNS change added.
- Final-branch typecheck, lint, 16 unit tests, iOS export, Android compatibility export, Metro HTTP
  smoke test, diff check, prohibited-file scan, and secret/direct-provider scan passed locally.

## Blocking gates

- Human review and ordered merge of all remaining focused Build 26 PRs.
- WeatherKit capability enabled for App ID `com.opaiapp.police`.
- Refreshed App Store provisioning profile containing the entitlement.
- Native EAS iOS compilation of the Swift module.
- Physical iPhone WeatherKit, permission-denied, offline, attribution, Dynamic Type, and VoiceOver
  certification.
- Human-approved Azure Pricing Calculator estimate at or below CAD 75/month before OpenAI and taxes.
- Production Azure backend deployment, security certification, health checks, and API-domain cutover.
- Dedicated production reviewer account and clean-install login/session certification on iPhone and
  iPad.
- Final merged-candidate typecheck, lint, tests, exports, security scan, screenshots, privacy review,
  and public-completeness audit.

Do not generate Build 26, provision paid Azure resources, modify DNS, or submit a new Apple binary
until the applicable gates are approved.
