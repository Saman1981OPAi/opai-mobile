# Build 26: Mental Health Resources

## Scope

- Adds a compact Home card with `Resources` and `Call/Text 9-8-8` actions.
- Adds a directory screen grouped into Immediate Crisis, First Responder Support, Community Support, and Ontario Regional Resources.
- Adds explicit confirmation before any phone, text, or website action.
- Adds a dated official-source register and a mandatory pre-release reverification gate.

## Data Flow

The directory is bundled static content. Selecting a resource opens the device phone, messages, or browser app only after confirmation. OPAi does not send selections to its backend or AI, store call history, write local resource-use history, or emit analytics.

## Permissions

No new permission is requested. Phone, text, and website actions are user initiated and delegated to installed system apps.

## Privacy and Safety

- Directory only; no diagnosis, therapy, counselling, risk assessment, or emergency response.
- No automatic calls or messages.
- No resource-selection tracking or analytics.
- No user data sharing.
- Resource scope and availability use qualified wording from current official provider pages.

## Apple-Rejection Relevance

The Home card and directory are complete, reachable, actionable, and contain working error states. They do not use beta, test, mock, placeholder, or coming-soon wording.

## Tests

- Static-source tests reject unverified resources from the published collection.
- Secure official URL, unique identifier, review-date, and 9-8-8 action coverage checks.
- Full mobile typecheck, lint, unit tests, platform exports, and Metro smoke test are required before review.

## Remaining Blockers

- Human review and merge of the stacked Build 26 mobile PRs.
- Reverify all resource records immediately before a public Build 26 release.
- Production backend certification and the separate final Build 26 release gate.
