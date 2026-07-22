import assert from "node:assert/strict";
import test from "node:test";
import { createProtectedStorageEngine } from "./protectedStorageEngine.ts";
import type { ProtectedStorageAdapter } from "./protectedStorageTypes.ts";

function harness() {
  const values = new Map<string, string>();
  const adapter: ProtectedStorageAdapter = {
    async getItem(key) {
      return values.get(key) ?? null;
    },
    async removeItem(key) {
      values.delete(key);
    },
    async setItem(key, value) {
      values.set(key, value);
    }
  };
  const keys = new Map<string, Uint8Array>();
  let nonceSeed = 1;
  const engine = createProtectedStorageEngine({
    adapter,
    keyProvider: {
      async deleteKey(userId) {
        keys.delete(userId);
      },
      async getKey(userId, create) {
        const existing = keys.get(userId);
        if (existing) return existing;
        if (!create) return null;
        const key = Uint8Array.from({ length: 32 }, (_, index) => index + 1);
        keys.set(userId, key);
        return key;
      }
    },
    now: () => "2026-07-21T12:00:00.000Z",
    async randomBytes(length) {
      const bytes = Uint8Array.from({ length }, (_, index) => (nonceSeed + index) % 255);
      nonceSeed += 17;
      return bytes;
    }
  });
  return { engine, values };
}

const options = {
  namespace: "reports",
  schemaVersion: 1,
  userId: "officer-1",
  validate: (value: unknown): value is { title: string } =>
    Boolean(value) && typeof value === "object" && typeof (value as { title?: unknown }).title === "string"
};

test("protected storage stages and verifies writes", async () => {
  const { engine, values } = harness();
  await engine.save(options, { title: "Synthetic report" });
  const loaded = await engine.load(options);
  assert.deepEqual(loaded, {
    data: { title: "Synthetic report" },
    recoveredFromRollback: false
  });
  assert.equal([...values.keys()].some((key) => key.endsWith(".staging")), false);
  assert.equal([...values.values()].some((value) => value.includes("Synthetic report")), false);
});

test("protected storage can recover the last authenticated value", async () => {
  const { engine, values } = harness();
  await engine.save(options, { title: "First" });
  await engine.save(options, { title: "Second" });
  const primary = [...values.keys()].find((key) => !key.endsWith(".rollback") && !key.endsWith(".staging"));
  assert.ok(primary);
  values.set(primary, "corrupted");
  const loaded = await engine.load(options);
  assert.deepEqual(loaded, { data: { title: "First" }, recoveredFromRollback: true });
});

test("protected storage isolates accounts", async () => {
  const { engine } = harness();
  await engine.save(options, { title: "Officer one" });
  const other = await engine.load({ ...options, userId: "officer-2" });
  assert.equal(other, null);
});

test("protected removal waits for an in-flight write", async () => {
  const values = new Map<string, string>();
  let releaseStaging: (() => void) | undefined;
  const stagingBlocked = new Promise<void>((resolve) => { releaseStaging = resolve; });
  const engine = createProtectedStorageEngine({
    adapter: {
      async getItem(key) { return values.get(key) ?? null; },
      async removeItem(key) { values.delete(key); },
      async setItem(key, value) {
        if (key.endsWith(".staging")) await stagingBlocked;
        values.set(key, value);
      }
    },
    keyProvider: {
      async deleteKey() {},
      async getKey() { return Uint8Array.from({ length: 32 }, (_, index) => index + 1); }
    },
    now: () => "2026-07-21T12:00:00.000Z",
    async randomBytes(length) { return Uint8Array.from({ length }, (_, index) => index + 1); }
  });

  const save = engine.save(options, { title: "Synthetic pending report" });
  const remove = engine.remove(options);
  releaseStaging?.();
  await Promise.all([save, remove]);

  assert.equal(await engine.load(options), null);
  assert.equal(values.size, 0);
});

test("protected storage does not silently accept corrupted data", async () => {
  const { engine, values } = harness();
  await engine.save(options, { title: "Synthetic report" });
  const primary = [...values.keys()].find((key) => !key.endsWith(".rollback") && !key.endsWith(".staging"));
  assert.ok(primary);
  values.set(primary, "corrupted");
  await assert.rejects(() => engine.load(options));
  assert.equal(values.get(primary), "corrupted");
});
