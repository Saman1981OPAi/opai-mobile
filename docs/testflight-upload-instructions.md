# TestFlight Upload Instructions

Run build and submission only after Sprint 021 is reviewed and merged. Use an approved clean
`main` or iOS release branch.

## 1. Prepare and Validate

```bash
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm typecheck
pnpm exec expo export --platform ios --output-dir .expo-review-ios --clear
pnpm exec eas whoami
pnpm exec eas build:version:get --platform ios --profile production
```

Confirm the authenticated EAS owner is correct and build `21` is unused in App Store Connect. If
the remote value is still `8`, run the interactive command below and set the baseline to `20` so
production auto-increment creates build `21`:

```bash
pnpm exec eas build:version:set --platform ios --profile production
```

## 2. Generate the Signed iOS Build

```bash
pnpm build:ios
```

The production profile uses EAS remote versioning and auto-increment. Review the build page, signing
identity, version, native build number, bundle identifier, permissions, and build result. Do not
continue if the binary is not `0.1.0 (21)` or if an unexpected permission/integration appears.

## 3. Upload to App Store Connect

After the correct EAS build finishes:

```bash
pnpm exec eas submit --platform ios --profile production --latest
```

Alternatively, download the signed archive and upload it with Apple's supported Transporter/Xcode
workflow. Never place Apple credentials, app-specific passwords, session cookies, certificates, or
private keys in the repository.

## 4. Complete TestFlight Setup

1. Wait for App Store Connect processing.
2. Confirm build `21` appears under OPAi Police.
3. Resolve processing or compliance warnings before selecting it.
4. Complete export compliance, content rights, age rating, and App Privacy.
5. Paste the approved beta information and App Review notes.
6. Assign build `21` to `OPAi Internal Testers`.
7. Add approved internal testers and send the invitation.
8. Install the build through TestFlight on a real iPhone and iPad.
9. Complete the real-device smoke test and monitor feedback.

The App Store Connect steps require an authorized Apple account and may present interactive
security prompts. Do not bypass them or share credentials with automation.
