# Build 26 Production Backend Plan

Build 26 is the public-release candidate after the production backend is deployed and certified. Do not generate or upload Build 26 before the deployment gate passes.

## Deployment sequence

1. Provision an approved production Render service or equivalent production host.
2. Provision a dedicated production PostgreSQL database with encrypted storage, backups, restricted access and an approved Canadian privacy posture.
3. Configure production secrets in the host secret manager and the protected GitHub `production` environment.
4. Configure `BACKEND_PRODUCTION_DEPLOY_WEBHOOK` in the protected GitHub environment.
5. Run backend CI, lint, tests, migration rendering and container build verification.
6. Perform an explicit manual `workflow_dispatch` with `environment=production`.
7. Apply production database migrations and verify rollback readiness.
8. Verify production `/health` and `/ready` over HTTPS.
9. Certify authentication, Assistant, Report Writing, every Translation mode and Device Testing grounding with synthetic data.
10. Certify per-user limits, daily quotas, concurrency controls, timeouts and the emergency AI kill switch.
11. Review privacy-preserving logs, monitoring, alerts, retention, incident response and key rotation.
12. Point the mobile production profile to the approved production API URL.
13. Update privacy and App Store documentation to match the production data flow.
14. Generate Build 26 only after every gate is signed off.

## Current blockers

- Production service is not yet certified.
- Production database and migrations are not yet certified.
- `BACKEND_PRODUCTION_DEPLOY_WEBHOOK` is not yet confirmed.
- Production secrets and monitoring are not yet certified.
- Production endpoint and quota certification are incomplete.
- Build 26 has not been generated or uploaded.

Build 25 remains unchanged and continues to use `https://opai-backend-staging.onrender.com`.
