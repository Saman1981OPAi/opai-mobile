# Build 26 Azure Cost Approval

Status: **PENDING HUMAN CALCULATOR REVIEW**

This document prepares the minimum production architecture for pricing. It does not authorize
resource creation and does not contain an estimated total.

## Calculator Header

Enter the following in the official Azure Pricing Calculator. Use the owner's actual subscription
pricing when it is available.

| Field | Required value |
| --- | --- |
| Currency | CAD |
| Region | Canada Central |
| Subscription pricing | Owner's actual Azure subscription pricing |
| Estimate date | `________________` |
| Saved estimate or screenshot | `________________` |
| Negotiated pricing applied | `None / Describe: ________________` |

Do not invent or estimate the final total outside the official calculator.

## 1. Azure Container Apps

| Calculator field | Required input or human result |
| --- | --- |
| Plan | Consumption |
| Application resources | 0.5 vCPU and 1 GiB memory |
| Minimum replicas | 0 |
| Maximum replicas | 2 |
| Ingress | Public HTTPS |
| GPU | None |
| Dedicated workload profile | None |
| Expected monthly requests | `________________` |
| Average active request duration | `________________ seconds` |
| Active vCPU seconds | `________________` |
| Active memory GiB-seconds | `________________` |
| Calculator free grant | `________________` |
| Estimated monthly usage | `________________` |
| Estimated monthly CAD amount | `CAD ________________` |

Use a low initial request-volume assumption. Do not configure an always-running minimum replica.

## 2. PostgreSQL Flexible Server

| Calculator field | Required input or human result |
| --- | --- |
| Region | Canada Central |
| Compute tier | Burstable B1ms |
| Storage | 32 GB |
| High availability | Disabled |
| Backup retention | 7 days |
| Geo-redundant backup | Disabled unless separately approved |
| Monthly compute price | `CAD ________________` |
| Monthly storage price | `CAD ________________` |
| Monthly backup price | `CAD ________________` |
| Estimated monthly CAD amount | `CAD ________________` |

## 3. Key Vault

| Calculator field | Required input or human result |
| --- | --- |
| Tier | Standard |
| Network | Public endpoint |
| Authorization | Managed identity, Azure RBAC, least privilege |
| Private endpoint | None initially |
| Expected monthly secret operations | `________________` |
| Estimated monthly CAD amount | `CAD ________________` |

## 4. Log Analytics and Monitor

Use minimal privacy-filtered operational logging with short initial retention. Do not log prompts,
responses, transcripts, uploaded content, or other sensitive user content.

| Calculator field | Required input or human result |
| --- | --- |
| Expected monthly ingestion | `________________ GB` |
| Retention | `________________ days` |
| Estimated monthly CAD amount | `CAD ________________` |

## 5. Container Registry

Include Azure Container Registry only if the reviewed deployment architecture still requires it.
Use Basic tier only. Record whether GHCR can be consumed securely by Azure Container Apps without
adding ACR; do not change the architecture without security and deployment review.

| Field | Human result |
| --- | --- |
| ACR required | `Yes / No` |
| Secure GHCR use approved | `Yes / No / Not evaluated` |
| Estimated monthly CAD amount | `CAD ________________ / Not applicable` |

## 6. Bandwidth

Use a human-approved low initial Canadian outbound-traffic assumption. Unexpected egress is not
guaranteed by this estimate.

| Field | Human result |
| --- | --- |
| Expected monthly outbound traffic | `________________ GB` |
| Estimated monthly CAD amount | `CAD ________________` |

Do not add background weather traffic or Azure weather services. The iOS app uses native Apple
WeatherKit.

## Exclusions

The verified total excludes:

- OpenAI API usage
- Apple commissions
- taxes
- unexpected bandwidth
- future high availability
- private endpoints
- additional monitoring volume
- future Android infrastructure

## Verified Calculator Result

- Verified monthly total before OpenAI and taxes: `CAD ________________`
- Currency confirmed as CAD: `Yes / No`
- Region confirmed as Canada Central: `Yes / No`
- Reviewer name and date: `________________`
- Owner approval name and date: `________________`

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
