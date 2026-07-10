# Sprint 022: Internal Beta Feedback Fixes

## Objective

Triage all currently available beta/build evidence and apply only focused release-blocking or
reasonable internal-QA fixes while preserving the local/offline prototype architecture.

## Evidence Reviewed

- No tester feedback in connected Gmail search
- No open GitHub issues
- No Apple review or TestFlight crash feedback available
- Latest EAS iOS build `8` finished successfully from older source
- Three historical GitHub EAS runs failed because `EXPO_TOKEN` was absent
- Current GitHub workflow token preflight and release documentation
- Simulated static navigation, layout, keyboard, and accessibility QA

## Fixes

- Reset the shared app scroll view to the top when switching modules.
- Added automatic keyboard inset handling, on-drag dismissal, and handled-tap behavior.
- Increased interactive chip and auth text-button targets to 44 points.
- Added explicit accessibility labeling to the auth text button.

## Deferred

- Generate/upload target build `21` after Sprint 022 review and merge.
- Physical iPhone/iPad TestFlight smoke and accessibility testing.
- Optional website redirects for unavailable short legal/support aliases.

## Release Impact

The next signed candidate must include these source fixes. Since target build `21` is not yet used,
no further increment is required before the first build `21`; EAS remote version synchronization
remains mandatory.

## Platform and Safety

iOS remains the launch priority. Android compatibility is preserved while Android production and
Google Play work remain paused pending the D-U-N-S Number. No backend/API/OpenAI/database, real
upload, payment, analytics, police integration, credential, secret, or new permission was added.

## Validation

- TypeScript typecheck passed.
- iOS Expo export passed.
- Android Expo export passed for compatibility only.
- Local Expo/Metro startup reached the listening state.
- Static integration, credential, protected-mark, encoding, and diff checks passed.
- Optional Expo web/browser QA was not performed because this mobile repository intentionally lacks
  `react-dom` and `react-native-web`; no dependency was added solely for QA.
- Real-device and TestFlight validation remain explicitly pending.

## Next Recommended Sprint

Sprint 023 should execute/record the reviewed build `21` upload and physical-device results, or make
only a small verified hotfix based on actual TestFlight/App Review feedback.
