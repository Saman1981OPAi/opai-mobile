# Support Inbox Workflow

This workflow governs public-submission and Apple-review messages received at
`support@opaiapp.com`. It does not connect the app or repository to an email provider.

## Ownership and Cadence

- Release owner assigns a named support-inbox owner before submission.
- Check the inbox at least daily while a build is processing, submitted, or under review.
- Acknowledge critical review/build messages the same business day and other actionable support
  messages within two business days.

## Intake

1. Record received time, sender category, version/build, subject, severity, and assigned owner.
2. Copy only the minimum sanitized facts into the Apple review issue log or approved tracker.
3. Never copy passwords, authentication codes, Apple credentials, signing material, real police
   records, evidence, statements, or personal/confidential information into Git.
4. Ask the sender to remove sensitive operational data when a report contains it.

## Triage and Escalation

- Critical: launch failure, blocked review, security/privacy exposure, or signing compromise;
  escalate immediately to release owner and engineering.
- High: broken core workflow, App Privacy concern, content-rights/affiliation concern, or legal URL
  failure; assign within one business day.
- Medium/Low: non-blocking UX, copy, or support question; schedule under release-freeze rules.
- Privacy, legal, medical/PTSD, content-rights, or government-affiliation messages require the
  appropriate qualified reviewer before a response is sent.

## Response and Closure

- Use verified facts and the approved Apple/public response templates.
- Record response approval, sent time, response channel, and related evidence.
- Mark resolved only after the sender or authoritative platform state confirms resolution.
- Keep unresolved items in the issue log with an owner and next action.
- Do not configure automatic forwarding to personal accounts or store mailbox credentials here.
