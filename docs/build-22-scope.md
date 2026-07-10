# Build 22 Scope

Build 22 is a hotfix release candidate after Build 21 failed physical iPhone certification.

## Included

- iOS layout containment fixes for cards, events, navigation labels, and workflow rows.
- Reduced user-facing wording on high-density screens.
- User-facing rename from New Incident to Report Writing / Report, while preserving internal route and storage identifiers.
- Home Dashboard time, date, manual city weather, optional foreground location weather, and weather refresh controls.
- Official OPAi community links:
  - WhatsApp Channel: https://whatsapp.com/channel/0029Vb8HFSMEQIaoXOL6YO1a
  - Instagram: https://www.instagram.com/opaiapp/
  - Facebook: https://www.facebook.com/profile.php?id=61591569999710
- App-only Device Testing module:
  - Home Dashboard quick-action button.
  - LIDAR, Stationary RADAR, Moving RADAR, ASD, Breath Instrument, and Use of Force categories.
  - Exact model selection before equipment-specific guide display.
  - Automatic curated local OPAi guide response with no typed prompt.
  - Verified local source metadata, source revision, and last-reviewed date.
  - Unsupported-model refusal and no cross-model substitution.
  - Qualified Technician restriction for Approved Breath Instrument checks.
  - Non-prescriptive Use of Force reference.
- Privacy, legal, weather, location, and App Store documentation updates.

## Excluded

- No backend, database, OpenAI, payment, subscription, analytics, tracking, file upload, cloud storage, police-service integration, or Android production workflow.
- No live AI call for Device Testing.
- No camera, microphone, Bluetooth, contacts, local network, serial-number collection, background location, or police-system permission for Device Testing.
- No official equipment certification, maintenance record, supervisory report, legal certificate, court certificate, evidentiary record, official notebook entry, or official equipment log.
- No Apple credentials, certificates, provisioning profiles, EAS tokens, or production secrets.
- Build 22 has not been generated or uploaded by this branch.

## Status

Build 22 source/configuration is prepared for human review. Public submission remains NO-GO until a Build 22 binary is generated, uploaded to App Store Connect, processed, installed through TestFlight, and physically certified on a real iPhone.
