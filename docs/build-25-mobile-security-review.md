# Build 25 Mobile Security Review

- Access and refresh tokens use `expo-secure-store`, not AsyncStorage.
- Requests use TLS, a 45-second timeout, one bounded refresh attempt, and normalized user-safe errors.
- No API key, signing secret, database credential, fixed JWT, or backend environment file is present.
- No mobile source calls OpenAI directly.
- Uploads are size/type checked client-side and again by the backend.
- Production remains intentionally undeployed.
