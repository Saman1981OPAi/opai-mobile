import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRandomBytesAsync } from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import {
  decodeAssistantKey,
  decryptAssistantStore,
  encodeAssistantKey,
  encryptAssistantStore
} from "@/features/assistant/assistantCrypto";
import {
  ASSISTANT_STORE_VERSION,
  migrateLegacyRecords,
  type AssistantConversation,
  type AssistantStore,
  type LegacyAssistantRecord
} from "@/features/assistant/assistantTypes";

const KEY_PREFIX = "opai.assistant.key.v1.";
const STORAGE_PREFIX = "@opai/assistant/encrypted/v1/";
const MAX_CONVERSATIONS = 40;
const MAX_MESSAGES_PER_CONVERSATION = 240;
const writeQueues = new Map<string, Promise<void>>();

function safeUserId(userId: string) {
  return userId.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
}

function keyName(userId: string) {
  return `${KEY_PREFIX}${safeUserId(userId)}`;
}

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${safeUserId(userId)}`;
}

async function loadKey(userId: string, create: boolean) {
  const name = keyName(userId);
  const existing = await SecureStore.getItemAsync(name);
  if (existing) return decodeAssistantKey(existing);
  if (!create) return null;
  const key = await getRandomBytesAsync(32);
  await SecureStore.setItemAsync(name, encodeAssistantKey(key), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
  });
  return key;
}

function boundedStore(store: AssistantStore): AssistantStore {
  return {
    ...store,
    conversations: [...store.conversations]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, MAX_CONVERSATIONS)
      .map((conversation) => ({
        ...conversation,
        messages: conversation.messages.slice(-MAX_MESSAGES_PER_CONVERSATION)
      }))
  };
}

async function writeVerified(store: AssistantStore) {
  const key = await loadKey(store.userId, true);
  if (!key) throw new Error("Assistant encryption key is unavailable.");
  const nonce = await getRandomBytesAsync(12);
  const encrypted = encryptAssistantStore(boundedStore(store), key, nonce);
  const destination = storageKey(store.userId);
  await AsyncStorage.setItem(destination, encrypted);
  const verification = await AsyncStorage.getItem(destination);
  if (!verification) throw new Error("Assistant history verification failed.");
  decryptAssistantStore(verification, store.userId, key);
}

function queueWrite(store: AssistantStore) {
  const prior = writeQueues.get(store.userId) ?? Promise.resolve();
  const queued = prior.catch(() => undefined).then(() => writeVerified(store));
  writeQueues.set(store.userId, queued);
  return queued.finally(() => {
    if (writeQueues.get(store.userId) === queued) writeQueues.delete(store.userId);
  });
}

export const assistantRepository = {
  async load(userId: string, legacyRecords: LegacyAssistantRecord[] = []) {
    const encrypted = await AsyncStorage.getItem(storageKey(userId));
    if (encrypted) {
      const key = await loadKey(userId, false);
      if (!key) throw new Error("Protected Assistant history cannot be unlocked.");
      const store = decryptAssistantStore(encrypted, userId, key);
      return {
        conversations: store.conversations,
        migratedLegacy: Boolean(store.migration),
        shouldClearLegacyPlaintext: legacyRecords.length > 0 && Boolean(store.migration)
      };
    }

    if (legacyRecords.length === 0) {
      return {
        conversations: [] as AssistantConversation[],
        migratedLegacy: false,
        shouldClearLegacyPlaintext: false
      };
    }

    const migratedAt = new Date().toISOString();
    const store: AssistantStore = {
      conversations: migrateLegacyRecords(legacyRecords),
      legacyRollback: legacyRecords,
      migration: {
        completedAt: migratedAt,
        sourceCount: legacyRecords.length,
        version: 1
      },
      userId,
      version: ASSISTANT_STORE_VERSION
    };
    await queueWrite(store);
    return {
      conversations: store.conversations,
      migratedLegacy: true,
      shouldClearLegacyPlaintext: true
    };
  },

  async save(userId: string, conversations: AssistantConversation[]) {
    const currentEncrypted = await AsyncStorage.getItem(storageKey(userId));
    let current: AssistantStore | null = null;
    if (currentEncrypted) {
      const key = await loadKey(userId, false);
      if (!key) throw new Error("Protected Assistant history cannot be unlocked.");
      current = decryptAssistantStore(currentEncrypted, userId, key);
    }
    await queueWrite({
      conversations,
      ...(current?.legacyRollback ? { legacyRollback: current.legacyRollback } : {}),
      ...(current?.migration ? { migration: current.migration } : {}),
      userId,
      version: ASSISTANT_STORE_VERSION
    });
  },

  async clearHistory(userId: string) {
    await this.save(userId, []);
  },

  async clearUserData(userId: string) {
    await (writeQueues.get(userId) ?? Promise.resolve()).catch(() => undefined);
    await Promise.all([
      AsyncStorage.removeItem(storageKey(userId)),
      SecureStore.deleteItemAsync(keyName(userId))
    ]);
    writeQueues.delete(userId);
  }
};
