import type { CanvassEntry, CanvassEntryDraft, CanvassSession, CanvassSessionDraft } from "@/features/canvass/canvassTypes";
import { validateCanvassEntry, validateCanvassSession } from "@/features/canvass/canvassValidation";

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const canvassRepository = {
  createSession(input: CanvassSessionDraft): CanvassSession {
    const draft = validateCanvassSession(input);
    const now = new Date().toISOString();
    return { ...draft, createdAt: now, id: id("canvass"), startedAt: now, updatedAt: now };
  },

  updateSession(existing: CanvassSession, input: CanvassSessionDraft): CanvassSession {
    return { ...existing, ...validateCanvassSession(input), updatedAt: new Date().toISOString() };
  },

  setSessionCompleted(existing: CanvassSession, completed: boolean): CanvassSession {
    const { completedAt: _completedAt, ...retained } = existing;
    return { ...retained, ...(completed ? { completedAt: new Date().toISOString() } : {}), updatedAt: new Date().toISOString() };
  },

  createEntry(input: CanvassEntryDraft): CanvassEntry {
    const draft = validateCanvassEntry(input);
    const now = new Date().toISOString();
    return { ...draft, createdAt: now, id: id("canvass-entry"), updatedAt: now };
  },

  updateEntry(existing: CanvassEntry, input: CanvassEntryDraft): CanvassEntry {
    return { ...existing, ...validateCanvassEntry(input), updatedAt: new Date().toISOString() };
  }
};
