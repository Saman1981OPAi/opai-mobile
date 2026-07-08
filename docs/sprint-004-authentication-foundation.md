# Sprint 004: Authentication Foundation

## Objective

Add the OPAi Police authentication architecture and UI foundation without connecting production authentication, backend services, OpenAI APIs, databases, payments, subscriptions, or police-service integrations.

## Platform Priority

iOS is the active review and launch platform for this sprint. Android support must remain intact for later use, but Android and Google Play submission are paused until the D-U-N-S Number for Ebrahimi Holdings is received.

Sprint 004 should therefore prioritize iOS review, App Store readiness, shared architecture, documentation, and security planning while avoiding Android-specific store release work.

## Scope Completed

- Added a signed-out authentication flow before the Sprint 003 app shell.
- Added local mock authentication states:
  - `signedOut`
  - `signingIn`
  - `signedIn`
  - `onboardingRequired`
  - `biometricPrompt`
  - `passwordResetRequested`
- Added authentication screens:
  - Welcome / Landing
  - Sign In
  - Create Account
  - Forgot Password
  - Verification / Code
  - Biometric Unlock placeholder
  - Terms and Privacy consent
  - Account created / onboarding success
- Added a local placeholder user profile structure:
  - `userId`
  - `firstName`
  - `lastName`
  - `email`
  - `role`
  - `preferredLanguage`
  - `biometricEnabled`
  - `notificationPreferences`
  - `privacyConsentAccepted`
  - `termsAccepted`
- Added a Settings screen mock sign-out action.
- Preserved Sprint 003 navigation after mock sign-in.

## Consent Requirements

Mock users must accept all required consent items before entering the app:

- OPAi Police is a productivity and AI assistance tool.
- OPAi Police is not a replacement for official police systems, supervision, service policy, legal advice, medical advice, or professional judgment.
- AI-generated responses may be incomplete or inaccurate and must be verified.
- PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, or crisis intervention.

## Biometric Placeholder

The biometric screen introduces the future UI and state path for:

- Face ID
- Touch ID / fingerprint
- Device biometrics

This sprint does not implement production biometric authentication. No native secure enclave, keychain, token unlock, or server session binding has been added.

## Future Production Authentication Model

Production authentication should add:

- Secure backend authentication.
- Token and session management with refresh and revocation.
- Password reset with verified email delivery.
- Optional two-factor authentication.
- Biometric unlock bound to secure local device storage.
- Account recovery.
- Role-based access control.
- Audit logging.
- Privacy-by-design consent records.
- No hardcoded secrets.

## Explicit Non-Goals

- No backend calls.
- No network calls.
- No OpenAI API calls.
- No database integration.
- No production secrets.
- No incident cloud sync.
- No police-service integrations.
- No payment or subscription code.
- No real account creation.

## Brand and Compliance Guardrails

- Dark blue/black OPAi interface.
- Police blue accents.
- PTSD awareness accent uses `#7FFFD4`.
- Maple leaf and shield-inspired branding.
- No official police service logos.
- No government badges.
- No RCMP, OPP, TPS, YRP, or other protected insignia.
- App remains clearly marked as testing/pre-launch.

## Local Run

```bash
pnpm install
pnpm start
pnpm typecheck
```

## Known Limitations

- Auth state is local and resets when the app reloads.
- Mock password and verification inputs are not validated.
- Password reset does not send email.
- Consent acceptance is local only.
- Biometric behavior is a placeholder only.

## Next Recommended Sprint

Sprint 005 should deepen local user profile and settings behavior or begin a secure backend-auth design spike before real authentication is connected.
