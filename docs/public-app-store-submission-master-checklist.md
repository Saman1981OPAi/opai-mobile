# Public App Store Submission Master Checklist

## Build and Identity

- [x] Sprint 022 is merged and current Sprint 023 branch starts from updated `main`.
- [x] Native version `0.1.0`, beta label `0.1.0-beta`, target build `21`, display name `OPAi Police`,
  and bundle identifier `com.opaiapp.police` are documented.
- [x] Icon is 1024 x 1024 and splash asset is configured.
- [x] Source typecheck, iOS export, Android compatibility export, and local Metro smoke test pass.
- [x] No unnecessary sensitive permission is declared in `app.json`.
- [ ] Generate build `21` from the reviewed commit.
- [ ] Upload and process build `21` in App Store Connect.
- [ ] Confirm startup and crash-free operation on physical iPhone and iPad.
- [ ] Confirm final icon, splash, and asset provenance with the release owner.

## Functionality

- [x] Mock auth, consent, local persistence, local notifications, core modules, Reset Demo Data, and
  Clear Local Data remain implemented.
- [x] Testing / Pre-Launch / local prototype disclosures remain visible where appropriate.
- [ ] Complete real-device TestFlight walkthrough for build `21`.

## Public Fields and Compliance

- [x] Privacy URL: https://opaiapp.com/privacy
- [x] Terms URL: https://opaiapp.com/terms
- [x] Support URL: https://opaiapp.com/support
- [x] Marketing URL: https://opaiapp.com
- [x] Copy-ready metadata, release notes, App Review notes, privacy guidance, age guidance, content
  rights notes, export notes, screenshot checklist, QA checklist, risk register, and go/no-go are prepared.
- [ ] Confirm support, privacy, security, and legal mailboxes receive external email.
- [ ] Enter and approve final App Privacy, age rating, content rights, and export answers.
- [ ] Confirm no official marks, protected service insignia, or unlicensed imagery in final binary.

## Privacy and Security

- [x] No backend, OpenAI, production database, cloud sync, real file upload, payments,
  subscriptions, tracking, advertising, analytics, police-service integration, or production secret.
- [x] No Apple credential or production token is committed.
- [x] Real police records, evidence, statements, documents, and sensitive data are discouraged.
- [ ] Inspect the generated binary and dependency report before submission.

## Assets and Screenshots

- [ ] Certify exact dimensions against current App Store Connect slots.
- [ ] Confirm screenshots match build `21` and contain demo data only.
- [ ] Confirm screenshots do not overpromise AI, legal, medical, translation, or police capability.
- [ ] Confirm the first three iPhone and iPad screenshots present the strongest working flows.

## Platform Priority

- [x] iOS is the active launch platform.
- [x] Android compatibility remains intact.
- [x] Android production and Google Play work remain paused pending the D-U-N-S Number for Ebrahimi Holdings.
