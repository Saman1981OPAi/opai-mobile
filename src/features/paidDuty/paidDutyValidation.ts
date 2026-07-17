import type { PaidDutyDraft } from "@/features/paidDuty/paidDutyTypes";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function zonedParts(timestamp: number, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    timeZone: timezone,
    year: "numeric"
  }).formatToParts(new Date(timestamp));
  const value = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
  return Date.UTC(value.year!, value.month! - 1, value.day!, value.hour!, value.minute!);
}

export function paidDutyStart(draft: Pick<PaidDutyDraft, "date" | "startTime" | "timezone">) {
  if (!datePattern.test(draft.date) || !timePattern.test(draft.startTime)) {
    throw new Error("Use YYYY-MM-DD for the date and HH:MM for the start time.");
  }
  const [year, month, day] = draft.date.split("-").map(Number);
  const [hour, minute] = draft.startTime.split(":").map(Number);
  const wallClock = Date.UTC(year!, month! - 1, day!, hour!, minute!);
  let timestamp = wallClock;
  try {
    for (let pass = 0; pass < 3; pass += 1) timestamp += wallClock - zonedParts(timestamp, draft.timezone);
  } catch {
    throw new Error("The selected timezone is not available on this device.");
  }
  if (zonedParts(timestamp, draft.timezone) !== wallClock) throw new Error("The duty time does not exist in the selected timezone.");
  return new Date(timestamp);
}

export function validatePaidDutyDraft(draft: PaidDutyDraft): PaidDutyDraft {
  const title = draft.title.trim();
  const location = draft.location.trim();
  if (!title) throw new Error("Add a paid duty title.");
  if (!location) throw new Error("Add a duty location.");
  if (title.length > 80 || location.length > 160) throw new Error("Shorten the title or location.");
  paidDutyStart(draft);
  if (draft.endTime && !timePattern.test(draft.endTime)) throw new Error("Use HH:MM for the end time.");
  return {
    ...draft,
    title,
    location,
    reminderOffsets: [...new Set(draft.reminderOffsets.filter((value) => Number.isFinite(value) && value >= 0))].sort((a, b) => b - a)
  };
}
