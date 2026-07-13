# Build 25 Production Backend Gate

**BUILD 25 USES STAGING BACKEND**

Build 25 was generated with the `testflight` EAS profile, which sets:

`EXPO_PUBLIC_OPAI_API_BASE_URL=https://opai-backend-staging.onrender.com`

The repository's separate `production` profile points to `https://api.opaiapp.com`, but that profile was not used for Build 25.

## Decision

- App Review may continue.
- TestFlight certification may continue.
- Public production release remains on hold.
- Staging availability does not establish production readiness.

## Production release requirements

1. Deploy the production backend intentionally.
2. Configure production secrets outside Git and confirm key rotation and access controls.
3. Validate health, readiness, authentication, AI, translation, quotas, timeouts and privacy-preserving logs in production.
4. Confirm production monitoring, alerts, rollback and emergency AI kill-switch operation.
5. Reconcile App Privacy answers and legal disclosures with the deployed data flow.
6. Generate and certify a replacement binary if the production API URL must change in the native bundle.

No production credential or secret is stored in this document.
