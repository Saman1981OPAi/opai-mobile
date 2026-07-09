# Build Replacement Procedure

Use this procedure when Apple requests a new binary or an approved hotfix changes app code,
configuration, permissions, or bundled assets.

1. Confirm the issue cannot be fixed only in editable App Store Connect metadata.
2. Branch from the stable release commit and apply the smallest reviewed fix.
3. Increment the iOS build number; do not reuse an uploaded build number.
4. Keep the marketing/native version unchanged unless the release version itself must change.
5. Run typecheck, iOS export, local smoke test, affected-flow test, and no-integration scan.
6. Generate and upload the signed iOS build.
7. Wait for App Store Connect processing to finish.
8. Remove the earlier build from the app version/submission if required. Do not delete the app
   record.
9. Select the newer processed build and update Beta/App Review notes with the correction.
10. Re-submit for TestFlight/App Review and record the build number in release documentation.
11. Install the replacement through TestFlight and repeat physical-device smoke testing.

If only screenshots, description, URLs, or other editable metadata change, document the correction
without creating an unnecessary binary.
