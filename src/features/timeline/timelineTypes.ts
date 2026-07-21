export const TIMELINE_SCHEMA_VERSION = 1;

export type TimelineTimeKind = "exact" | "approximate" | "unknown";

export type TimelineEvent = {
  date: string;
  description: string;
  id: string;
  order: number;
  time: string;
  timeKind: TimelineTimeKind;
};

export type OperationalTimeline = {
  archivedAt: string | null;
  createdAt: string;
  events: TimelineEvent[];
  id: string;
  title: string;
  updatedAt: string;
};

export type TimelineStore = {
  timelines: OperationalTimeline[];
  userId: string;
  version: typeof TIMELINE_SCHEMA_VERSION;
};
