# Privacy and Legal Final Verification

The public URL status was rechecked during the Sprint 019/020 submission preparation window. Re-run
the checks immediately before final submission.

- [x] Website loads: https://opaiapp.com
- [x] Privacy Policy loads: https://opaiapp.com/privacy-policy
- [x] Terms of Use loads: https://opaiapp.com/terms-of-service
- [x] Support/contact loads: https://opaiapp.com/contact
- [ ] Optional aliases `/privacy`, `/terms`, and `/support` need redirects before use.
- [ ] Compare the in-app Privacy screen with the website Privacy Policy direction.
- [ ] Compare the in-app Terms screen with the website Terms direction.
- [ ] Confirm App Privacy answers match the exact uploaded build and diagnostics settings.
- [x] Source audit confirms no backend, OpenAI, real file upload, or hidden cloud functionality.
- [ ] Visually verify AI, professional-use, translation, PTSD, incident, reminder, and prototype
  disclaimers in the TestFlight-installed build.
- [ ] Privacy/legal owner approves the final public copy and App Store declarations.

Use the live canonical legal URLs until the shorter aliases return HTTP success. The app must not
perform runtime network checks for these documentation validations.
