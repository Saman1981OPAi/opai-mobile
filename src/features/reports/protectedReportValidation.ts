import type { LocalIncidentDraft } from "@/storage/storageTypes";
import { isRecord } from "../../storage/protected/protectedStorageValidation.ts";
import {
  PROTECTED_REPORT_SCHEMA_VERSION,
  type ProtectedReportStore
} from "./protectedReportTypes.ts";

const priorities = new Set(["Low", "Medium", "High", "Urgent"]);
const statuses = new Set(["draft", "inReview", "followUpRequired", "reviewed", "archived"]);

export function isLocalIncidentDraft(value: unknown): value is LocalIncidentDraft {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.incidentType === "string" &&
    typeof value.occurrenceCategory === "string" &&
    typeof value.date === "string" &&
    typeof value.time === "string" &&
    typeof value.location === "string" &&
    typeof value.priority === "string" &&
    priorities.has(value.priority) &&
    typeof value.followUpRequired === "boolean" &&
    Array.isArray(value.involvedPersons) &&
    Array.isArray(value.personsInvolved) &&
    Array.isArray(value.witnesses) &&
    Array.isArray(value.witnessDetails) &&
    typeof value.notes === "string" &&
    isRecord(value.incidentNotes) &&
    Array.isArray(value.attachments) &&
    Array.isArray(value.attachmentMetadata) &&
    typeof value.status === "string" &&
    statuses.has(value.status) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function isProtectedReportStore(value: unknown): value is ProtectedReportStore {
  if (!isRecord(value)) return false;
  if (
    value.version !== PROTECTED_REPORT_SCHEMA_VERSION ||
    typeof value.userId !== "string" ||
    !Array.isArray(value.drafts) ||
    !value.drafts.every(isLocalIncidentDraft)
  ) {
    return false;
  }
  if (value.migration === undefined) return true;
  if (!isRecord(value.migration)) return false;
  return (
    typeof value.migration.completedAt === "string" &&
    typeof value.migration.legacyOwnerId === "string" &&
    typeof value.migration.sourceCount === "number" &&
    Array.isArray(value.migration.sourceIds) &&
    value.migration.sourceIds.every((id) => typeof id === "string") &&
    typeof value.migration.verifiedAt === "string"
  );
}
