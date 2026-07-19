export type ReminderPreviewKind = "court" | "system" | "training";

export type ReminderPreviewContent = {
  body: string;
  title: string;
};

const reminderPreviewContent: Record<ReminderPreviewKind, ReminderPreviewContent> = {
  court: {
    body: "Verify court details through authorized systems.",
    title: "Court reminder"
  },
  system: {
    body: "This reminder was scheduled locally on this device.",
    title: "OPAi reminder"
  },
  training: {
    body: "Confirm training details through authorized systems.",
    title: "Training reminder"
  }
};

export function getReminderPreviewContent(
  kind: ReminderPreviewKind
): ReminderPreviewContent {
  return reminderPreviewContent[kind];
}
