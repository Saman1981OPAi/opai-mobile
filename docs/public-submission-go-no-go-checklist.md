# Public Submission Go / No-Go Checklist

## Current Decision: NO-GO

The source and documentation package can be reviewed, but public App Store submission is blocked
until the manual binary and real-device gates are complete.

## Go Criteria

- [x] Sprint 023 reviewed and merged.
- [x] Source typecheck and local Expo exports pass.
- [x] Public marketing, privacy, terms, and support URLs are live.
- [ ] Build `21` generated from the reviewed commit.
- [ ] Build `21` uploaded and processed in App Store Connect.
- [ ] Real-device TestFlight certification completed.
- [ ] Final iPhone and iPad screenshots match build `21` and accepted dimensions.
- [ ] Metadata and App Review notes approved by release owner.
- [ ] App Privacy, age rating, content rights, and export answers completed against build `21`.
- [ ] Asset ownership/license evidence confirmed.
- [ ] No critical bugs or known App Store blocking issue remains.
- [x] No production secret, unsupported permission, or prohibited integration is present in source.
- [ ] Public submission risk register reviewed and accepted.

## Immediate No-Go Conditions

- Crash, blank screen, or broken auth/consent flow
- Missing privacy or support URL
- Invalid screenshot dimensions
- Inaccurate App Privacy answers
- Protected police/government insignia or unauthorized affiliation claim
- Unclear AI, legal, medical, or translation disclaimer
- Accidental backend, OpenAI, database, payment, tracking, upload, or secret integration

Changing this decision requires recorded evidence for every unchecked blocking criterion.
