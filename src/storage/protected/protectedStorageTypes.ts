export const PROTECTED_ENVELOPE_VERSION = 1 as const;

export type ProtectedEnvelope = {
  algorithm: "AES-256-GCM";
  ciphertext: string;
  createdAt: string;
  envelopeVersion: typeof PROTECTED_ENVELOPE_VERSION;
  namespace: string;
  nonce: string;
  schemaVersion: number;
  updatedAt: string;
  userBinding: string;
};

export type ProtectedStorageRecord<T> = {
  data: T;
  recoveredFromRollback: boolean;
};

export type ProtectedStorageOptions<T> = {
  namespace: string;
  schemaVersion: number;
  userId: string;
  validate: (value: unknown) => value is T;
};

export type ProtectedStorageAdapter = {
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  setItem(key: string, value: string): Promise<void>;
};

export type ProtectedKeyProvider = {
  deleteKey(userId: string): Promise<void>;
  getKey(userId: string, create: boolean): Promise<Uint8Array | null>;
};

export type ProtectedRandomSource = (length: number) => Promise<Uint8Array>;

