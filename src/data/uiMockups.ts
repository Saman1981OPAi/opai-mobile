import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ModuleId } from "@/types/navigation";

export type MciIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type Feature = {
  id: ModuleId;
  icon: MciIcon;
  title: string;
  subtitle: string;
};

export const homeFeatures: Feature[] = [
  { id: "shift", icon: "shield-check-outline", title: "Start Shift", subtitle: "Ready" },
  { id: "incident", icon: "file-plus-outline", title: "Report", subtitle: "Draft" },
  { id: "translation", icon: "translate", title: "Translate", subtitle: "Voice" },
  { id: "calendar", icon: "calendar-month-outline", title: "Calendar", subtitle: "Events" },
  { id: "ai", icon: "message-text-outline", title: "OPAi", subtitle: "Ask" },
  { id: "court", icon: "scale-balance", title: "Court", subtitle: "Dates" },
  { id: "training", icon: "school-outline", title: "Training", subtitle: "Renewals" },
  { id: "settings", icon: "cog-outline", title: "Settings", subtitle: "Prefs" }
];

export const shiftReminders = [
  { icon: "car" as MciIcon, title: "Cruiser", subtitle: "Condition" },
  { icon: "shield-account-outline" as MciIcon, title: "Gear", subtitle: "Equipment" },
  { icon: "radio-handheld" as MciIcon, title: "Radio", subtitle: "Channel" },
  { icon: "camera-outline" as MciIcon, title: "Body Camera", subtitle: "Status" },
  { icon: "scale-balance" as MciIcon, title: "Court", subtitle: "Schedule" },
  { icon: "target" as MciIcon, title: "Qualifications", subtitle: "Deadlines" }
];

export const incidentSteps = [
  { icon: "map-marker-outline" as MciIcon, title: "Location", subtitle: "Address or scene" },
  { icon: "account-group-outline" as MciIcon, title: "People", subtitle: "Parties and witnesses" },
  { icon: "note-text-outline" as MciIcon, title: "Notes", subtitle: "Officer observations" },
  { icon: "camera-plus-outline" as MciIcon, title: "Media", subtitle: "Photos, audio, files" },
  { icon: "paperclip" as MciIcon, title: "Evidence", subtitle: "References" },
  { icon: "clipboard-check-outline" as MciIcon, title: "Follow-Up", subtitle: "Tasks" }
];

export const aiTools = [
  { icon: "microphone-outline" as MciIcon, title: "Talk to AI", subtitle: "Voice command" },
  { icon: "file-search-outline" as MciIcon, title: "Review Report", subtitle: "Clarity check" },
  { icon: "scale-balance" as MciIcon, title: "Criminal Code", subtitle: "Reference" },
  { icon: "note-text-outline" as MciIcon, title: "Summarize", subtitle: "Short notes" },
  { icon: "paperclip" as MciIcon, title: "Evidence", subtitle: "Organize" },
  { icon: "pencil-outline" as MciIcon, title: "Draft", subtitle: "Report outline" }
];

export const translationModes = [
  { icon: "text-box-outline" as MciIcon, title: "Text", subtitle: "Translate" },
  { icon: "microphone-outline" as MciIcon, title: "Voice", subtitle: "Speak" },
  { icon: "camera-outline" as MciIcon, title: "Camera", subtitle: "OCR" },
  { icon: "file-document-outline" as MciIcon, title: "Document", subtitle: "Scan" },
  { icon: "account-voice" as MciIcon, title: "Conversation", subtitle: "Live" },
  { icon: "shield-search" as MciIcon, title: "Police Context", subtitle: "Terms" }
];

export const calendarEvents = [
  {
    accent: "#B76BFF",
    date: "Tomorrow",
    icon: "scale-balance" as MciIcon,
    meta: "Courtroom 3",
    time: "09:00",
    title: "Court"
  },
  {
    accent: "#62D26F",
    date: "May 28",
    icon: "target" as MciIcon,
    meta: "Range 2",
    time: "08:00",
    title: "Firearms"
  },
  {
    accent: "#FFC53D",
    date: "May 29",
    icon: "clipboard-check-outline" as MciIcon,
    meta: "Witness statement",
    time: "14:00",
    title: "Follow-Up"
  }
];

export const secondaryModules: Feature[] = [
  { id: "court", icon: "scale-balance", title: "Court", subtitle: "Reminders" },
  { id: "training", icon: "school-outline", title: "Training", subtitle: "Qualifications" },
  { id: "settings", icon: "cog-outline", title: "Settings", subtitle: "Preferences" }
];

export const courtReminders = [
  { icon: "scale-balance" as MciIcon, title: "Court Appearance", subtitle: "R. v. Johnson - 09:00" },
  { icon: "file-document-check-outline" as MciIcon, title: "Disclosure Review", subtitle: "Before tomorrow" },
  { icon: "account-voice" as MciIcon, title: "Witness Follow-Up", subtitle: "Statement confirmation" }
];

export const trainingReminders = [
  { icon: "target" as MciIcon, title: "Firearms", subtitle: "Annual requalification" },
  { icon: "shield-alert-outline" as MciIcon, title: "Use of Force", subtitle: "Renewal window" },
  { icon: "medical-bag" as MciIcon, title: "First Aid", subtitle: "Certificate review" }
];

export const followUpReminders = [
  { icon: "clipboard-check-outline" as MciIcon, title: "Witness Note", subtitle: "Report #25-01873" },
  { icon: "camera-outline" as MciIcon, title: "Evidence Photos", subtitle: "Attach before draft" },
  { icon: "calendar-clock" as MciIcon, title: "Supervisor Review", subtitle: "Follow-up" }
];

export const incidentExamples = [
  { icon: "car-emergency" as MciIcon, title: "Traffic Stop", subtitle: "Local example" },
  { icon: "home-alert-outline" as MciIcon, title: "Disturbance", subtitle: "Report workflow" },
  { icon: "walk" as MciIcon, title: "Foot Patrol", subtitle: "Report template" }
];

export const translationExamples = [
  { icon: "translate" as MciIcon, title: "English to French", subtitle: "Sample phrase" },
  { icon: "microphone-outline" as MciIcon, title: "Voice Prompt", subtitle: "Tap to preview" },
  { icon: "camera-outline" as MciIcon, title: "Sign OCR", subtitle: "Camera translation" }
];

export const notesFiles = [
  { icon: "note-text-outline" as MciIcon, title: "Shift Notes", subtitle: "3 local samples" },
  { icon: "image-outline" as MciIcon, title: "Photos", subtitle: "Photo references" },
  { icon: "folder-lock-outline" as MciIcon, title: "Case Folder", subtitle: "Local records" }
];

export const settingsItems = [
  { icon: "bell-outline" as MciIcon, title: "Notifications", subtitle: "Reminder preferences" },
  { icon: "shield-lock-outline" as MciIcon, title: "Privacy", subtitle: "Consent controls" },
  { icon: "palette-outline" as MciIcon, title: "Appearance", subtitle: "Dark theme" },
  { icon: "information-outline" as MciIcon, title: "About OPAi", subtitle: "Product information" }
];
