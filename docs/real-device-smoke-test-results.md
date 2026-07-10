# Real-Device Smoke Test Results

## Status

Pending. Target build `21` has not been generated, uploaded, installed through TestFlight, or tested
on a physical iPhone/iPad as part of Sprint 022. No result is inferred from simulator, web, static,
or local export checks.

## Available Evidence

- Latest EAS iOS production build `8` finished successfully on July 8, 2026 from older commit
  `f558320`.
- Sprint 022 iOS/Android exports and local Metro startup are repository validation only.
- No crash report or TestFlight tester submission was available.

## Required Build 21 Test

- Startup: icon, splash, name, launch, no crash/blank screen
- Mock auth: sign-in, create account, consent, sign-out
- Navigation: every primary and secondary module starts at the top and can be exited
- Forms: keyboard does not hide required inputs or block actions
- Local data: note, incident, calendar item, restart persistence
- Notifications: explanation, allow/later, schedule, fire, preference, cancellation
- Legal/support: Privacy, Terms, disclaimers, Support
- Reset/clear: stable reseed and return to Welcome
- Accessibility: VoiceOver labels, 44-point controls, contrast, text scaling, clear errors
- iPad: layout, scrolling, navigation, and modal/form readability

Record device, iOS version, build, tester, date, result, and sanitized issue IDs after testing.
