import type { AppModule } from "@/types/navigation";

export const modules: AppModule[] = [
  {
    id: "dashboard",
    label: "Home Dashboard",
    shortLabel: "Home",
    icon: "HM",
    priority: "primary",
    summary: "A calm operational overview for shift readiness, reminders, and AI actions."
  },
  {
    id: "shift",
    label: "Start My Shift",
    shortLabel: "Shift",
    icon: "SH",
    priority: "primary",
    summary: "Review duty reminders without a forced checklist or administrative burden."
  },
  {
    id: "incident",
    label: "Report Writing",
    shortLabel: "Report",
    icon: "IN",
    priority: "primary",
    summary: "Create local report drafts with notes, people, reminders, and AI review placeholders."
  },
  {
    id: "deviceTesting",
    label: "Device Testing",
    shortLabel: "Device Tests",
    icon: "DT",
    priority: "primary",
    summary: "Open verified local guide workflows for police equipment testing and references."
  },
  {
    id: "translation",
    label: "Translation",
    shortLabel: "Translate",
    icon: "TR",
    priority: "primary",
    summary: "Text, voice, conversation, document, and camera translation for police contexts."
  },
  {
    id: "ai",
    label: "AI Assistant",
    shortLabel: "AI",
    icon: "AI",
    priority: "primary",
    summary: "Nori-inspired active AI panel for police-focused drafting, review, search, and summaries."
  },
  {
    id: "calendar",
    label: "Calendar",
    shortLabel: "Calendar",
    icon: "CA",
    priority: "secondary",
    summary: "Court, meeting, shift, follow-up, and training schedules in one AI-assisted view."
  },
  {
    id: "court",
    label: "Court",
    shortLabel: "Court",
    icon: "CT",
    priority: "secondary",
    summary: "Court dates, preparation windows, reminders, and follow-up deadlines."
  },
  {
    id: "training",
    label: "Training & Requalification",
    shortLabel: "Training",
    icon: "TN",
    priority: "secondary",
    summary: "Track firearms, Use of Force, CEW, CPR, First Aid, and annual requalification."
  },
  {
    id: "notes",
    label: "Notes & Files",
    shortLabel: "Files",
    icon: "NF",
    priority: "secondary",
    summary: "Organize notes, photos, audio, documents, and evidence references."
  },
  {
    id: "notifications",
    label: "Notifications",
    shortLabel: "Alerts",
    icon: "!",
    priority: "secondary",
    summary: "Standard reminders, persistent reminders, and optional call-style critical alerts."
  },
  {
    id: "settings",
    label: "Settings",
    shortLabel: "Settings",
    icon: "ST",
    priority: "secondary",
    summary: "Security, permissions, privacy, biometrics, account, and notification preferences."
  }
];
