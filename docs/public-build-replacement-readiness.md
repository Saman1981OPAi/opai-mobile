# Public Build Replacement Readiness

A replacement build is justified only when the selected binary, bundled assets, permissions,
configuration, or runtime behavior must change.

## Decision

- [ ] Apple message and exact build are recorded.
- [ ] Metadata-only correction was considered and rejected with a reason.
- [ ] Issue is reproduced or Apple's required correction is unambiguous.
- [ ] Fix is limited to the affected behavior.
- [ ] New unique build number is approved; uploaded numbers are never reused.
- [ ] Native version remains unchanged unless release version must change.

## Validation

- [ ] Typecheck and iOS export pass.
- [ ] Local launch and affected-flow regression pass.
- [ ] Physical iPhone and iPad checks pass where applicable.
- [ ] Permission and dependency diffs are reviewed.
- [ ] Backend/OpenAI/database/payment/upload/analytics/tracking/secret scans pass.
- [ ] Replacement is uploaded, processed, selected, and tested through TestFlight.
- [ ] Review notes identify the correction and replacement build.

Follow `docs/build-replacement-procedure.md` for execution. Sprint 024 does not generate or upload a
replacement build.
