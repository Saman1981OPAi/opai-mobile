# Build 26 Production Deployment Runbook

Status: **PREPARED, NOT EXECUTED**

Target architecture: Azure Container Apps and PostgreSQL Flexible Server in Canada Central, with
Key Vault Standard, managed identity, Azure RBAC, and `https://api.opaiapp.com`.

## Required Approvals

- [x] Mobile PR #41 merged
- [x] Mobile main validation passed
- [ ] Backend main confirmed clean at the approved production SHA
- [ ] Production documentation reviewed and merged
- [ ] Azure calculator total approved under `docs/build-26-azure-cost-approval.md`
- [ ] Verified Azure total is CAD 75 or less before OpenAI usage and taxes
- [ ] Owner explicitly approved production deployment
- [ ] Cost-alert recipient confirmed
- [ ] Azure subscription and quota confirmed
- [ ] Production resource names confirmed
- [ ] Canada Central service availability confirmed
- [ ] Key Vault public-endpoint and Azure RBAC residual risk accepted
- [ ] Database backup and rollback process approved
- [ ] DNS record change separately approved
- [ ] Production reviewer-account procedure approved
- [ ] Backend production PR reviewed and merged
- [ ] Named human authorizes paid resource creation
- [ ] Production secret owners are available
- [ ] Maintenance and rollback windows are approved

Documentation completion alone does not authorize deployment.

## Pre-Deployment Evidence

Record without secret values:

- Backend main SHA: `________________`
- Container image digest: `________________`
- Database migration revision: `________________`
- Azure subscription and tenant confirmed by authorized operator: `Yes / No`
- Production region: `Canada Central`
- Rollback image digest: `________________`
- Database restore point or backup reference: `________________`

## Planned Sequence

1. Reconfirm the approved calculator inputs and spending alerts.
2. Provision only the approved minimum resources.
3. Configure the Container App with min replicas 0 and max replicas 2.
4. Grant the Container App managed identity the minimum Key Vault permissions through Azure RBAC.
5. Store production secrets in Key Vault or an approved Azure secret reference. Never copy them
   into Git, images, logs, or documentation.
6. Configure PostgreSQL TLS, private credentials, 32 GB storage, no HA, and seven-day backup
   retention.
7. Run mandatory schema migration as a controlled one-off job.
8. Require the migration job to succeed before application readiness can pass.
9. Deploy the reviewed image by immutable digest.
10. Verify the temporary Azure hostname before any DNS change.
11. Execute the certification plan.
12. Request separate DNS cutover approval.

## Rollback

1. Stop new traffic or restore the prior DNS target according to the approved cutover plan.
2. Redeploy the recorded prior image digest.
3. Do not run destructive down migrations.
4. Restore the database only when data integrity review requires it and a named human approves.
5. Re-run `/health`, `/ready`, authentication, and one synthetic request per visible API flow.
6. Record the incident, timestamps, operator, and final state without user content or secrets.

## Stop Conditions

Stop on migration failure, readiness failure, credential exposure, unexpected PII logging,
unbounded rate limits, cost above the approved ceiling, or any unreviewed infrastructure change.

Until every required approval is recorded:

**PRODUCTION DEPLOYMENT: NO-GO**
