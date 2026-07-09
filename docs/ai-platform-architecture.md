# AI Platform Architecture

The current mobile app contains only a local mock AI workflow. Future production AI should be routed through a secure backend boundary rather than direct mobile-to-provider calls.

## Future Routing Layer

- Mobile app sends approved requests to the OPAi backend over HTTPS.
- Backend validates user session, consent state, request type, rate limits, and data minimization rules.
- Backend routes requests to category-specific AI behavior such as Incident AI, Report Review AI, Court AI, Calendar AI, Training AI, Translation Support AI, or Wellness Awareness support.
- Backend returns AI output with required disclaimers and verification prompts.

## Data Handling

- Avoid sending unnecessary personal data, real evidence, official records, or confidential details.
- Store AI history only when the user has consented and retention controls are defined.
- Keep audit logs focused on security and compliance metadata rather than full prompt content by default.
- Apply role-based access controls and privacy-by-design principles before production launch.

## Required Controls

- User consent for AI usage and AI history retention.
- Prompt validation and unsupported-request handling.
- Moderation and safety review before model calls.
- Audit logging for sensitive operations.
- Admin controls for approved categories, retention, and access policy.
- Clear legal, policing, medical, and PTSD awareness disclaimers.

Sprint 012 does not implement this production architecture. It creates the mobile-side mock user experience and documents the future boundary.
