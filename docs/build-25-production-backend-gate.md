# Build 25 Production Backend Gate

**BUILD 25 USES STAGING BACKEND**

Build 25 was generated with the `testflight` EAS profile, which sets:

`EXPO_PUBLIC_OPAI_API_BASE_URL=https://opai-backend-staging.onrender.com`

The repository's separate `production` profile points to `https://api.opaiapp.com`, but that profile was not used for Build 25.

## Decision

- App Review may continue.
- Physical iPhone certification passed based on tester-confirmed results.
- Public production release remains on hold.
- Staging availability does not establish production readiness.
- Build 26 is required for public release because the production API URL is compiled into the mobile configuration.

## Production release requirements

1. Deploy the production backend intentionally.
2. Configure production secrets outside Git and confirm key rotation and access controls.
3. Validate health, readiness, authentication, AI, translation, quotas, timeouts and privacy-preserving logs in production.
4. Confirm production monitoring, alerts, rollback and emergency AI kill-switch operation.
5. Reconcile App Privacy answers and legal disclosures with the deployed data flow.
6. Generate and certify Build 26 with the production API URL after every production gate passes.

See `docs/build-26-production-backend-plan.md`, `docs/build-26-production-secrets-checklist.md`, and `docs/build-26-production-deployment-gate.md`.

No production credential or secret is stored in this document.
