# AI Safety Layer

Sprint 012 introduces reusable local safety copy and prompt guardrail placeholders for the AI Assistant prototype.

## Current Local Guardrails

- Prompt classification is local and heuristic only.
- Unsupported prompts return a safe mock message.
- Criminal Code, legal reference, and policy categories are clearly marked as placeholders.
- Wellness/PTSD support is limited to non-clinical awareness messaging.
- AI history screens include privacy warnings.

## Required User-Facing Disclaimers

- OPAi Police is a productivity and AI assistance tool.
- AI-generated responses may be incomplete, inaccurate, or inappropriate for a specific situation and must be verified by the user.
- OPAi Police does not replace official police systems, service policy, supervision, training, legal advice, court requirements, or professional judgment.
- PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, crisis intervention, or emergency support.

## Future Safety Controls

- Backend-side prompt validation.
- Model moderation and response review rules.
- Category-specific assistant policies.
- Sensitive data minimization.
- Audit logging and user-access controls.
- Configurable retention and deletion controls.
- Human verification requirements before operational use.

No production safety claims are made by the current mock AI workflow.
