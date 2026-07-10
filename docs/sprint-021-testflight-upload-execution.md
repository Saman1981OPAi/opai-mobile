# Sprint 021: TestFlight Upload Execution and Internal Beta Launch

## Objective

Move OPAi Police from submission preparation to a reviewed, executable internal TestFlight launch
plan with target build `21`.

## Delivered

- Target build metadata for internal TestFlight beta
- iOS release-branch and final pre-upload checklists
- EAS remote-version synchronization guidance
- TestFlight build/upload instructions and App Store Connect manual actions
- Internal tester group setup and final App Review notes confirmation
- Physical-device smoke test and feedback workflows
- Internal beta announcement and post-upload monitoring checklist
- Hotfix and release-freeze confirmations
- README and current operational-document updates

## Execution Boundary

The repository is authenticated with EAS for the project owner, but the production profile uses
remote versioning. The EAS iOS counter was `8` when Sprint 021 began. Before a production build,
the release operator must use the interactive EAS version command to set the remote baseline to
`20`; production auto-increment will then create build `21`.

No remote version change, signed build, App Store upload, tester invitation, or Apple submission is
performed from this unreviewed branch. Those actions occur only from reviewed/merged release code
with authorized Apple tooling. Apple credentials must never be committed or shared in project
files.

## Safety Boundary

No backend, OpenAI, production database, cloud sync, real authentication, payment, subscription,
file upload, police-service integration, analytics, advertising, or new permission is added. The
app remains a local/offline prototype and testers must use demo data only.

## Platform Priority

iOS is the active launch target. Android compatibility remains intact; Android production and
Google Play work remain paused pending the D-U-N-S Number for Ebrahimi Holdings.

## Validation

- TypeScript typecheck passed.
- iOS Expo export passed with target build metadata `21`.
- Android Expo export passed for compatibility only.
- Local Expo/Metro startup reached the listening state in CI mode.
- Expo public configuration confirms app name, native version, bundle identifier, and target build.
- EAS authentication and remote iOS version were inspected without changing remote state.
- Static runtime integration, credential, encoding, and protected-mark scans passed; credential-name
  matches are documentation-only instructions for GitHub secret configuration.
- Existing local workflows remain unchanged except for visible release metadata.

## Next Recommended Sprint

Sprint 022 should be based on the actual EAS/App Store Connect result: record a successful upload
and physical-device QA, or deliver only the smallest verified hotfix required by processing,
review, or tester feedback.
