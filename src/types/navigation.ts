export type ModuleId =
  | "dashboard"
  | "shift"
  | "incident"
  | "translation"
  | "calendar"
  | "ai"
  | "court"
  | "training"
  | "notes"
  | "notifications"
  | "settings";

export type ModulePriority = "primary" | "secondary";

export type AppModule = {
  id: ModuleId;
  label: string;
  shortLabel: string;
  icon: string;
  priority: ModulePriority;
  summary: string;
};

export type ReminderStatus = "optional" | "important" | "urgent";

export type ReminderItem = {
  id: string;
  title: string;
  detail: string;
  status: ReminderStatus;
};
