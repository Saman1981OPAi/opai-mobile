# Build 25 TestFlight Plan

After PR review and merge, generate Build 25 with the `testflight` profile. This is an App Store-distributed beta profile that connects only to the certified Render staging backend. The `production` profile and future production API hostname remain unchanged and are not authorized for this beta.

Build command: `pnpm exec eas build --platform ios --profile testflight --non-interactive`

After the build succeeds, submit that exact EAS build ID to App Store Connect without generating another binary. Build 25 is for TestFlight validation only and must not be submitted for public App Review.

Required physical checks: secure sign-in/out and expiry, consent, Assistant states, report safeguards, quota handling, microphone denial/record/cancel/cleanup, camera and library denial/confirm upload, document validation, RTL, offline Device Testing, Dynamic Type, VoiceOver, keyboard clearance, and long-response containment.
