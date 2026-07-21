import type { LocalIncidentDraft } from "@/storage/storageTypes";
import { protectedStorage } from "@/storage/protected/protectedStorage";
import {
  PROTECTED_REPORT_SCHEMA_VERSION,
  type ProtectedReportStore
} from "./protectedReportTypes";
import { isProtectedReportStore } from "./protectedReportValidation";

const namespace = "report-drafts";

function options(userId: string) {
  return {
    namespace,
    schemaVersion: PROTECTED_REPORT_SCHEMA_VERSION,
    userId,
    validate: isProtectedReportStore
  };
}

export const protectedReportRepository = {
  async clear(userId: string) {
    await protectedStorage.remove(options(userId));
  },

  async load(userId: string) {
    return protectedStorage.load(options(userId));
  },

  async save(userId: string, drafts: LocalIncidentDraft[]) {
    const current = await this.load(userId);
    const store: ProtectedReportStore = {
      drafts,
      ...(current?.data.migration ? { migration: current.data.migration } : {}),
      userId,
      version: PROTECTED_REPORT_SCHEMA_VERSION
    };
    await protectedStorage.save(options(userId), store);
  },

  async saveStore(store: ProtectedReportStore) {
    await protectedStorage.save(options(store.userId), store);
  }
};

