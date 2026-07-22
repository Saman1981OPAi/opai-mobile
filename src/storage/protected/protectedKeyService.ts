import { getRandomBytesAsync } from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { decodeProtectedKey, encodeProtectedKey } from "./protectedEnvelope";
import { ProtectedStorageError } from "./protectedStorageErrors";
import { safeProtectedSegment } from "./protectedStorageValidation";

const KEY_PREFIX = "opai.protected.master.v1.";

function keyName(userId: string) {
  return `${KEY_PREFIX}${safeProtectedSegment(userId, "User ID")}`;
}

export const protectedKeyService = {
  async deleteKey(userId: string) {
    await SecureStore.deleteItemAsync(keyName(userId));
  },

  async getKey(userId: string, create: boolean) {
    const name = keyName(userId);
    const existing = await SecureStore.getItemAsync(name);
    if (existing) return decodeProtectedKey(existing);
    if (!create) return null;
    try {
      const key = await getRandomBytesAsync(32);
      await SecureStore.setItemAsync(name, encodeProtectedKey(key), {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
      });
      const verification = await SecureStore.getItemAsync(name);
      if (!verification) {
        throw new ProtectedStorageError("KEY_UNAVAILABLE", "Protected key verification failed.");
      }
      return decodeProtectedKey(verification);
    } catch (error) {
      if (error instanceof ProtectedStorageError) throw error;
      throw new ProtectedStorageError("KEY_UNAVAILABLE", "Protected key is unavailable.", error);
    }
  }
};
