# Final Public Submission URL Verification

Direct public HTTPS requests were completed on July 9, 2026 after website PR #21 deployed.
Verification is documentation-only; the mobile app does not make runtime URL checks.

| Purpose | Preferred URL | HTTP status | Canonical page | Status |
| --- | --- | --- | --- | --- |
| Website / Marketing | https://opaiapp.com | 200 | Same | Ready |
| Privacy Policy | https://opaiapp.com/privacy | 200 | https://opaiapp.com/privacy-policy | Ready |
| Terms | https://opaiapp.com/terms | 200 | https://opaiapp.com/terms-of-service | Ready |
| Support | https://opaiapp.com/support | 200 | https://opaiapp.com/contact | Ready |

The canonical pages also returned HTTP 200:

- https://opaiapp.com/privacy-policy
- https://opaiapp.com/terms-of-service
- https://opaiapp.com/contact

The short paths are static aliases because the public website uses Next.js static export. Re-run
all checks immediately before App Store submission and confirm the page content is final and
appropriate for the submitted binary.
