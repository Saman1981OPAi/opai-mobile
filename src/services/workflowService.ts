import type { MciIcon } from "@/data/uiMockups";
import type { LocalAppData } from "@/storage/storageTypes";
import type { NotificationCategory, NotificationLeadTime, ScheduledReminder } from "@/types/notifications";
import type {
  CalendarWorkflowEvent,
  CourtWorkflowEvent,
  FollowUpWorkflowReminder,
  FollowUpWorkflowStatus,
  RequalificationWorkflowReminder,
  RequalificationWorkflowStatus,
  TrainingWorkflowEvent,
  WorkflowSummaryItem
} from "@/types/workflow";

const leadTimeOffsets: Record<NotificationLeadTime, number> = {
  "15Minutes": 15 * 60 * 1000,
  "1Day": 24 * 60 * 60 * 1000,
  "1Hour": 60 * 60 * 1000,
  "1Week": 7 * 24 * 60 * 60 * 1000,
  atTime: 0
};

const today = () => new Date().toISOString().slice(0, 10);

function daysUntil(dateString: string): number {
  const start = new Date(`${today()}T00:00:00`);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.ceil((target.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}

function compareByDateTime<T extends { date?: string; dueDate?: string; time?: string }>(a: T, b: T) {
  const aDate = a.date ?? a.dueDate ?? "";
  const bDate = b.date ?? b.dueDate ?? "";
  return `${aDate}T${a.time ?? "00:00"}`.localeCompare(`${bDate}T${b.time ?? "00:00"}`);
}

function itemDateTime(date: string, time: string) {
  return new Date(`${date}T${time || "09:00"}:00`);
}

function scheduledAt(date: string, time: string, leadTime: NotificationLeadTime) {
  const target = itemDateTime(date, time).getTime() - leadTimeOffsets[leadTime];
  return new Date(Math.max(target, Date.now() + 60 * 1000)).toISOString();
}

function statusLabel(status: string) {
  return status
    .replace("dueSoon", "due soon")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function summary(
  id: string,
  icon: MciIcon,
  title: string,
  subtitle: string,
  meta: string,
  status: string,
  accent: string
): WorkflowSummaryItem {
  return { accent, icon, id, meta, status, subtitle, title };
}

function reminder(
  id: string,
  type: NotificationCategory,
  relatedEntityType: ScheduledReminder["relatedEntityType"],
  title: string,
  body: string,
  date: string,
  time: string,
  leadTime: NotificationLeadTime,
  enabled: boolean
): ScheduledReminder {
  const now = new Date().toISOString();

  return {
    body,
    createdAt: now,
    enabled,
    id: `workflow-notification-${id}`,
    relatedEntityId: id,
    relatedEntityType,
    scheduledAt: scheduledAt(date, time, leadTime),
    title,
    type,
    updatedAt: now
  };
}

export const workflowService = {
  today,
  daysUntil,

  sortByDateTime<T extends { date?: string; dueDate?: string; time?: string }>(items: T[]) {
    return [...items].sort(compareByDateTime);
  },

  calculateRequalificationStatus(item: RequalificationWorkflowReminder): RequalificationWorkflowStatus {
    if (item.status === "completed") {
      return "completed";
    }

    const days = daysUntil(item.dueDate);
    if (days < 0) {
      return "overdue";
    }
    if (days <= 30) {
      return "dueSoon";
    }
    return "valid";
  },

  calculateFollowUpStatus(item: FollowUpWorkflowReminder): FollowUpWorkflowStatus {
    if (item.status === "completed") {
      return "completed";
    }
    return daysUntil(item.dueDate) < 0 ? "overdue" : "open";
  },

  getHomeSummary(localData: LocalAppData): WorkflowSummaryItem[] {
    const upcomingCourt = workflowService
      .sortByDateTime(localData.courtWorkflowEvents)
      .find((item) => item.status === "upcoming");
    const upcomingTraining = workflowService
      .sortByDateTime(localData.trainingWorkflowEvents)
      .find((item) => item.status === "upcoming");
    const dueRequalification = workflowService
      .sortByDateTime(localData.requalificationWorkflowReminders)
      .find((item) => workflowService.calculateRequalificationStatus(item) !== "valid");
    const todayFollowUps = localData.followUpWorkflowReminders.filter(
      (item) => workflowService.calculateFollowUpStatus(item) === "open" && daysUntil(item.dueDate) <= 0
    );
    const todayCalendar = localData.calendarWorkflowEvents.filter((item) => item.status === "upcoming" && item.date === today());

    return [
      upcomingCourt
        ? summary(
            "home-court",
            "scale-balance",
            "Next court",
            `${upcomingCourt.time} - ${upcomingCourt.courtroom}`,
            upcomingCourt.date,
            statusLabel(upcomingCourt.status),
            "#B56CFF"
          )
        : null,
      upcomingTraining
        ? summary(
            "home-training",
            "school-outline",
            "Next training",
            `${upcomingTraining.time} - ${upcomingTraining.category}`,
            upcomingTraining.date,
            statusLabel(upcomingTraining.status),
            "#4DA3FF"
          )
        : null,
      dueRequalification
        ? summary(
            "home-requalification",
            "target",
            "Qualification",
            dueRequalification.title,
            dueRequalification.dueDate,
            statusLabel(workflowService.calculateRequalificationStatus(dueRequalification)),
            "#7FFFD4"
          )
        : null,
      summary(
        "home-followups",
        "clipboard-check-outline",
        "Follow-ups",
        todayFollowUps.length > 0 ? `${todayFollowUps.length} due today` : "No urgent follow-ups",
        today(),
        todayFollowUps.length > 0 ? "Open" : "Clear",
        "#FFD166"
      ),
      summary(
        "home-calendar",
        "calendar-month-outline",
        "Today",
        todayCalendar.length > 0 ? `${todayCalendar.length} calendar items` : "No calendar items",
        today(),
        "Local",
        "#0A84FF"
      )
    ].filter((item): item is WorkflowSummaryItem => Boolean(item));
  },

  getShiftReadinessSummary(localData: LocalAppData): WorkflowSummaryItem[] {
    const courtToday = localData.courtWorkflowEvents.filter((item) => item.status === "upcoming" && item.date === today());
    const trainingToday = localData.trainingWorkflowEvents.filter((item) => item.status === "upcoming" && item.date === today());
    const requalificationDueSoon = localData.requalificationWorkflowReminders.filter(
      (item) => workflowService.calculateRequalificationStatus(item) === "dueSoon"
    );
    const followUpsToday = localData.followUpWorkflowReminders.filter(
      (item) => workflowService.calculateFollowUpStatus(item) === "open" && daysUntil(item.dueDate) <= 0
    );
    const calendarToday = localData.calendarWorkflowEvents.filter((item) => item.status === "upcoming" && item.date === today());

    return [
      summary("shift-court", "scale-balance", "Court today", `${courtToday.length} reminders`, "Verify", "Optional", "#B56CFF"),
      summary("shift-training", "school-outline", "Training today", `${trainingToday.length} items`, "Verify", "Optional", "#4DA3FF"),
      summary("shift-requal", "target", "Due soon", `${requalificationDueSoon.length} qualifications`, "Review", "Optional", "#7FFFD4"),
      summary("shift-followups", "clipboard-check-outline", "Follow-ups", `${followUpsToday.length} due today`, "Review", "Optional", "#FFD166"),
      summary("shift-calendar", "calendar-outline", "Calendar", `${calendarToday.length} items today`, "Local", "Optional", "#0A84FF")
    ];
  },

  createCalendarReminder(item: CalendarWorkflowEvent): ScheduledReminder {
    const type: NotificationCategory =
      item.type === "Court"
        ? "courtReminder"
        : item.type === "Training"
          ? "trainingReminder"
          : item.type === "Requalification"
            ? "requalificationReminder"
            : item.type === "Follow-up"
              ? "followUpReminder"
              : "calendarEventReminder";

    return reminder(
      item.id,
      type,
      "calendar",
      item.title,
      `${item.type} at ${item.time}. Verify details through authorized systems.`,
      item.date,
      item.time,
      item.reminderLeadTime,
      item.reminderEnabled
    );
  },

  createCourtReminder(item: CourtWorkflowEvent): ScheduledReminder {
    return reminder(
      item.id,
      "courtReminder",
      "court",
      item.matterName,
      `${item.courtName} ${item.courtroom} at ${item.time}. Verify official court details through authorized systems.`,
      item.date,
      item.time,
      item.reminderLeadTime,
      item.reminderEnabled
    );
  },

  createTrainingReminder(item: TrainingWorkflowEvent): ScheduledReminder {
    return reminder(
      item.id,
      "trainingReminder",
      "training",
      item.title,
      `${item.category} at ${item.time}. Confirm official training details through authorized systems.`,
      item.date,
      item.time,
      item.reminderLeadTime,
      item.reminderEnabled
    );
  },

  createRequalificationReminder(item: RequalificationWorkflowReminder): ScheduledReminder {
    return reminder(
      item.id,
      "requalificationReminder",
      "requalification",
      item.title,
      `${item.category} due ${item.dueDate}. Verify official qualification requirements.`,
      item.dueDate,
      "09:00",
      item.reminderLeadTime,
      item.reminderEnabled
    );
  },

  createFollowUpReminder(item: FollowUpWorkflowReminder): ScheduledReminder {
    return reminder(
      item.id,
      "followUpReminder",
      "followUp",
      item.title,
      `Follow-up due ${item.dueDate}. Verify official obligations through authorized systems.`,
      item.dueDate,
      "09:00",
      item.reminderLeadTime,
      item.reminderEnabled
    );
  },

  validateRequired(fields: Record<string, string>) {
    return Object.entries(fields)
      .filter(([, value]) => value.trim().length === 0)
      .map(([key]) => key);
  },

  statusLabel
};

