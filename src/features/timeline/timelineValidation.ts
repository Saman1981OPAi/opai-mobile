import { isRecord } from "../../storage/protected/protectedStorageValidation.ts";
import { TIMELINE_SCHEMA_VERSION, type OperationalTimeline, type TimelineStore } from "./timelineTypes.ts";

export function isOperationalTimeline(value: unknown): value is OperationalTimeline {
  if (!isRecord(value)) return false;
  return (
    (value.archivedAt === null || typeof value.archivedAt === "string") &&
    typeof value.createdAt === "string" &&
    Array.isArray(value.events) &&
    value.events.every((event) => isRecord(event) && typeof event.id === "string" && typeof event.date === "string" && typeof event.time === "string" && typeof event.description === "string" && typeof event.order === "number" && ["exact", "approximate", "unknown"].includes(String(event.timeKind))) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function isTimelineStore(value: unknown): value is TimelineStore {
  return isRecord(value) && value.version === TIMELINE_SCHEMA_VERSION && typeof value.userId === "string" && Array.isArray(value.timelines) && value.timelines.every(isOperationalTimeline);
}

