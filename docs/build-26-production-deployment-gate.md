# Build 26 Production Deployment Gate

**BUILD 26 GENERATION: BLOCKED**

Every item below must pass before Build 26 is generated.

## Infrastructure

- [ ] Approved production Render service or production host is live.
- [ ] Hosting region and Canadian privacy/data-residency posture are approved.
- [ ] Paid hosting plan and monthly spend are approved before purchase.
- [ ] Dedicated production PostgreSQL database is live and protected.
- [ ] Production backups, retention and restore testing are configured.
- [ ] Production domain and TLS are active.
- [ ] `BACKEND_PRODUCTION_DEPLOY_WEBHOOK` is configured in the protected GitHub environment.
- [ ] Production deployment is triggered only by explicit manual dispatch.

## Deployment and API

- [ ] Production database migrations pass.
- [ ] `/health` returns HTTP 200.
- [ ] `/ready` returns HTTP 200 with dependencies ready.
- [ ] Authenticated endpoint certification passes.
- [ ] OPAi Assistant passes with synthetic data.
- [ ] Report Writing passes and does not invent facts.
- [ ] Text, voice, image and document Translation pass.
- [ ] Device Testing remains source-grounded and non-prescriptive.
- [ ] Rate limits, daily quotas, concurrency and provider timeouts pass.
- [ ] Security headers, CORS, HTTPS enforcement and sanitized errors pass.
- [ ] Privacy-preserving logging and monitoring review passes.
- [ ] No secrets are exposed.

## Mobile and compliance

- [ ] Mobile production configuration uses the approved production API URL.
- [ ] Privacy Policy, App Privacy answers and App Review notes match production behavior.
- [ ] Typecheck, iOS export and compatibility checks pass.
- [ ] Build 26 review PR is merged by a human.

Only then may Build 26 be generated, uploaded to TestFlight and physically certified. Build 25 and the current Apple submission must remain unchanged unless a critical defect requires a separate human decision.
