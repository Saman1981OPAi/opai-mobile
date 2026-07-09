# Hotfix Branch Strategy

## Rules

- Keep `main` stable and branch from the exact reviewed release commit.
- If an iOS release branch exists, branch from it and merge the approved fix back into both the
  release branch and `main`.
- Use one narrowly scoped issue per hotfix PR.
- Do not use a hotfix branch to add features, refactor unrelated code, or redesign the app.

## Branch Names

- `hotfix/ios-testflight-build-processing`
- `hotfix/app-review-metadata`
- `hotfix/privacy-url`
- `hotfix/screenshot-assets`
- `hotfix/crash-on-launch`

## Workflow

1. Record Apple's or the tester's exact report and reproduce it.
2. Create the hotfix branch from the correct stable commit.
3. Apply the smallest correction and add/update its regression check or documentation.
4. Run typecheck, iOS export, affected-flow test, local smoke test, and no-integration scan.
5. Open a review PR with cause, correction, validation, and replacement-build impact.
6. Merge only after review and passing CI.
7. Increment the iOS build number only when producing a replacement binary.
8. Upload/select the new build and update release records.

Android compatibility must not be broken, but Android production hotfix and Google Play work remain
paused pending the D-U-N-S Number for Ebrahimi Holdings.
