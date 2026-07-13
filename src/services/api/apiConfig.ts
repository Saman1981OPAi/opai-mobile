const configuredRoot = process.env.EXPO_PUBLIC_OPAI_API_BASE_URL?.trim();
const configuredBaseUrl = configuredRoot
  ? `${configuredRoot.replace(/\/$/, "")}${configuredRoot.endsWith("/api/v1") ? "" : "/api/v1"}`
  : undefined;

export const apiConfig = {
  baseUrl: (configuredBaseUrl || "http://127.0.0.1:8000/api/v1").replace(/\/$/, ""),
  environment: process.env.EXPO_PUBLIC_APP_ENV?.trim() || "development",
  timeoutMs: 45_000,
  maxUploadBytes: 10 * 1024 * 1024,
  maxAudioSeconds: 120,
  maxInputCharacters: 20_000
} as const;

export const isApiConfigured = Boolean(configuredRoot);
