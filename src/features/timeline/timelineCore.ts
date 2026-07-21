import type { TimelineEvent } from "./timelineTypes.ts";

function timestamp(event: TimelineEvent) {
  if (event.timeKind === "unknown" || !/^\d{2}:\d{2}$/.test(event.time)) return Number.MAX_SAFE_INTEGER;
  const value = new Date(`${event.date}T${event.time}:00`);
  const milliseconds = value.getTime();
  return Number.isNaN(milliseconds) ? Number.MAX_SAFE_INTEGER : milliseconds;
}

export function sortTimelineEvents(events: TimelineEvent[]) {
  return [...events].sort((left, right) => timestamp(left) - timestamp(right) || left.order - right.order);
}

export function duplicateTimelineTimes(events: TimelineEvent[]) {
  const counts = new Map<string, number>();
  for (const event of events) {
    if (event.timeKind === "unknown") continue;
    const key = `${event.date}:${event.time}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return new Set([...counts].filter(([, count]) => count > 1).map(([key]) => key));
}

export function timelineToText(title: string, events: TimelineEvent[]) {
  return [title, ...sortTimelineEvents(events).map((event) => {
    const time = event.timeKind === "unknown"
      ? "Time unknown"
      : `${event.timeKind === "approximate" ? "Approximately " : ""}${event.date} ${event.time}`;
    return `${time} - ${event.description.trim()}`;
  })].join("\n");
}
