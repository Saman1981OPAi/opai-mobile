# Public Submission Support Checklist

## Before Submission

- [x] Sprint 023 public-submission package is merged.
- [x] Marketing, Privacy, Terms, Support, and canonical URLs return HTTP 200.
- [ ] Build `21` is generated from a recorded reviewed commit.
- [ ] Build `21` is uploaded and processed in App Store Connect.
- [ ] Physical iPhone and iPad TestFlight certification is recorded.
- [ ] Screenshots and App Store questionnaires are certified against build `21`.
- [ ] Asset provenance and support mailbox delivery are confirmed.
- [ ] Release owner changes the go/no-go record to GO.

## While Waiting for Review

- [ ] Record submission ID, version, build, commit, submission time, and owner.
- [ ] Check App Store Connect at least daily without repeatedly editing metadata.
- [ ] Log every Apple message verbatim without credentials or personal information.
- [ ] Assign severity, owner, due date, and metadata-or-binary disposition.
- [ ] Keep the release freeze active.

## Before Responding to Apple

- [ ] Reproduce or verify the cited issue against the selected build.
- [ ] Identify the exact guideline, screen, field, device, and build.
- [ ] Attach only safe evidence containing demo data.
- [ ] Use verified facts; do not claim a fix is live before App Store Connect confirms it.
- [ ] Obtain release-owner approval for the final response.

## After a Response or Correction

- [ ] Record the exact response, attachments, timestamp, and Apple status.
- [ ] Re-check public URLs and edited metadata.
- [ ] If a replacement binary is required, use the approved build-replacement procedure.
- [ ] Re-run affected-flow, typecheck, export, smoke, integration, and secret checks.
- [ ] Preserve every unresolved item in the issue log.
