import { notificationPermissionService } from "@/services/notificationPermissionService";
import { notificationScheduler } from "@/services/notificationScheduler";
import type { PaidDuty } from "@/features/paidDuty/paidDutyTypes";
import { paidDutyStart } from "@/features/paidDuty/paidDutyValidation";

export const paidDutyReminderChoices = [
  { label: "1 week", minutes: 7 * 24 * 60 },
  { label: "24 hours", minutes: 24 * 60 },
  { label: "2 hours", minutes: 2 * 60 },
  { label: "30 minutes", minutes: 30 }
] as const;

async function cancelIds(ids: string[]) {
  await Promise.all(ids.map((notificationId) => notificationScheduler.cancelLocalNotification(notificationId).catch(() => undefined)));
}

export const paidDutyReminderService = {
  async cancel(duty: PaidDuty) {
    await cancelIds(duty.notificationIds);
    return { ...duty, notificationIds: [], updatedAt: new Date().toISOString() };
  },

  async synchronize(duty: PaidDuty, previousNotificationIds: string[] = []): Promise<PaidDuty> {
    await cancelIds([...new Set([...previousNotificationIds, ...duty.notificationIds])]);
    if (duty.status === "completed" || duty.reminderOffsets.length === 0) {
      return { ...duty, notificationIds: [], updatedAt: new Date().toISOString() };
    }

    let permission = await notificationPermissionService.checkPermissionStatus();
    if (permission !== "granted") permission = await notificationPermissionService.requestPermission();
    if (permission !== "granted") throw new Error("Notification permission was not granted. The paid duty was saved without reminders.");

    const start = paidDutyStart(duty).getTime();
    const now = Date.now();
    const ids: string[] = [];
    for (const minutes of [...new Set(duty.reminderOffsets)]) {
      const scheduledAt = start - minutes * 60 * 1000;
      if (scheduledAt <= now + 5_000) continue;
      const notificationId = await notificationScheduler.scheduleLocalNotification({
        body: `Your scheduled paid duty begins at ${duty.startTime}.`,
        data: { relatedEntityId: duty.id, relatedEntityType: "paidDuty", type: "paidDutyReminder" },
        id: `paid-duty-${duty.id}-${minutes}`,
        scheduledAt: new Date(scheduledAt).toISOString(),
        title: "Paid duty reminder"
      });
      ids.push(notificationId);
    }
    return { ...duty, notificationIds: ids, updatedAt: new Date().toISOString() };
  }
};
