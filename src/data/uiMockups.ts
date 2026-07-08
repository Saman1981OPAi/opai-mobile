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
  { id: "shift", icon: "shield-check-outline", title: "Shift", subtitle: "Ready" },
  { id: "incident", icon: "file-plus-outline", title: "Incident", subtitle: "Report" },
  { id: "ai", icon: "message-text-outline", title: "AI", subtitle: "Ask" },
  { id: "translation", icon: "translate", title: "Translate", subtitle: "Voice" },
  { id: "calendar", icon: "calendar-month-outline", title: "Calendar", subtitle: "Events" },
  { id: "court", icon: "scale-balance", title: "Court", subtitle: "Dates" }
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
