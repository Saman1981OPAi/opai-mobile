# Apple Public Review Response Playbook

## Response Standard

Respond professionally, briefly, and with evidence from the selected binary. A response must:

1. Thank the reviewer and identify the guideline or issue.
2. State the verified current behavior and exact build.
3. Explain the smallest completed correction, if any.
4. Identify whether metadata or a replacement binary changed.
5. Give concise reviewer steps.
6. Avoid speculation, defensiveness, credentials, or sensitive data.

Do not claim build `21` is generated, uploaded, processed, or tested until each event is recorded.

## Triage Decision

| Issue | Metadata only | Replacement build |
| --- | --- | --- |
| Description, keywords, promotional text, review notes | Usually | Only if in-app behavior also conflicts |
| Privacy, Terms, Support URL | Usually | Only if app behavior or bundled links are broken |
| Screenshot dimension or stale marketing image | Usually | Only if the actual UI is broken |
| App Privacy questionnaire | If declaration was wrong | If binary collects unexpected data |
| Content rights in store artwork | Usually | If questioned asset is bundled in app |
| Affiliation or official-mark concern | If metadata only | If logo, icon, splash, or UI is affected |
| AI, legal, medical, PTSD, or translation claim | If store copy only | If in-app copy/behavior is unsafe |
| Crash, blank screen, broken auth/consent/navigation | No | Yes |
| Missing permission purpose or unexpected permission | No | Yes |
| Build, signing, icon, bundle, or processing failure | No | Yes |

## High-Risk Review Topics

### Guideline 4.2 / Minimum Functionality

Explain the coherent local productivity value: shift readiness, incident drafting, reminders,
calendar/court/training workflows, notes, local notifications, and safety/consent controls. Do not
overstate mock AI or translation. If Apple considers the testing prototype incomplete, hold public
submission and move the app to a more complete release rather than arguing unsupported capability.

### Police or Government Affiliation

Confirm the app is independent and not official police software. Provide asset provenance or
replace any questioned branding. Never claim authorization without written evidence.

### AI, Translation, Legal, or Medical Safety

Confirm current Assistant and translation flows are local mocks. State that output must be verified
and does not replace official systems, supervision, policy, legal or medical advice, emergency
services, or professional judgment. PTSD content is educational only.

### Privacy

Describe actual data movement, not planned features. Current prototype data is stored on-device and
not transmitted by OPAi app code. Reconcile the final binary and included SDK behavior before
answering App Privacy questions.

## Escalation

- Critical launch/build failure: release owner and engineering immediately.
- Privacy, content rights, affiliation, legal, or medical issue: release owner plus qualified
  privacy/legal reviewer before responding.
- Unclear guideline: ask Apple one precise clarification question with the build and screen.
- Appeal: use only after facts and correction history are complete and release-owner approval is
  recorded.
