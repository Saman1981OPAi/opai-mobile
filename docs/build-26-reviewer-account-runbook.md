# Build 26 Apple Reviewer Account Runbook

Status: **ACCOUNT NOT CREATED**

Create the account only after the production backend passes certification. Store credentials only
in the approved password manager and App Store Connect review notes.

## Account Requirements

- Dedicated, durable production account with no administrator privileges.
- No MFA, pending verification, forced reset, expiration, or lockout during the review window.
- Synthetic profile and content only.
- Excluded from automated cleanup for the duration of Apple review.
- Revocable immediately after review if policy requires it.

## Creation and Certification

1. Create the account through the production authentication flow.
2. Confirm the normalized email and active status in the production system without exposing the
   password.
3. Confirm access and refresh tokens work and rotate correctly.
4. Install the release candidate cleanly on a supported iPhone and iPad.
5. Sign in with the reviewer account on both devices.
6. Relaunch each device and confirm session restoration.
7. Open every visible release feature with synthetic data.
8. Sign out and sign in again.
9. Record device, iOS/iPadOS, date, tester initials, and pass/fail results.
10. Place credentials only in the secure App Store Connect review field at submission time.

## Failure Gate

Any login, refresh, clean-install, account-lockout, or visible-feature failure blocks Build 26
submission. Never place the credential in Git, screenshots, CI variables, chat, or documentation.
