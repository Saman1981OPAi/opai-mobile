import type { CanvassEntryDraft, CanvassSessionDraft } from "@/features/canvass/canvassTypes";

export function validateCanvassSession(input: CanvassSessionDraft) {
  const title = input.title.trim();
  if (!title) throw new Error("Add a canvass title.");
  if (title.length > 80) throw new Error("Keep the canvass title under 80 characters.");
  return { ...input, title };
}

export function validateCanvassEntry(input: CanvassEntryDraft) {
  const address = input.address.trim();
  const notes = input.notes.trim();
  if (!address) throw new Error("Add an address or location reference.");
  if (address.length > 180 || notes.length > 2_000) throw new Error("Shorten the address or notes.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) {
    throw new Error("Use YYYY-MM-DD for the date and HH:MM for the time.");
  }
  return { ...input, address, notes };
}
