const SAFE_SEGMENT = /^[A-Za-z0-9._-]{1,120}$/;

export function safeProtectedSegment(value: string, label: string) {
  const normalized = value.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
  if (!normalized || !SAFE_SEGMENT.test(normalized)) {
    throw new Error(`${label} cannot be represented as a protected storage key.`);
  }
  return normalized;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

