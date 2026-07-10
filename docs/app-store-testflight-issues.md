# App Store and TestFlight Issues

## Current Review State

No Apple rejection, Beta App Review message, TestFlight crash report, screenshot rejection, or App
Privacy correction was available during Sprint 022.

| Issue | Required fix | Fix/status | New build? | Response/action |
| --- | --- | --- | --- | --- |
| Historical GitHub EAS CI authentication failure | Configure `EXPO_TOKEN` as a GitHub environment secret and fail clearly when absent | Current workflow contains explicit token preflight; no token is committed | No app binary change for the guard itself | Re-run only after repository/environment administrator configures the secret |
| Target build 21 not uploaded | Review/merge Sprint 022, synchronize EAS remote build baseline, generate and submit build | Pending authorized release operator | Yes: target build 21 | Follow Sprint 021 upload instructions; do not delete app record |
| Short website aliases return 404 | Add website redirects or continue using live canonical URLs | Deferred to website; canonical URLs are valid | No | Use `/privacy-policy`, `/terms-of-service`, and `/contact` |
| Sprint 022 navigation/accessibility fixes | Include current source in next signed candidate | Implemented in source, awaiting TestFlight verification | Yes: include in target build 21 | No Apple response required unless Apple raises the issue |

App Store Connect metadata, screenshots, privacy answers, content rights, age rating, export
compliance, and reviewer notes still require manual confirmation against the uploaded binary.
