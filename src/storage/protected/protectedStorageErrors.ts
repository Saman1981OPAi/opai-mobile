export type ProtectedStorageErrorCode =
  | "CORRUPTED_DATA"
  | "INVALID_CONFIGURATION"
  | "KEY_UNAVAILABLE"
  | "STORAGE_FAILURE"
  | "VALIDATION_FAILED"
  | "WRITE_VERIFICATION_FAILED";

export class ProtectedStorageError extends Error {
  readonly code: ProtectedStorageErrorCode;
  readonly cause?: unknown;

  constructor(code: ProtectedStorageErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "ProtectedStorageError";
    this.code = code;
    if (cause !== undefined) this.cause = cause;
  }
}
