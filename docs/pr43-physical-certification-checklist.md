# PR #43 Physical Certification Checklist

Use synthetic accounts and synthetic information only. Do not record passwords, tokens, device identifiers, private artifact links, transcripts, or operational information.

Backend testing used the temporary Render staging environment and does not constitute production connectivity certification.

## Devices

- [ ] Register a physical iPhone with the EAS Apple team. Current registered count: 0.
- [ ] Register a physical iPad with the EAS Apple team. Current registered count: 0.
- [ ] Physical iPhone installed from the private internal distribution.
- [ ] Physical iPad installed from the private internal distribution.
- [ ] Physical Android device installed from the private APK distribution.
- [ ] Device models and OS versions recorded without UDIDs.

## Authentication And Networking

- [ ] Registration or synthetic staging login succeeds.
- [ ] Token refresh succeeds.
- [ ] Local-first sign-out completes within three seconds.
- [ ] Session expiry and second login recover safely.
- [ ] Offline state is clear and retry succeeds after reconnecting.
- [ ] The small `Internal Certification` indicator is visible.

## Assistant And Audio

- [ ] Assistant request succeeds.
- [ ] Stop cancels the visible request lifecycle.
- [ ] Retry succeeds without duplicate content.
- [ ] Audio recording Pause and Resume work.
- [ ] Synthetic Audio Statement transcription succeeds.
- [ ] Failed transcription preserves recoverable local audio.
- [ ] Temporary upload copies are removed after success and failure.

## Protected Local Data

- [ ] Protected-storage migration succeeds and retains rollback data.
- [ ] Cross-user isolation is preserved.
- [ ] Tampered content fails safely.
- [ ] Notebook autosave survives background and force-close.
- [ ] Logout during autosave does not leak data into the next account.
- [ ] Encrypted attachments reopen and delete correctly.
- [ ] Orphan and temporary-copy cleanup succeeds.
- [ ] Exported image verification confirms EXIF removal.

## Daily Policing Tools

- [ ] Timeline ordering, approximate times, unknown times, and midnight rollover work.
- [ ] Person and Vehicle Description Builders preserve uncertainty.
- [ ] NATO phonetic conversion works offline.
- [ ] Calculator and unit conversions produce expected results.
- [ ] Demonstration checklists show version and expiration metadata.
- [ ] Calendar remains available inside Tools.

## Accessibility And Recovery

- [ ] iPhone Dynamic Type and VoiceOver pass.
- [ ] iPad portrait, landscape, Dynamic Type, VoiceOver, and external keyboard pass.
- [ ] Android font scaling and TalkBack pass.
- [ ] Long labels remain contained.
- [ ] Background restore and force-close recovery pass.

## Defects And Decision

- Defects found: Pending
- Remaining tests: Apple device registration, internal builds, and all physical checks above
- Internal build creation: BLOCKED
- PR #43 merge: NO-GO
- Build 27 production generation: NO-GO
- Public submission: NO-GO
