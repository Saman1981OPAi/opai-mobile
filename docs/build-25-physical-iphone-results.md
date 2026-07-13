# Build 25 Physical iPhone Results

**BUILD 25 PHYSICAL IPHONE CERTIFICATION: PENDING**

Only results explicitly confirmed by the human tester are recorded as passed. Unreported checks remain pending.

## Test environment

| Item | Result |
| --- | --- |
| iPhone model | Pending tester confirmation |
| iOS version | Pending tester confirmation |
| TestFlight version | Pending tester confirmation |
| OPAi version | `0.1.0` |
| Build | `25` |
| Network | Pending tester confirmation |
| Backend | `https://opai-backend-staging.onrender.com` |
| Test date | July 13, 2026 |
| Tester | Human operator; initials not recorded |

No device identifier, authentication token, password, or sensitive test data is recorded.

## Confirmed results

| Area | Status | Evidence |
| --- | --- | --- |
| TestFlight installation | Passed | Confirmed by human tester |
| Sign in | Passed | Confirmed by human tester |
| Apple processing | Passed | Build 25 selected in App Store Connect |
| App Review submission | Waiting for Review | Verified July 13, 2026 |

## Pending physical checks

| Area | Status | Required coverage |
| --- | --- | --- |
| Installation and launch | Pending | Clean install, first launch, splash, background/foreground, relaunch, crash/blank-screen check, safe areas, keyboard, bottom navigation |
| Authentication | Partial | Invalid credentials, sign-out, session restoration, expiry, password reset, account creation and deletion where enabled; no raw errors |
| AI consent | Pending | Text/audio/image/document/OpenAI disclosures, verification and confidential-data warnings, affirmative acceptance, versioned consent storage |
| OPAi Assistant | Pending | Standard and Canadian-context prompts, loading, response, warnings, sources, refusal, unavailable state, quota, clear/delete history |
| Report Writing | Pending | Organization, clarity, chronology, summary, missing facts, draft generation, no fabrication, draft verification notice |
| Text Translation | Pending | English/French/Farsi, RTL, Unicode, long/empty input, copy, swap, clear, detection and verification warning |
| Voice Translation | Pending | Permission allow/deny, record/stop/cancel, language directions, transcript/translation, replay, cleanup and turn-based wording |
| Image Translation | Pending | Camera/library allow/deny, preview, explicit upload, cancel, extraction, translation, unreadable/oversize handling and clear |
| Document Translation | Pending | PDF/TXT, unsupported/oversize files, multi-page and unreadable-page handling, cancel, translate, clear and temporary-file cleanup |
| Device Testing | Pending | LIDAR, RADAR, ASD, breath-instrument gate, Use of Force, source/revision, refusal, no invented procedure, out-of-service direction and offline guide |
| Weather and modules | Pending | Time/date, location allow/deny, manual city, social links, Calendar, Training, Notes & Files, Settings, legal/support and Clear Local Data |
| Network and errors | Pending | Offline/cellular/loss, backend unavailable, expired auth, quota, oversize/unsupported input and timeout; friendly sanitized errors |
| Layout and accessibility | Pending | No clipping/overflow, scrolling, keyboard clearance, RTL, Dynamic Type, labels and practical tap targets |

## Current decision

- Critical defects: not established; the full test matrix is incomplete.
- Build 26 required: not currently established.
- Public release: `HOLD - PRODUCTION BACKEND REQUIRED`.
- Staging statement: `BUILD 25 USES STAGING BACKEND`.

Build 25 must not be described as physically certified until every required device check is completed and recorded.
