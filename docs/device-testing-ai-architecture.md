# Device Testing AI Architecture

## Build 22

Build 22 does not use live AI. The Device Testing Assistant is an automatic local response system.

The mobile app:

1. Receives the selected category, manufacturer, model, jurisdiction, and configuration.
2. Looks up the exact bundled guide.
3. Displays the guide immediately.
4. Shows source metadata and limitations.
5. Refuses unsupported devices.

## Guardrails

- Never invent a procedure.
- Never invent a tolerance.
- Never apply another model's procedure.
- Never certify equipment.
- Never create an official record.
- Never advise using equipment after a failed test.
- Never recommend a use-of-force option.

## Future Live AI

Future live AI must use a secure backend:

Mobile app -> OPAi Backend -> Approved Guide Retrieval -> OpenAI Responses API -> Structured source-grounded response -> Mobile interface.

The mobile app must never contain an OpenAI API key.

Future requests may include guide ID, selected step, selected model, and approved source references. They should not send officer names, badge numbers, police records, evidence, investigation information, confidential information, precise location, or serial numbers by default.
