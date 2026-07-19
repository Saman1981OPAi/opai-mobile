# Build 26 Production Certification Plan

Status: **NOT STARTED**

Use synthetic data only. Do not place real police, evidence, health, or personal information in the
certification environment.

## Infrastructure

- [ ] TLS is valid for the temporary Azure hostname
- [ ] `/health` returns HTTP 200 without requiring database or OpenAI access
- [ ] `/ready` returns HTTP 200 only after database schema and required dependencies are ready
- [ ] Minimum replicas 0 and maximum replicas 2 are confirmed
- [ ] PostgreSQL configuration matches the approved cost package
- [ ] Key Vault access uses managed identity and least-privilege Azure RBAC

## Security and Privacy

- [ ] No secrets are present in source, image layers, responses, or logs
- [ ] Prompts, translations, audio, images, documents, and sensitive payloads are not logged
- [ ] Authentication and authorization reject missing, expired, and invalid tokens
- [ ] Login and recovery endpoints have verified rate limits
- [ ] AI kill switch, daily caps, request limits, timeouts, and concurrency limits work
- [ ] Upload size, MIME type, and duration limits reject oversized or unsupported content safely
- [ ] Error responses contain no stack traces, credentials, database details, or user content

## Functional Smoke Tests

- [ ] Durable reviewer account can sign in
- [ ] OPAi Assistant returns a structured response
- [ ] Report Writing uses only supplied facts and identifies missing information
- [ ] Text Translation returns verification language
- [ ] Voice Translation passes with a short synthetic recording
- [ ] Image Translation passes with a synthetic image
- [ ] Document Translation passes with a synthetic document
- [ ] Device Testing remains hidden in the mobile release
- [ ] Rate-limit and quota responses are understandable and bounded

## Operational Evidence

- [ ] Image digest and migration revision recorded
- [ ] Rollback procedure rehearsed without destructive migration
- [ ] Minimal logs reviewed for excessive PII
- [ ] Cost alerts at CAD 40, CAD 60, and CAD 75 confirmed
- [ ] iPhone and iPad can reach the temporary production endpoint

Production certification remains incomplete until every item is checked and independently reviewed.
