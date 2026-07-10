import type { ReminderItem } from "@/types/navigation";

export const shiftReminders: ReminderItem[] = [
  { id: "cruiser-condition", title: "Check cruiser condition", detail: "Walkaround, fuel, visible damage, safety readiness.", status: "important" },
  { id: "cruiser-equipment", title: "Check cruiser equipment", detail: "Confirm required operational equipment is present.", status: "important" },
  { id: "cew", title: "Test CEW", detail: "Confirm battery, cartridge status, and policy requirements.", status: "urgent" },
  { id: "duty-pistol", title: "Check duty pistol", detail: "Confirm secure carry condition and readiness.", status: "urgent" },
  { id: "magazines", title: "Check magazines", detail: "Confirm duty magazines and required loadout.", status: "important" },
  { id: "rifle", title: "Grab rifle if required", detail: "Reminder only when assignment or policy requires it.", status: "optional" },
  { id: "radio", title: "Check radio", detail: "Battery, channel, microphone, and dispatch connectivity.", status: "important" },
  { id: "mdt", title: "Check MDT", detail: "Login, connectivity, and workflow access.", status: "important" },
  { id: "body-camera", title: "Check body camera if applicable", detail: "Battery, storage, mount, and activation policy.", status: "optional" },
  { id: "follow-ups", title: "Review follow-ups", detail: "Open tasks, victim contact, statements, and reports.", status: "important" },
  { id: "workflow", title: "Review workflow", detail: "Shift priorities, calls, assignments, and deadlines.", status: "optional" },
  { id: "court", title: "Check court schedule", detail: "Appearances, preparation windows, and file reminders.", status: "urgent" },
  { id: "training", title: "Check training schedule", detail: "Courses, annual training, and upcoming sessions.", status: "important" },
  { id: "requalification", title: "Check requalification deadlines", detail: "Firearms, Use of Force, CEW, CPR, and First Aid.", status: "urgent" }
];

export const aiActions = [
  "Report Writing",
  "Review Report",
  "Draft Report",
  "Review Grounds",
  "Search Criminal Code",
  "Search Case Law",
  "Translate Conversation",
  "Calendar Assistant",
  "Court Assistant",
  "Training Assistant",
  "Policy Search",
  "Summarize Notes",
  "Scan Document",
  "Attach Evidence",
  "Generate Follow-Up List"
];

export const incidentFields = [
  "Incident type",
  "Date/time",
  "Location",
  "Persons involved",
  "Witnesses",
  "Notes",
  "Photos",
  "Documents",
  "Audio",
  "Evidence references",
  "AI report drafting support"
];

export const translationModes = [
  "Text translation",
  "Voice translation",
  "Conversation mode",
  "Document translation",
  "Camera translation / OCR",
  "Language selection",
  "Police-context translation"
];

export const calendarItems = [
  { title: "Court date", time: "Today, 13:30", tone: "urgent" },
  { title: "Use of Force requalification", time: "Friday, 09:00", tone: "important" },
  { title: "Follow-up deadline", time: "Tomorrow, 16:00", tone: "important" },
  { title: "CPR / First Aid renewal", time: "Next week", tone: "optional" }
] as const;

export const privacySettings = [
  "Biometric login",
  "Calendar consent",
  "Camera consent",
  "Microphone consent",
  "File access consent",
  "Notification preferences",
  "Audit log visibility",
  "Sensitive preview protection"
];
