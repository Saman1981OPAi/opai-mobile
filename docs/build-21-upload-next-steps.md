# Build 21 Upload Next Steps

Date: July 10, 2026

Build 21 generated successfully. Upload is still a manual or separately authorized step.

## Option A: EAS Submit

Only run after explicit human authorization:

```bash
pnpm exec eas submit --platform ios --profile production
```

Do not use automatic submission unless explicitly approved.

## Option B: Manual Upload

1. Download the Build 21 IPA artifact from EAS.
2. Upload using Apple Transporter or the App Store Connect workflow.
3. Wait for processing to complete.
4. Select Build 21 in TestFlight.
5. Add or confirm internal testers if needed.
6. Install Build 21 on a real iPhone through TestFlight.
7. Complete the real-device certification checklist.
8. Mark Build 21 as `CERTIFIED` or `FAILED`.

## Build 21 Artifact

- IPA: `https://expo.dev/artifacts/eas/2c4AVaUGgBqouaPj5yMG3ynGDjghSoev-Qumt8mV7qo.ipa`

## Public Submission Status

Public submission remains NO-GO until TestFlight processing, install, and certification are complete.

