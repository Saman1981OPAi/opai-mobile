# iOS Release Branch Checklist

## Recommended Strategy

- Keep `main` stable and merge Sprint 021 only after review and passing CI.
- Create `release/ios-testflight-0.1.0-beta` from the reviewed Sprint 021 merge commit only when the
  upload operator is ready to build.
- Allow only hotfixes, App Store metadata corrections, and beta-readiness fixes.
- Do not merge experimental work, new modules, or unrelated refactors.
- Tag the verified candidate `ios-0.1.0-beta-rc1` after a successful build and smoke test.

## Creation Gate

- [ ] Sprint 021 is merged into `main`.
- [ ] `main` is clean, current, and CI is passing.
- [ ] Target build and EAS remote baseline are confirmed.
- [ ] Release owner approves branch creation.
- [ ] No unrelated feature branch is included.

This Sprint 021 working branch is not the release branch. Do not create or tag the release line
before review and merge.
