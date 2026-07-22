import assert from "node:assert/strict";
import test from "node:test";
import { duplicateTimelineTimes, sortTimelineEvents, timelineToText } from "./timelineCore.ts";

const events = [
  { date: "2026-07-22", description: "Second synthetic event", id: "2", order: 2, time: "00:05", timeKind: "exact" as const },
  { date: "2026-07-21", description: "First synthetic event", id: "1", order: 1, time: "23:55", timeKind: "approximate" as const }
];

test("timeline sorts across midnight and preserves approximation", () => {
  assert.deepEqual(sortTimelineEvents(events).map((event) => event.id), ["1", "2"]);
  assert.match(timelineToText("Synthetic timeline", events), /Approximately 2026-07-21 23:55/);
});

test("timeline reports duplicate timestamps", () => {
  assert.equal(duplicateTimelineTimes([...events, { ...events[0]!, id: "3" }]).has("2026-07-22:00:05"), true);
});
