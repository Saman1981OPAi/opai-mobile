# Build 26 Azure Pricing Calculator Gate

Region: Canada Central. Currency: CAD. OpenAI usage, taxes, and unexpected egress are excluded.

## Approved Option A input

| Service | Calculator configuration |
| --- | --- |
| Container Apps | Consumption; 0.5 vCPU; 1 GiB; minimum 0; maximum 2; low initial requests |
| PostgreSQL | Flexible Server; Burstable B1ms; 32 GB; no HA; seven-day backup retention |
| Key Vault | Standard; low secret-operation volume |
| Log Analytics | Minimal privacy-filtered ingestion and short operational retention |
| Container Registry | Basic only if the deployment path still requires ACR |
| Bandwidth | Low initial Canadian egress estimate |
| Weather | CAD 0 Azure weather cost; native Apple WeatherKit on iPhone |

## Planning range

The backend architecture review estimates CAD 35-60 per month before OpenAI and taxes. This is a
planning range, not an approved calculator quote.

## Hard gate

- Obtain and save a human-reviewed Azure Pricing Calculator estimate before provisioning.
- Expected maximum must be CAD 75/month or less before OpenAI and taxes.
- Configure spending alerts at CAD 40, CAD 60, and CAD 75 after provisioning is approved.
- Do not add high availability, a running minimum replica, premium registry, longer initial backup
  retention, or Option B resources.
- If the calculator exceeds CAD 75, stop and present a separately reviewed lower-cost Canadian host.

No paid Azure resource has been created and no DNS record has been changed.
