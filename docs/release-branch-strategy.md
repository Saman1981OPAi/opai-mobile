# Release Branch Strategy

- Keep `main` stable and require reviewed pull requests.
- If a dedicated TestFlight stabilization line is needed, branch
  `release/ios-testflight-0.1.0-beta` from the reviewed `main` commit.
- Branch urgent fixes from the release branch and merge approved fixes back into both the release
  branch and `main`.
- Do not merge experimental features into the release branch.
- Tag a confirmed candidate as `ios-0.1.0-beta-rc1`; increment the candidate suffix for later
  binaries.
- Keep build numbers monotonically increasing even when the marketing version stays `0.1.0`.

This sprint documents the strategy only. It does not create a release branch or tag.

Android support remains on the shared codebase. Android production branching and Google Play work
remain paused pending the D-U-N-S Number for Ebrahimi Holdings.
