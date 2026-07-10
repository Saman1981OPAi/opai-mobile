# Build 21 EAS Baseline Reset

Date: July 10, 2026

## Reason

Failed Build 21 attempts advanced the EAS remote iOS build number to `21`. To reuse Build 21 after fixing the provisioning issue, the iOS remote baseline had to be reset to `20`.

## Baseline Reset

- Previous remote iOS build number: `21`
- Reset baseline: `20`
- Read-back confirmation before retry: `iOS buildNumber - 20`
- Expected next iOS build: `21`

## Result

During the successful production iOS build, EAS reported:

```text
Incrementing buildNumber from 20 to 21.
Incremented buildNumber from 20 to 21.
```

After the successful build, remote iOS build number reads `21`, as expected.

## Android

Android build numbers and Android release configuration were not changed.

