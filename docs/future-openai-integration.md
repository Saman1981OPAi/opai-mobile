# Future OpenAI Integration

Future OPAi AI features may use the OpenAI Responses API, but Sprint 012 intentionally does not add the OpenAI SDK, API keys, model calls, or direct provider integration.

## Planned Integration Boundary

- The mobile app should call the OPAi backend, not OpenAI directly.
- The backend should hold provider credentials securely.
- The backend should route requests by AI category.
- The backend should enforce consent, authentication, authorization, rate limits, logging, and retention controls.
- The backend should remove unnecessary personal or operational data before provider calls.

## Future Assistant Categories

- Incident AI
- Report Review AI
- Court AI
- Calendar AI
- Training AI
- Translation Support AI
- Criminal Code / Legal Reference support with verified source controls
- Policy search only after approved source integration
- Wellness/PTSD awareness support with medical safety limits

## Not Allowed Without Future Review

- Direct mobile OpenAI calls.
- Storing OpenAI API keys in the mobile app.
- Automatic legal, medical, policy, or operational conclusions.
- Official report certification.
- Automated RMS submission.
- Unreviewed retention of real prompt content.

Android compatibility should remain intact, but Android production release and Google Play workflows remain paused until the D-U-N-S Number for Ebrahimi Holdings is received.
