import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { decodeAssistantKey, decryptAssistantStore } from "@/features/assistant/assistantCrypto";
import {
  ASSISTANT_STORE_VERSION,
  migrateLegacyRecords,
  type AssistantConversation,
  type AssistantStore,
  type LegacyAssistantRecord
} from "@/features/assistant/assistantTypes";
import { protectedStorage } from "@/storage/protected/protectedStorage";
import { isRecord } from "@/storage/protected/protectedStorageValidation";

const LEGACY_KEY_PREFIX = "opai.assistant.key.v1.";
const LEGACY_STORAGE_PREFIX = "@opai/assistant/encrypted/v1/";
const namespace = "assistant-history";
const MAX_CONVERSATIONS = 40;
const MAX_MESSAGES_PER_CONVERSATION = 240;

function safeUserId(userId: string) {
  return userId.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
}

function legacyKeyName(userId: string) { return `${LEGACY_KEY_PREFIX}${safeUserId(userId)}`; }
function legacyStorageKey(userId: string) { return `${LEGACY_STORAGE_PREFIX}${safeUserId(userId)}`; }

function isAssistantStore(value: unknown): value is AssistantStore {
  if (!isRecord(value) || value.version !== ASSISTANT_STORE_VERSION || typeof value.userId !== "string" || !Array.isArray(value.conversations)) return false;
  return value.conversations.every((conversation) => isRecord(conversation) && typeof conversation.id === "string" && typeof conversation.title === "string" && typeof conversation.createdAt === "string" && typeof conversation.updatedAt === "string" && typeof conversation.version === "number" && Array.isArray(conversation.messages) && conversation.messages.every((message) => isRecord(message) && typeof message.id === "string" && typeof message.conversationId === "string" && (message.role === "user" || message.role === "assistant") && typeof message.content === "string" && ["pending", "complete", "failed", "cancelled"].includes(String(message.status)) && typeof message.createdAt === "string"));
}

function options(userId: string) {
  return { namespace, schemaVersion: ASSISTANT_STORE_VERSION, userId, validate: isAssistantStore };
}

function boundedStore(store: AssistantStore): AssistantStore {
  return {
    ...store,
    conversations: [...store.conversations]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, MAX_CONVERSATIONS)
      .map((conversation) => ({ ...conversation, messages: conversation.messages.slice(-MAX_MESSAGES_PER_CONVERSATION) }))
  };
}

async function loadLegacyEncrypted(userId: string) {
  const encrypted = await AsyncStorage.getItem(legacyStorageKey(userId));
  if (!encrypted) return null;
  const encodedKey = await SecureStore.getItemAsync(legacyKeyName(userId));
  if (!encodedKey) throw new Error("Legacy protected Assistant history cannot be unlocked.");
  return decryptAssistantStore(encrypted, userId, decodeAssistantKey(encodedKey));
}

async function saveVerified(store: AssistantStore) {
  await protectedStorage.save(options(store.userId), boundedStore(store));
  const verification = await protectedStorage.load(options(store.userId));
  if (!verification || !isAssistantStore(verification.data)) throw new Error("Assistant protected write verification failed.");
}

export const assistantRepository = {
  async load(userId: string, legacyRecords: LegacyAssistantRecord[] = []) {
    const current = await protectedStorage.load(options(userId));
    if (current) {
      return { conversations: current.data.conversations, migratedLegacy: Boolean(current.data.migration), shouldClearLegacyPlaintext: legacyRecords.length > 0 && Boolean(current.data.migration) };
    }

    const legacyEncrypted = await loadLegacyEncrypted(userId);
    if (legacyEncrypted) {
      await saveVerified(legacyEncrypted);
      return { conversations: legacyEncrypted.conversations, migratedLegacy: true, shouldClearLegacyPlaintext: legacyRecords.length > 0 };
    }

    if (legacyRecords.length === 0) return { conversations: [] as AssistantConversation[], migratedLegacy: false, shouldClearLegacyPlaintext: false };
    const migratedAt = new Date().toISOString();
    const store: AssistantStore = {
      conversations: migrateLegacyRecords(legacyRecords),
      legacyRollback: legacyRecords,
      migration: { completedAt: migratedAt, sourceCount: legacyRecords.length, version: 1 },
      userId,
      version: ASSISTANT_STORE_VERSION
    };
    await saveVerified(store);
    return { conversations: store.conversations, migratedLegacy: true, shouldClearLegacyPlaintext: true };
  },

  async save(userId: string, conversations: AssistantConversation[]) {
    const current = await protectedStorage.load(options(userId));
    await saveVerified({
      conversations,
      ...(current?.data.legacyRollback ? { legacyRollback: current.data.legacyRollback } : {}),
      ...(current?.data.migration ? { migration: current.data.migration } : {}),
      userId,
      version: ASSISTANT_STORE_VERSION
    });
  },

  async clearHistory(userId: string) { await this.save(userId, []); },

  async clearUserData(userId: string) {
    await Promise.all([
      protectedStorage.remove(options(userId)),
      AsyncStorage.removeItem(legacyStorageKey(userId)),
      SecureStore.deleteItemAsync(legacyKeyName(userId))
    ]);
  }
};
