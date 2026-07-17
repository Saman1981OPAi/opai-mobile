# Build 26 App Review Account Checklist

Store credentials only in the approved password manager and App Store Connect. Never place them in source, tests, documentation, screenshots, CI variables intended for builds, or logs.

- [ ] Account exists in the production database.
- [ ] Email is normalized and active.
- [ ] Password works from a clean installation.
- [ ] No MFA, pending verification, forced reset, expiration, or lockout.
- [ ] Account is excluded from cleanup jobs.
- [ ] Account has no unnecessary administrator privileges.
- [ ] JWT access token is issued.
- [ ] Refresh token rotates and restores the session after relaunch.
- [ ] Production `/health` and `/ready` return HTTP 200.
- [ ] Every visible review feature opens for the account.
- [ ] Only fictional/synthetic content is present.
- [ ] iPhone and iPad login certification is recorded within 24 hours of submission.
