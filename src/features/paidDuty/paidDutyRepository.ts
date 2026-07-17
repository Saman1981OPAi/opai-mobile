import type { PaidDuty, PaidDutyDraft } from "@/features/paidDuty/paidDutyTypes";
import { validatePaidDutyDraft } from "@/features/paidDuty/paidDutyValidation";

function id() {
  return `paid-duty-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const paidDutyRepository = {
  create(input: PaidDutyDraft): PaidDuty {
    const draft = validatePaidDutyDraft(input);
    const now = new Date().toISOString();
    return { ...draft, createdAt: now, id: id(), notificationIds: [], status: "upcoming", updatedAt: now };
  },

  update(existing: PaidDuty, input: PaidDutyDraft): PaidDuty {
    return { ...existing, ...validatePaidDutyDraft(input), updatedAt: new Date().toISOString() };
  },

  duplicate(existing: PaidDuty): PaidDuty {
    const { createdAt: _createdAt, id: _id, notificationIds: _notificationIds, status: _status, updatedAt: _updatedAt, ...draft } = existing;
    return this.create({ ...draft, title: `${existing.title} copy` });
  },

  setCompleted(existing: PaidDuty, completed: boolean): PaidDuty {
    return { ...existing, status: completed ? "completed" : "upcoming", updatedAt: new Date().toISOString() };
  }
};
