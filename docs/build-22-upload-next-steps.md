# Build 22 Upload Status and Next Steps

Build 22 exists as a generated EAS iOS production artifact and has been uploaded to App Store Connect.

## Build To Upload

- EAS Build ID: `6c9bceae-7b11-453b-98d6-e5f06a1a8b28`
- Build number: `22`
- Bundle identifier: `com.opaiapp.police`
- IPA: https://expo.dev/artifacts/eas/z0FF9ywwcu0Wjnk9wHGdUSYaaR4b4G5kK5DuAYuJEMk.ipa

## Upload Command

EAS Submit was run against the exact build ID:

```bash
pnpm exec eas submit --platform ios --id 6c9bceae-7b11-453b-98d6-e5f06a1a8b28
```

Do not use `--latest` when the exact build ID is available.

## Upload Result

- Submission ID: `0bebc73a-ea44-486f-b0b8-06ffead7dca8`
- Submission URL: https://expo.dev/accounts/ebrahimi-holdings/projects/opai-police/submissions/0bebc73a-ea44-486f-b0b8-06ffead7dca8
- ASC App ID: `6788187875`
- Upload status: successful
- Apple processing: pending confirmation
- TestFlight visibility: pending Apple processing

## Upload Rules

- Do not generate another Build 22.
- Do not submit Android.
- Do not start Google Play work.
- Do not use `--auto-submit`.
- Do not publish the app publicly.
- Do not submit the app for final public App Review.
- Do not commit Apple credentials, EAS tokens, App Store Connect keys, certificates, provisioning profiles, or secrets.

## After Upload

1. Wait for App Store Connect processing.
2. Confirm Build 22 appears in TestFlight.
3. Complete export compliance if Apple prompts.
4. Assign internal testers.
5. Install through TestFlight on a physical iPhone.
6. Complete the Build 22 physical certification checklist.

Public submission remains `NO-GO` until all post-upload gates pass.
