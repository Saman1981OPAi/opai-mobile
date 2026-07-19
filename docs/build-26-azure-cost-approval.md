# Build 26 Azure Cost Approval

Status: **PENDING HUMAN CALCULATOR REVIEW**

This document prepares the minimum production architecture for pricing. It does not authorize
resource creation and does not contain an estimated total.

## Pricing Calculator Inputs

Use the Azure Pricing Calculator in CAD and select Canada Central wherever the calculator offers a
regional choice.

| Service | Required input |
| --- | --- |
| Azure Container Apps | Consumption plan; 0.5 vCPU; 1 GiB memory; minimum replicas 0; maximum replicas 2; public HTTPS ingress |
| PostgreSQL Flexible Server | Burstable B1ms; 32 GB storage; no high availability; seven-day backup retention |
| Key Vault | Standard tier; managed identity access; Azure RBAC |
| Log Analytics | Minimum practical privacy-filtered ingestion and short operational retention |
| Container Registry | Include only if the approved deployment cannot use an existing compliant registry |
| Bandwidth | Enter the human-approved low-volume Canadian egress assumption; record the assumption below |

Do not add background weather traffic or Azure weather services. The iOS app uses native Apple
WeatherKit.

## Human Inputs Required

- Expected monthly Container Apps requests: `________________`
- Expected average request duration: `________________`
- Expected monthly PostgreSQL compute hours shown by the calculator: `________________`
- Expected monthly Log Analytics ingestion: `________________`
- Expected monthly outbound bandwidth: `________________`
- Container Registry required: `Yes / No`
- Calculator share link or exported estimate location: `________________`
- Calculator total before OpenAI and taxes: `CAD ________________`
- Reviewer name and date: `________________`

## Approval Rules

- Hard planning ceiling: **CAD 75/month before OpenAI usage and taxes**.
- Taxes and OpenAI API usage must be shown as excluded.
- Configure cost alerts at CAD 40, CAD 60, and CAD 75 only after provisioning is approved.
- Reject high availability, a continuously running minimum replica, premium registry, and longer
  initial backup retention unless separately reviewed.
- If the verified calculator total exceeds CAD 75, stop and present a separately reviewed,
  lower-cost Canadian hosting option.

## Decision

- [ ] Calculator inputs independently reviewed
- [ ] Total is CAD 75 or less before OpenAI and taxes
- [ ] A named human approved paid provisioning

Until all boxes are checked: **AZURE PROVISIONING: NO-GO**
