import { CURRENT_STORAGE_VERSION } from "@/storage/storageKeys";
import type { LocalAppData } from "@/storage/storageTypes";

export const migrationService = {
  migrate(data: LocalAppData): LocalAppData {
    if (data.version === CURRENT_STORAGE_VERSION) {
      return data;
    }

    return {
      ...data,
      updatedAt: new Date().toISOString(),
      version: CURRENT_STORAGE_VERSION
    };
  }
};
