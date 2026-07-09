# Final URL Verification

Verified with direct HTTPS requests on July 9, 2026. These checks are documentation-only; the app
does not perform runtime URL or network checks.

| Purpose | URL | Result | Submission action |
| --- | --- | --- | --- |
| Website | https://opaiapp.com | HTTP 200 | Ready |
| Contact/support | https://opaiapp.com/contact | HTTP 200 | Ready as Support URL |
| Privacy Policy (live canonical) | https://opaiapp.com/privacy-policy | HTTP 200 | Ready |
| Terms of Use (live canonical) | https://opaiapp.com/terms-of-service | HTTP 200 | Ready |
| Requested privacy alias | https://opaiapp.com/privacy | HTTP 404 | Add redirect before using |
| Requested terms alias | https://opaiapp.com/terms | HTTP 404 | Add redirect before using |
| Optional support alias | https://opaiapp.com/support | HTTP 404 | Pending; use `/contact` |

## App Store Connect Values

- Support URL: https://opaiapp.com/contact
- Privacy Policy URL: https://opaiapp.com/privacy-policy
- Marketing URL: https://opaiapp.com
- Terms link for reviewer notes: https://opaiapp.com/terms-of-service

The shorter aliases requested in the roadmap must not be entered in App Store Connect until they
return a public success response. Re-run this check immediately before submission.

