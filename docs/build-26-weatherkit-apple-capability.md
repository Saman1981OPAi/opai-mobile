# Build 26 Apple WeatherKit Capability Gate

Apple action is required before Build 26 generation.

1. Sign in to Apple Developer with an authorized account.
2. Open Certificates, Identifiers & Profiles > Identifiers.
3. Select App ID `com.opaiapp.police`.
4. Enable the WeatherKit capability and save.
5. In EAS credentials, refresh the iOS App Store provisioning profile so it includes
   `com.apple.developer.weatherkit`.
6. Do not export or commit certificates, profiles, API keys, passwords, or tokens.
7. Run the reviewed production iOS build only after the Build 26 PR is merged and all other gates
   pass.
8. Confirm the generated app entitlement is Boolean `true` and native WeatherKit succeeds on a
   physical iPhone.

The repository config plugin declares the entitlement, but repository configuration alone cannot
enable the capability on Apple's App ID or regenerate the provisioning profile.

No WeatherKit private key is required because Build 26 uses the native iOS framework, not the REST
API.
