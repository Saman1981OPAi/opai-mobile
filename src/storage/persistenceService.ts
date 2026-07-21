import { migrationService } from "@/storage/migrationService";
import { createDefaultLocalAppData } from "@/storage/seedDataService";
import { CURRENT_STORAGE_VERSION, STORAGE_KEYS } from "@/storage/storageKeys";
import { storageClient } from "@/storage/storageClient";
import type { LocalAppData, LocalAuthSession } from "@/storage/storageTypes";

export const persistenceService = {
  async loadOrSeed(): Promise<LocalAppData> {
    const existing = await storageClient.getJson<LocalAppData>(STORAGE_KEYS.localAppData);

    if (existing) {
      const migrated = migrationService.migrate(existing);
      if (migrated !== existing) {
        await this.save(migrated);
      }
      return migrated;
    }

    const seeded = createDefaultLocalAppData();
    await this.save(seeded);
    return seeded;
  },

  async save(data: LocalAppData): Promise<void> {
    await storageClient.setJson(STORAGE_KEYS.localAppData, data);
    await storageClient.setJson(STORAGE_KEYS.storageVersion, CURRENT_STORAGE_VERSION);
  },

  async saveWithFrozenLegacyReports(data: LocalAppData): Promise<void> {
    const existing = await storageClient.getJson<LocalAppData>(STORAGE_KEYS.localAppData);
    await this.save({
      ...data,
      incidentDrafts: existing?.incidentDrafts ?? []
    });
  },

  async clearLegacyReports(data: LocalAppData): Promise<void> {
    await this.save({ ...data, incidentDrafts: [] });
  },

  async resetDemoData(authOverride?: LocalAuthSession): Promise<LocalAppData> {
    const seeded = createDefaultLocalAppData(authOverride);
    await this.save(seeded);
    return seeded;
  },

  async clearAll(): Promise<void> {
    await storageClient.multiRemove([STORAGE_KEYS.localAppData, STORAGE_KEYS.storageVersion]);
  }
};
