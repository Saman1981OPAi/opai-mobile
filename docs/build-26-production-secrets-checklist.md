# Build 26 Production Secrets Checklist

Do not record secret values in Git, documentation, screenshots, logs or the mobile application.

Audit on July 13, 2026: the GitHub `production` environment exists and currently contains no secrets or variables.

| Configuration | Location | Required status |
| --- | --- | --- |
| `BACKEND_PRODUCTION_DEPLOY_WEBHOOK` | Protected GitHub `production` environment | Required before manual deploy |
| `OPENAI_API_KEY` | Production host secret manager | Project-specific key required |
| `SECRET_KEY` | Production host secret manager | Strong production-only value required |
| `DATABASE_URL` | Production host managed database reference | Dedicated production database required |
| `DATA_KEY_VERSION` | Production host secret/configuration | Approved key version required |
| `ALLOWED_ORIGINS` | Production host configuration | Approved OPAi origins only |
| `APP_ENV` | Production host configuration | Must equal `production` |
| `ENFORCE_HTTPS` | Production host configuration | Must equal `true` |
| OpenAI model and quota settings | Production host configuration | Reviewed cost limits required |
| Monitoring/alert credentials | Production host secret manager | Least-privilege configuration required |

## Verification

- [ ] Secret values are absent from Git history and mobile bundles.
- [ ] Environment access is restricted to approved administrators.
- [ ] Key rotation and emergency revocation are documented and tested.
- [ ] Deployment logs redact authorization headers and sensitive content.
- [ ] Production and staging credentials are separate.
- [ ] No secret is exposed through `/health`, `/ready`, errors or API documentation.
