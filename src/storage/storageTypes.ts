import type { MciIcon } from "@/data/uiMockups";
import type { AuthStatus, ConsentState, MockUserProfile, NotificationPreferences } from "@/types/auth";
import type { AIConversation, AIPreferences } from "@/types/ai";
import type {
  IncidentAttachmentMetadata,
  IncidentDraftStatus,
  IncidentNotes,
  IncidentPerson,
  IncidentPriority,
  IncidentWitness
} from "@/types/incident";
import type { NotificationPreference, ScheduledReminder } from "@/types/notifications";
import type { LocalFileMetadataPlaceholder, LocalNoteFolder, LocalStructuredNote } from "@/types/notesFiles";
import type { TranslationPreferences, TranslationRecord } from "@/types/translation";
import type {
  CalendarWorkflowEvent,
  CourtWorkflowEvent,
  FollowUpWorkflowReminder,
  RequalificationWorkflowReminder,
  TrainingWorkflowEvent
} from "@/types/workflow";

export type LocalAuthSession = {
  status: AuthStatus;
  profile: MockUserProfile | null;
  consent: ConsentState;
  biometricPreference: "disabled" | "faceId" | "touchId" | "deviceBiometrics";
  notificationPreferences: NotificationPreferences;
  lastSignedInAt: string | null;
};

export type LocalPreferences = {
  preferredLanguage: string;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  theme: "dark";
  ptsdRemindersEnabled: boolean;
  consentStatus: ConsentState;
};

export type LocalReminderCard = {
  id: string;
  icon: MciIcon;
  title: string;
  subtitle: string;
  enabled: boolean;
  category: "shift" | "court" | "training" | "followUp";
};

export type LocalCalendarEvent = {
  id: string;
  accent: string;
  date: string;
  icon: MciIcon;
  meta: string;
  time: string;
  title: string;
  reminderEnabled: boolean;
  kind: "court" | "training" | "followUp" | "meeting" | "shift";
};

export type LocalAttachmentMetadata = {
  id: string;
  fileName: string;
  fileType: "photo" | "document" | "audio" | "reference" | "video" | "other";
  addedAt: string;
  localOnly: true;
};

export type LocalIncidentDraft = {
  id: string;
  incidentType: string;
  occurrenceCategory: string;
  date: string;
  time: string;
  location: string;
  priority: IncidentPriority;
  followUpRequired: boolean;
  involvedPersons: string[];
  personsInvolved: IncidentPerson[];
  witnesses: string[];
  witnessDetails: IncidentWitness[];
  notes: string;
  incidentNotes: IncidentNotes;
  attachments: LocalAttachmentMetadata[];
  attachmentMetadata: IncidentAttachmentMetadata[];
  status: IncidentDraftStatus;
  createdAt: string;
  updatedAt: string;
};

export type LocalNoteFileMetadata = {
  id: string;
  icon: MciIcon;
  title: string;
  subtitle: string;
  fileType: "note" | "photo" | "folder" | "audio" | "document";
  referenceOnly: true;
  updatedAt: string;
};

export type LocalAppData = {
  version: number;
  seededAt: string;
  updatedAt: string;
  auth: LocalAuthSession;
  preferences: LocalPreferences;
  shiftReminders: LocalReminderCard[];
  incidentDrafts: LocalIncidentDraft[];
  notesFiles: LocalNoteFileMetadata[];
  structuredNotes: LocalStructuredNote[];
  noteFolders: LocalNoteFolder[];
  fileMetadataPlaceholders: LocalFileMetadataPlaceholder[];
  calendarEvents: LocalCalendarEvent[];
  courtReminders: LocalReminderCard[];
  trainingReminders: LocalReminderCard[];
  followUpReminders: LocalReminderCard[];
  aiHistory: AIConversation[];
  aiPreferences: AIPreferences;
  translationHistory: TranslationRecord[];
  translationPreferences: TranslationPreferences;
  notificationPreference: NotificationPreference;
  scheduledReminders: ScheduledReminder[];
  calendarWorkflowEvents: CalendarWorkflowEvent[];
  courtWorkflowEvents: CourtWorkflowEvent[];
  trainingWorkflowEvents: TrainingWorkflowEvent[];
  requalificationWorkflowReminders: RequalificationWorkflowReminder[];
  followUpWorkflowReminders: FollowUpWorkflowReminder[];
};
