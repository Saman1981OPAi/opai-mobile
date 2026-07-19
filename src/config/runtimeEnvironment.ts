export type AppRuntimeEnvironment = "development" | "production" | "staging";

export function resolveAppRuntimeEnvironment(
  value = process.env.EXPO_PUBLIC_APP_ENV
): AppRuntimeEnvironment {
  if (value === "production" || value === "staging") {
    return value;
  }

  return "development";
}

export function shouldIncludeSyntheticSeedData(
  value = process.env.EXPO_PUBLIC_APP_ENV
): boolean {
  return resolveAppRuntimeEnvironment(value) === "staging";
}

export function selectSyntheticSeedData<T>(
  factory: () => T[],
  value = process.env.EXPO_PUBLIC_APP_ENV
): T[] {
  return shouldIncludeSyntheticSeedData(value) ? factory() : [];
}
