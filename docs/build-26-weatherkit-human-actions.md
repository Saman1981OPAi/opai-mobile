# Build 26 WeatherKit Human Actions

Status: **HUMAN ACTION PENDING**

1. Open Apple Developer.
2. Select **Certificates, Identifiers & Profiles**.
3. Select **Identifiers**.
4. Open App ID `com.opaiapp.police`.
5. Enable **WeatherKit**.
6. Save the App ID.
7. Refresh the EAS iOS App Store provisioning profile.
8. Verify `com.apple.developer.weatherkit = true` in the generated application entitlements.
9. Test native WeatherKit on a physical iPhone, including permission denial, manual city fallback,
   cached/offline state, and Apple Weather attribution.

Do not create or export a WeatherKit REST key. Build 26 uses native Apple WeatherKit on iPhone.
Do not generate Build 26 until every other release gate is also approved.
