# Build 26 API DNS Cutover Plan

Status: **DNS NOT CHANGED**

Target public API name: `api.opaiapp.com`

The exact Azure target is intentionally blank until the production Container App is deployed and
certified.

## Pre-Cutover

- [ ] Production backend certification passed at the temporary Azure hostname
- [ ] Approved target FQDN recorded: `________________`
- [ ] TLS custom-domain validation prerequisites documented
- [ ] Existing DNS record and TTL recorded
- [ ] Rollback target recorded
- [ ] Named human approved the cutover window
- [ ] Mobile production configuration still points to `https://api.opaiapp.com`

## Planned Change

1. Lower TTL only during an approved maintenance window if operationally necessary.
2. Add or update the provider-required verification record.
3. Point `api.opaiapp.com` to the certified Azure Container App target using the record type Azure
   requires for the final custom-domain configuration.
4. Complete managed-certificate validation.
5. Verify DNS from independent resolvers.
6. Verify HTTPS certificate name and chain.
7. Run `/health`, `/ready`, authentication, and synthetic functional smoke tests through
   `https://api.opaiapp.com`.
8. Monitor errors and latency during the approved observation window.

## Rollback

Restore the recorded prior DNS target, confirm propagation, and rerun the prior endpoint health
checks. Do not alter application code or database state as part of DNS rollback.

No record type, target, or TTL should be guessed. Populate those values from the deployed and
certified Azure resource immediately before human approval.
