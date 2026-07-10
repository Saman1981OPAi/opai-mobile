# App Store Connect Manual Actions

These actions cannot be completed by Codex unless authorized with appropriate Apple developer
tooling and credentials. Do not request, share, store, or commit Apple credentials.

## Release Operator Actions

- [ ] Log in to App Store Connect with an authorized role.
- [ ] Select the existing OPAi Police app record; do not create/delete a replacement record.
- [ ] Confirm build `21` is unused and synchronize the EAS remote version baseline.
- [ ] Generate and upload/select the new signed iOS build.
- [ ] Wait for processing and resolve warnings.
- [ ] Fill TestFlight beta information and final App Review notes.
- [ ] Complete export compliance, content rights, age rating, and App Privacy.
- [ ] Confirm live Privacy Policy, Support, and Marketing URLs.
- [ ] Upload/confirm approved iPhone and iPad screenshots where required.
- [ ] Create/select `OPAi Internal Testers`, add authorized testers, and assign build `21`.
- [ ] Submit for internal testing or Beta App Review if App Store Connect requires it.
- [ ] Install through TestFlight and run the real-device smoke test.
- [ ] Monitor processing, crashes, invitations, and feedback.

EAS authentication is present in the local developer environment, but source control contains no
Apple credential. Interactive Apple authorization and account decisions remain with the release
operator.
