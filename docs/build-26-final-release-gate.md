# Build 26 Final Release Configuration Gate

Updated: 2026-07-16

Status: **NO-GO - production backend deployment and certification are still required.**

## Prepared in this branch

- Public app/native version is prepared as `1.0` / `1.0.0`.
- Build 26 remains the next intended iOS build; no binary is generated here.
- The production EAS profile points to `https://api.opaiapp.com`.
- Device Testing remains hidden from public navigation.
- Subscription/paywall/Pro claims remain hidden because StoreKit and backend entitlement enforcement
  are not complete.
- Reachable Settings wording no longer describes the app, account, or policies as mock, testing,
  prototype, placeholder, staging, or incomplete.
- Incomplete biometric and file-management claims are not exposed as public actions.
- App Store metadata, App Review notes, and App Privacy mapping now describe the intended Build 26
  behavior instead of the historical local-only app.

## Internal identifiers retained

Historical type/property/function names such as `MockUserProfile`, `prototypeDisclaimer`, and
`LocalPrototypeWarning` are internal identifiers only. Their rendered labels and messages are
production-safe. Dormant legacy screens are not included in the module catalogue or navigation.
They must remain unreachable and unadvertised in the final binary.

## Validation completed on this branch

- `pnpm typecheck`: passed.
- `pnpm lint`: passed with zero errors and 19 pre-existing warnings.
- `pnpm test`: passed, 16 of 16 tests.
- iOS Expo export with a cleared Metro cache: passed.
- Android Expo compatibility export with a cleared Metro cache: passed.
- Local Metro launch smoke test: passed with HTTP 200.
- `git diff --check`: passed.
- Tracked prohibited-file scan: passed; no `.env`, IPA, provisioning profile, certificate, private-key,
  or signing artifact is tracked.
- Secret/direct-provider scan: passed; no OpenAI key, project key, JWT, backend credential, or direct
  `api.openai.com` call was found in tracked source.

The local Windows pnpm installation exposed React runtime files as hardlinks that Metro would not
hash. Exports were validated with regular-file copies of the standard React JSX runtime in a
temporary local Metro shim. The shim and temporary Metro configuration were removed after
validation and are not part of this branch. This workstation-only condition does not certify an EAS
native build; the final merged candidate still requires the normal EAS iOS compilation gate.

## Blocking gates

1. Merge all focused Build 26 feature PRs in order after human review.
2. Deploy and certify the Canada Central production backend.
3. Confirm TLS plus `/health` and `/ready` at `https://api.opaiapp.com`.
4. Create the dedicated production App Review account without storing credentials in Git.
5. Verify clean-install login and session restoration on iPhone and iPad.
6. Enable WeatherKit for `com.opaiapp.police` and refresh provisioning.
7. Confirm the EAS remote iOS baseline remains 25 so the next production build is 26.
8. Re-run typecheck, lint, tests, iOS export, Android compatibility export, secret scan, and public
   wording audit from the merged release candidate.
9. Generate and upload Build 26 to TestFlight only, then complete physical iPhone/iPad certification.

Do not submit to App Review until a separate final report is independently reviewed and the human
operator explicitly authorizes submission.
