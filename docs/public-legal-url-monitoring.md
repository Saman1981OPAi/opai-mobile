# Public Legal URL Monitoring

Monitor the App Store URLs and canonical pages without adding runtime checks to the mobile app.

## URLs

- Privacy: https://opaiapp.com/privacy
- Terms: https://opaiapp.com/terms
- Support: https://opaiapp.com/support
- Privacy canonical: https://opaiapp.com/privacy-policy
- Terms canonical: https://opaiapp.com/terms-of-service
- Contact canonical: https://opaiapp.com/contact

## Cadence

- Check all six URLs immediately before selecting a build for submission.
- Check again immediately after submission.
- Check daily while App Store processing or Apple review is active.
- Check after any website deployment, DNS, certificate, redirect, or canonical metadata change.
- Check before responding to a URL-related Apple message and before release.

## Evidence

Record timestamp, requested URL, HTTP status, final URL, page title, operator, and result. Store no
cookies, credentials, IP addresses, or visitor data. A successful check requires HTTP 200 and the
expected Privacy, Terms, or Contact content.

## Failure Response

1. Mark public submission NO-GO or pause release when an entered App Store URL fails.
2. Confirm whether the canonical page is available; do not silently change App Store fields.
3. Assign website remediation and record the incident in the review issue log.
4. Re-run all six checks after deployment.
5. Update App Store Connect only after the replacement URL is publicly verified and approved.
