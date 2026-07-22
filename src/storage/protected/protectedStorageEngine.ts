import { decryptProtectedValue, encryptProtectedValue } from "./protectedEnvelope.ts";
import { ProtectedStorageError } from "./protectedStorageErrors.ts";
import type {
  ProtectedKeyProvider,
  ProtectedRandomSource,
  ProtectedStorageAdapter,
  ProtectedStorageOptions,
  ProtectedStorageRecord
} from "./protectedStorageTypes.ts";
import { safeProtectedSegment } from "./protectedStorageValidation.ts";

const STORAGE_PREFIX = "@opai/protected/v1";

function keys(userId: string, namespace: string) {
  const base = `${STORAGE_PREFIX}/${safeProtectedSegment(userId, "User ID")}/${safeProtectedSegment(namespace, "Namespace")}`;
  return {
    primary: base,
    rollback: `${base}.rollback`,
    staging: `${base}.staging`
  };
}

function validateConfiguration<T>(options: ProtectedStorageOptions<T>) {
  if (!options.userId.trim() || !options.namespace.trim() || options.schemaVersion < 1) {
    throw new ProtectedStorageError(
      "INVALID_CONFIGURATION",
      "Protected storage requires a user, namespace, and positive schema version."
    );
  }
}

export function createProtectedStorageEngine(dependencies: {
  adapter: ProtectedStorageAdapter;
  keyProvider: ProtectedKeyProvider;
  now?: () => string;
  randomBytes: ProtectedRandomSource;
}) {
  const queues = new Map<string, Promise<void>>();

  function enqueue(queueKey: string, operation: () => Promise<void>) {
    const prior = queues.get(queueKey) ?? Promise.resolve();
    const queued = prior.catch(() => undefined).then(operation);
    queues.set(queueKey, queued);
    return queued.finally(() => {
      if (queues.get(queueKey) === queued) queues.delete(queueKey);
    });
  }

  async function decryptAndValidate<T>(
    encrypted: string,
    options: ProtectedStorageOptions<T>,
    key: Uint8Array
  ) {
    const result = decryptProtectedValue({ encrypted, key, ...options });
    if (!options.validate(result.data)) {
      throw new ProtectedStorageError(
        "VALIDATION_FAILED",
        "Protected data failed schema validation."
      );
    }
    return { createdAt: result.createdAt, data: result.data as T };
  }

  async function performSave<T>(options: ProtectedStorageOptions<T>, data: T) {
    validateConfiguration(options);
    if (!options.validate(data)) {
      throw new ProtectedStorageError("VALIDATION_FAILED", "Refusing to save invalid protected data.");
    }
    const key = await dependencies.keyProvider.getKey(options.userId, true);
    if (!key) throw new ProtectedStorageError("KEY_UNAVAILABLE", "Protected key is unavailable.");
    const destination = keys(options.userId, options.namespace);
    const current = await dependencies.adapter.getItem(destination.primary);
    let createdAt: string | undefined;
    if (current) {
      createdAt = (await decryptAndValidate(current, options, key)).createdAt;
    }
    const now = (dependencies.now ?? (() => new Date().toISOString()))();
    const encrypted = encryptProtectedValue({
      ...(createdAt ? { createdAt } : {}),
      data,
      key,
      namespace: options.namespace,
      nonce: await dependencies.randomBytes(12),
      now,
      schemaVersion: options.schemaVersion,
      userId: options.userId
    });

    try {
      await dependencies.adapter.setItem(destination.staging, encrypted);
      const staged = await dependencies.adapter.getItem(destination.staging);
      if (!staged) throw new ProtectedStorageError("WRITE_VERIFICATION_FAILED", "Staged protected write is missing.");
      await decryptAndValidate(staged, options, key);
      if (current) await dependencies.adapter.setItem(destination.rollback, current);
      await dependencies.adapter.setItem(destination.primary, staged);
      const verification = await dependencies.adapter.getItem(destination.primary);
      if (!verification) throw new ProtectedStorageError("WRITE_VERIFICATION_FAILED", "Protected write is missing.");
      await decryptAndValidate(verification, options, key);
      await dependencies.adapter.removeItem(destination.staging);
    } catch (error) {
      if (error instanceof ProtectedStorageError) throw error;
      throw new ProtectedStorageError("STORAGE_FAILURE", "Protected write failed.", error);
    }
  }

  return {
    async load<T>(options: ProtectedStorageOptions<T>): Promise<ProtectedStorageRecord<T> | null> {
      validateConfiguration(options);
      const destination = keys(options.userId, options.namespace);
      const primary = await dependencies.adapter.getItem(destination.primary);
      if (!primary) return null;
      const key = await dependencies.keyProvider.getKey(options.userId, false);
      if (!key) throw new ProtectedStorageError("KEY_UNAVAILABLE", "Protected data cannot be unlocked.");
      try {
        const loaded = await decryptAndValidate(primary, options, key);
        return { data: loaded.data, recoveredFromRollback: false };
      } catch (primaryError) {
        const rollback = await dependencies.adapter.getItem(destination.rollback);
        if (!rollback) throw primaryError;
        try {
          const recovered = await decryptAndValidate(rollback, options, key);
          return { data: recovered.data, recoveredFromRollback: true };
        } catch {
          throw primaryError;
        }
      }
    },

    async remove<T>(options: ProtectedStorageOptions<T>) {
      validateConfiguration(options);
      const queueKey = `${options.userId}:${options.namespace}`;
      await enqueue(queueKey, async () => {
        const destination = keys(options.userId, options.namespace);
        await Promise.all([
          dependencies.adapter.removeItem(destination.primary),
          dependencies.adapter.removeItem(destination.rollback),
          dependencies.adapter.removeItem(destination.staging)
        ]);
      });
    },

    save<T>(options: ProtectedStorageOptions<T>, data: T) {
      const queueKey = `${options.userId}:${options.namespace}`;
      return enqueue(queueKey, () => performSave(options, data));
    }
  };
}
