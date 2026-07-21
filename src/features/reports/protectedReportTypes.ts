import type { LocalIncidentDraft } from "@/storage/storageTypes";

export const PROTECTED_REPORT_SCHEMA_VERSION = 1;

export type ProtectedReportMigration = {
  completedAt: string;
  legacyOwnerId: string;
  sourceCount: number;
  sourceIds: string[];
  verifiedAt: string;
};

export type ProtectedReportStore = {
  drafts: LocalIncidentDraft[];
  migration?: ProtectedReportMigration;
  userId: string;
  version: typeof PROTECTED_REPORT_SCHEMA_VERSION;
};

export type ReportMigrationResult = {
  drafts: LocalIncidentDraft[];
  migrated: boolean;
  protectedWriteVerified: boolean;
  retainLegacyPlaintext: boolean;
};

