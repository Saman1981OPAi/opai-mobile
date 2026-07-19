# Build 26 WeatherKit Human Actions

Status: **HUMAN ACTION PENDING**

1. Open Apple Developer.
2. Select **Certificates, Identifiers & Profiles**.
3. Select **Identifiers**.
4. Open App ID `com.opaiapp.police`.
5. Edit the App ID.
6. Enable the **WeatherKit** capability.
7. Enable the WeatherKit app service if Apple displays it separately.
8. Save and confirm the App ID change.
9. Refresh the EAS iOS App Store provisioning profile.
10. Verify `com.apple.developer.weatherkit = true` in the generated application entitlements.
11. Test native WeatherKit on a physical iPhone, including permission denial, manual city fallback,
   cached/offline state, and Apple Weather attribution.

Do not create or export a WeatherKit REST key. Build 26 uses native Apple WeatherKit on iPhone.
Do not generate Build 26 until every other release gate is also approved.

## Human Completion Record

- Capability enabled: `Yes / No`
- App service enabled, if separately shown: `Yes / No / Not shown`
- App Store provisioning profile refreshed: `Yes / No`
- Generated-app entitlement verified: `Yes / No`
- Physical iPhone WeatherKit test passed: `Yes / No`

Current status: **HUMAN ACTION PENDING**
