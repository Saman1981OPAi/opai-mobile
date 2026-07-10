# Sprint 022 Hotfix Readiness

- Build number increment required: No additional increment beyond target `21`; build `21` is unused
  and has not been generated.
- New build required: Yes. Existing EAS build `8` does not contain Sprint 022 fixes.
- App Store Connect action required: Yes, after review/merge and signed build processing.
- TestFlight upload required: Yes, target build `21`.
- App Review response required: No current Apple issue exists.
- Screenshot update required: Not for these behavior/accessibility fixes unless final screenshots no
  longer match the processed build.
- Physical-device verification required: Yes, iPhone and iPad.

Before building, confirm `21` is unused and synchronize the EAS remote baseline as documented in
`docs/version-build-number-review.md`. Do not upload automatically from this unreviewed branch.
