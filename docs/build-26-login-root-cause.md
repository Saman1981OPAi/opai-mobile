# Build 26 Login Root-Cause Record

## Confirmed release-architecture failure

Build 25 was compiled with the `testflight` EAS profile, which targeted the Render staging backend. The repository had no durable production reviewer-account provisioning or health-check process, and the supplied App Review credentials were not certified against a persistent production database immediately before submission.

The exact password entered by Apple is unavailable and must not be logged or reconstructed. Therefore, a bad password cannot be independently distinguished from a missing, inactive, or stale staging account after the fact.

## Contributing product issues

- The sign-in UI visibly described a staging/testing environment.
- Inactive biometric and password-reset controls were exposed.
- No automated reviewer-account login/refresh certification existed.
- Production backend availability and persistence were not release gates for Build 25.

## Required fix

Build 26 must use `https://api.opaiapp.com`. A dedicated reviewer account must be created in the production database, stored only in the approved password manager and App Store Connect, and certified from a clean iPad and iPhone installation immediately before submission. The account must remain active, require no MFA or email verification, and have access to every visible review path.
