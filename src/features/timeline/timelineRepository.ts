import { protectedStorage } from "@/storage/protected/protectedStorage";
import { TIMELINE_SCHEMA_VERSION, type OperationalTimeline, type TimelineStore } from "./timelineTypes";
import { isTimelineStore, isOperationalTimeline } from "./timelineValidation";

const namespace = "operational-timelines";
function options(userId: string) {
  return { namespace, schemaVersion: TIMELINE_SCHEMA_VERSION, userId, validate: isTimelineStore };
}

export const timelineRepository = {
  async clear(userId: string) { await protectedStorage.remove(options(userId)); },
  async list(userId: string) { return (await protectedStorage.load(options(userId)))?.data.timelines ?? []; },
  async remove(userId: string, id: string) { await this.save(userId, (await this.list(userId)).filter((item) => item.id !== id)); },
  async save(userId: string, timelines: OperationalTimeline[]) {
    if (!timelines.every(isOperationalTimeline)) throw new Error("Timeline data is invalid.");
    const store: TimelineStore = { timelines, userId, version: TIMELINE_SCHEMA_VERSION };
    await protectedStorage.save(options(userId), store);
  },
  async upsert(userId: string, timeline: OperationalTimeline) {
    const timelines = await this.list(userId);
    await this.save(userId, [timeline, ...timelines.filter((item) => item.id !== timeline.id)]);
  }
};

