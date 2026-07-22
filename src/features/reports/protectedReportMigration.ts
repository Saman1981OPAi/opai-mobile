import type { LocalIncidentDraft } from "@/storage/storageTypes";
import { ProtectedStorageError } from "@/storage/protected/protectedStorageErrors";
import { protectedReportRepository } from "./protectedReportRepository";
import {
  PROTECTED_REPORT_SCHEMA_VERSION,
  type ProtectedReportStore,
  type ReportMigrationResult
} from "./protectedReportTypes";

function sameDraftSet(left: LocalIncidentDraft[], right: LocalIncidentDraft[]) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export const protectedReportMigration = {
  async loadOrMigrate(input: {
    legacyDrafts: LocalIncidentDraft[];
    legacyOwnerId: string | null;
    userId: string;
  }): Promise<ReportMigrationResult> {
    const existing = await protectedReportRepository.load(input.userId);
    if (existing) {
      return {
        drafts: existing.data.drafts,
        migrated: Boolean(existing.data.migration),
        protectedWriteVerified: true,
        retainLegacyPlaintext: input.legacyDrafts.length > 0
      };
    }

    const ownsLegacy = input.legacyOwnerId === input.userId;
    if (!ownsLegacy || input.legacyDrafts.length === 0) {
      return {
        drafts: [],
        migrated: false,
        protectedWriteVerified: true,
        retainLegacyPlaintext: input.legacyDrafts.length > 0
      };
    }

    const timestamp = new Date().toISOString();
    const store: ProtectedReportStore = {
      drafts: input.legacyDrafts,
      migration: {
        completedAt: timestamp,
        legacyOwnerId: input.userId,
        sourceCount: input.legacyDrafts.length,
        sourceIds: input.legacyDrafts.map((draft) => draft.id),
        verifiedAt: timestamp
      },
      userId: input.userId,
      version: PROTECTED_REPORT_SCHEMA_VERSION
    };
    await protectedReportRepository.saveStore(store);
    const verification = await protectedReportRepository.load(input.userId);
    if (!verification || !sameDraftSet(verification.data.drafts, input.legacyDrafts)) {
      throw new ProtectedStorageError(
        "WRITE_VERIFICATION_FAILED",
        "Report migration could not verify the protected copy."
      );
    }
    return {
      drafts: verification.data.drafts,
      migrated: true,
      protectedWriteVerified: true,
      retainLegacyPlaintext: true
    };
  }
};
