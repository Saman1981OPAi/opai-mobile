# Build 22 Device Testing

Device Testing is an app-only Build 22 module. It must not be presented as a public website workflow or as an official testing record system.

## User Flow

Home -> Device Testing -> category -> exact model -> verified local guide.

The initial guide appears automatically. The user does not type a prompt to receive the first response.

## Categories

- LIDAR
- Stationary RADAR
- Moving RADAR
- ASD
- Breath Instrument
- Use of Force

## Build 22 Behavior

- Uses bundled curated local guide content.
- Works offline.
- Shows source title, source revision, last checked date, and content reviewed date.
- Labels guide responses as `Verified Local Guide`.
- Labels response mode as `Curated Local OPAi Response`.
- Refuses unsupported models instead of substituting another procedure.
- Requires qualified-technician confirmation before breath-instrument content.
- Keeps Use of Force non-prescriptive.

## Exclusions

- No OpenAI API call.
- No backend request.
- No database integration.
- No live AI generation.
- No API key or mobile AI secret.
- No official equipment certification.
- No official maintenance record.
- No police-service notification.
- No evidentiary record.
- No background location, camera, microphone, Bluetooth, contacts, local network, or police-system permission.

## Required Notices

OPAi provides reference assistance only. Always follow current law, authorized training, police-service policy, and the exact manufacturer procedure.

If any required test fails, do not use the device for enforcement. Remove it from service and follow the police service equipment-reporting, maintenance, and replacement procedure.

Any locally saved result in a future sprint must be labelled: `Personal reference only - not an official equipment record.`
