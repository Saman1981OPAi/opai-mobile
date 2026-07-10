# Build 22 Test Matrix

## Required Before Build

- [ ] Review Build 22 PR diff.
- [ ] Confirm no credentials, binaries, profiles, certificates, API keys, EAS tokens, or secrets are committed.
- [ ] Confirm Android release remains paused pending the D-U-N-S Number for Ebrahimi Holdings.
- [ ] Run `pnpm typecheck`.
- [ ] Run iOS Expo export.
- [ ] Run Android Expo export for compatibility only.
- [ ] Run local Expo smoke test.
- [ ] Static scan for prohibited integrations.

## Required After Build 22 Upload

- [ ] Build number is 22.
- [ ] Build appears in App Store Connect TestFlight.
- [ ] Export compliance, if prompted, is answered accurately.
- [ ] Build installs through TestFlight on a physical iPhone.
- [ ] Home Dashboard text stays inside screen/card boundaries.
- [ ] Today context card shows time, date, weather, refresh, Local, and City controls.
- [ ] Location prompt appears only after tapping Local.
- [ ] App still works if location permission is denied.
- [ ] Report Writing opens and uses compact labels.
- [ ] OPAi Assistant, Translation, Calendar, Court, Training, Notes & Files, Notifications, and Settings open.
- [ ] WhatsApp, Instagram, and Facebook external links open safely.
- [ ] Privacy, Terms, Support, and disclaimers remain reachable.

## Decision

Build 22 is not certified until the physical iPhone checklist passes.
