# App Store and TestFlight Issue Response Playbook

Respond with the exact build, evidence, and smallest corrective action. Do not speculate or add
features while a submission is under review.

## Build Processing

### Missing Icon or Binary Asset

- Apple may say: a required icon, launch asset, or bundle resource is missing or invalid.
- Likely cause: malformed asset, unsupported size/alpha, stale build, or configuration path error.
- Investigate: inspect processing details, `app.json`, exported assets, and the exact uploaded build.
- Fix: correct the asset/configuration, increment the build number, rebuild, and upload.
- Response: thank Apple, identify the corrected asset, and provide the replacement build number.
- Hotfix: required when the binary cannot process; metadata-only if only store artwork is affected.

### Build Number, Bundle ID, Binary, or Permission String

- Apple may say: duplicate/invalid build, bundle mismatch, invalid executable, or missing usage text.
- Likely cause: reused build number, signing/config mismatch, unsupported binary, or a permission
  introduced without its required purpose string.
- Investigate: compare App Store record, EAS build profile, Expo public config, processing log, and
  dependency permissions.
- Fix: correct configuration or remove the unnecessary permission, increment build, rebuild, and
  replace the selected build. Never change the existing app record to work around a bundle error.
- Response: state the exact cause, corrected configuration, and new build number.
- Hotfix: required for binary/configuration failures.

## Metadata and Screenshots

### Claims, URLs, or Description

- Apple may say: description is misleading, support/privacy URL is missing, or functionality is
  overstated.
- Likely cause: copy describes future AI/backend features, a URL is unavailable, or prototype
  limitations are not prominent enough.
- Investigate: compare store copy, live URLs, reviewer notes, and actual build behavior.
- Fix: use the Sprint 019 field package, restore accurate testing/local-only language, and enter a
  live canonical URL.
- Response: clarify the current local/mock behavior and identify the corrected field.
- Hotfix: usually not required when App Store Connect metadata alone can be edited.

### Screenshot Mismatch or Dimensions

- Apple may say: screenshots are the wrong size, show unavailable behavior, or do not represent the
  current build.
- Likely cause: incorrect export canvas, device-frame crop, stale mockup, or unsupported claim.
- Investigate: inspect pixel dimensions and compare each screen with build `19` on-device.
- Fix: re-export accepted PNG/JPG/JPEG dimensions and replace only the affected assets.
- Response: confirm corrected screenshots now match the current build.
- Hotfix: not required unless the underlying UI is actually broken.

## Privacy

### Privacy Answers or Data Disclosure

- Apple may say: privacy answers do not match observed fields, diagnostics, permissions, or stated
  local-only processing.
- Likely cause: answering for future features, misunderstanding on-device data, or overlooking build
  diagnostics.
- Investigate: review the uploaded binary, dependencies, permissions, local storage, and current
  Apple definitions with the privacy owner.
- Fix: correct App Privacy answers or remove unexpected collection/permission code and replace the
  build.
- Response: describe what stays on device, what leaves the device, and the corrected declaration.
- Hotfix: metadata-only for an answer error; required if the binary behaves differently.

## Content Rights and Affiliation

### Third-Party Content or Police/Government Branding

- Apple may say: authorization is needed for imagery, terminology, insignia, or implied affiliation.
- Likely cause: protected imagery, unclear ownership, or wording that sounds official.
- Investigate: inventory all icons, screenshots, assets, store copy, and in-app affiliation notices.
- Fix: remove/replace questioned material with owned generic branding and clarify independence.
- Response: state ownership or removal and confirm no police-service/government affiliation.
- Hotfix: required when questioned content is embedded in the binary; metadata-only for store assets.

## Safety

### AI, Legal, Medical/PTSD, Translation, or Official-Use Concern

- Apple may say: the app appears to provide authoritative AI, legal, medical, emergency, or police
  operational advice.
- Likely cause: overbroad wording, hidden disclaimer, or a mock result that looks authoritative.
- Investigate: reproduce the cited flow and inspect labels, disclaimers, and App Review notes.
- Fix: clarify mock/testing behavior, make the relevant disclaimer visible, and remove unsupported
  claims. Do not add live AI to resolve a review question.
- Response: explain the local mock boundary and the requirement to verify all output.
- Hotfix: required if in-app behavior/copy is unsafe; metadata-only if store copy caused the issue.

## Technical Behavior

### Crash, Broken Auth/Navigation, Blank Screen, Demo Access, or Runtime Permission

- Apple may say: the app cannot launch, reviewer cannot enter the app, a route is broken, or a
  permission prompt blocks testing.
- Likely cause: release-only runtime error, stale persisted state, missing asset, unsafe layout, or
  unexpected permission path.
- Investigate: reproduce on the same device/iOS/build, review logs, clear local state, and test both
  fresh install and upgrade paths.
- Fix: make the smallest code/config correction, add a regression check, increment build, and upload
  a replacement.
- Response: provide simple reviewer steps, describe the correction, and identify the new build.
- Hotfix: required for crashes or blocked core workflows.

## Response Standard

Every response should be professional, concise, non-defensive, and evidence-based. Acknowledge the
issue, state actual current behavior, describe the correction, identify whether metadata or a new
build changed, and invite Apple to continue review.
