import { emptyConsentState, mockUserProfile } from "@/data/authMock";
import { calendarEvents, followUpReminders, incidentExamples, notesFiles, trainingReminders } from "@/data/uiMockups";
import { CURRENT_STORAGE_VERSION } from "@/storage/storageKeys";
import type {
  LocalAppData,
  LocalAuthSession,
  LocalCalendarEvent,
  LocalDemoHistoryItem,
  LocalIncidentDraft,
  LocalNoteFileMetadata,
  LocalReminderCard
} from "@/storage/storageTypes";
import type { NotificationCategory, NotificationPreference, ScheduledReminder } from "@/types/notifications";

const nowIso = () => new Date().toISOString();

const defaultNotificationPreferences = {
  courtReminders: true,
  shiftReminders: true,
  trainingReminders: true,
  wellnessReminders: true
};

const notificationCategories: NotificationCategory[] = [
  "courtReminder",
  "trainingReminder",
  "requalificationReminder",
  "startShiftReminder",
  "followUpReminder",
  "calendarEventReminder",
  "systemReminder"
];

export function createDefaultNotificationPreference(): NotificationPreference {
  const createdAt = nowIso();
  return {
    calendarEventRemindersEnabled: true,
    courtRemindersEnabled: true,
    enabled: false,
    followUpRemindersEnabled: true,
    lastUpdatedAt: createdAt,
    permissionPromptSeen: false,
    permissionStatus: "unknown",
    reminderLeadTimes: notificationCategories.reduce(
      (leadTimes, category) => ({
        ...leadTimes,
        [category]: category === "startShiftReminder" ? "atTime" : "1Hour"
      }),
      {} as NotificationPreference["reminderLeadTimes"]
    ),
    requalificationRemindersEnabled: true,
    startShiftRemindersEnabled: true,
    trainingRemindersEnabled: true
  };
}

export function createDefaultScheduledReminders(): ScheduledReminder[] {
  const createdAt = nowIso();
  return [
    {
      body: "Prototype court reminder. Verify official court information through authorized systems.",
      createdAt,
      enabled: true,
      id: "scheduled-court-demo",
      relatedEntityId: "court-appearance",
      relatedEntityType: "court",
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      title: "Court Reminder",
      type: "courtReminder",
      updatedAt: createdAt
    },
    {
      body: "Prototype training reminder. Confirm official training details through authorized systems.",
      createdAt,
      enabled: true,
      id: "scheduled-training-demo",
      relatedEntityId: "training-1",
      relatedEntityType: "training",
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      title: "Training Reminder",
      type: "trainingReminder",
      updatedAt: createdAt
    }
  ];
}

function createAuthSession(): LocalAuthSession {
  return {
    biometricPreference: "disabled",
    consent: emptyConsentState,
    lastSignedInAt: null,
    notificationPreferences: defaultNotificationPreferences,
    profile: null,
    status: "signedOut"
  };
}

export function createDefaultShiftReminders(): LocalReminderCard[] {
  return [
    { category: "shift", enabled: true, icon: "car", id: "shift-cruiser", subtitle: "Condition", title: "Cruiser" },
    { category: "shift", enabled: true, icon: "shield-account-outline", id: "shift-gear", subtitle: "Equipment", title: "Gear" },
    { category: "shift", enabled: true, icon: "pistol", id: "shift-cew", subtitle: "CEW test", title: "CEW" },
    { category: "shift", enabled: true, icon: "pistol", id: "shift-duty-pistol", subtitle: "Secure and ready", title: "Duty Pistol" },
    { category: "shift", enabled: true, icon: "view-grid-outline", id: "shift-magazines", subtitle: "Loaded if issued", title: "Magazines" },
    { category: "shift", enabled: false, icon: "shield-alert-outline", id: "shift-long-gun", subtitle: "If issued or required", title: "Long Gun" },
    { category: "shift", enabled: true, icon: "radio-handheld", id: "shift-radio", subtitle: "Channel", title: "Radio" },
    { category: "shift", enabled: true, icon: "tablet-cellphone", id: "shift-mdt", subtitle: "Connectivity", title: "MDT" },
    { category: "shift", enabled: true, icon: "camera-outline", id: "shift-body-camera", subtitle: "Status", title: "Body Camera" },
    { category: "shift", enabled: true, icon: "clipboard-check-outline", id: "shift-follow-ups", subtitle: "Open tasks", title: "Follow-Ups" },
    { category: "shift", enabled: true, icon: "scale-balance", id: "shift-court", subtitle: "Schedule", title: "Court" },
    { category: "shift", enabled: true, icon: "school-outline", id: "shift-training", subtitle: "Training", title: "Training" },
    { category: "shift", enabled: true, icon: "target", id: "shift-requalification", subtitle: "Deadlines", title: "Requalification" }
  ];
}

function createCalendarEvents(): LocalCalendarEvent[] {
  return calendarEvents.map((event, index) => ({
    ...event,
    id: `calendar-${index + 1}`,
    kind: index === 0 ? "court" : index === 1 ? "training" : "followUp",
    reminderEnabled: true
  }));
}

function createReminderCards(): {
  courtReminders: LocalReminderCard[];
  followUpReminders: LocalReminderCard[];
  trainingReminders: LocalReminderCard[];
} {
  return {
    courtReminders: [
      { category: "court", enabled: true, icon: "scale-balance", id: "court-appearance", subtitle: "R. v. Johnson - 09:00", title: "Court Appearance" },
      { category: "court", enabled: true, icon: "file-document-check-outline", id: "court-disclosure", subtitle: "Before tomorrow", title: "Disclosure Review" },
      { category: "court", enabled: true, icon: "account-voice", id: "court-witness", subtitle: "Statement confirmation", title: "Witness Follow-Up" }
    ],
    followUpReminders: followUpReminders.map((item, index) => ({
      ...item,
      category: "followUp",
      enabled: true,
      id: `follow-up-${index + 1}`
    })),
    trainingReminders: trainingReminders.map((item, index) => ({
      ...item,
      category: "training",
      enabled: true,
      id: `training-${index + 1}`
    }))
  };
}

function createIncidentDrafts(): LocalIncidentDraft[] {
  const createdAt = nowIso();
  return incidentExamples.map((example, index) => ({
    attachments: [
      {
        addedAt: createdAt,
        fileName: `${example.title.toLowerCase().replace(/\s+/g, "-")}-reference.txt`,
        fileType: "reference",
        id: `attachment-${index + 1}`,
        localOnly: true
      }
    ],
    createdAt,
    date: "2026-07-08",
    id: `draft-${index + 1}`,
    incidentType: example.title,
    involvedPersons: ["Placeholder person"],
    location: "Local demo location",
    notes: "Prototype-only draft. Do not enter real police records or sensitive personal information.",
    status: "draft",
    time: index === 0 ? "09:15" : index === 1 ? "12:40" : "17:05",
    updatedAt: createdAt,
    witnesses: ["Placeholder witness"]
  }));
}

function createNotesFiles(): LocalNoteFileMetadata[] {
  return notesFiles.map((item, index) => ({
    ...item,
    fileType: index === 0 ? "note" : index === 1 ? "photo" : "folder",
    id: `note-file-${index + 1}`,
    referenceOnly: true,
    updatedAt: nowIso()
  }));
}

function createHistory(): {
  aiHistory: LocalDemoHistoryItem[];
  translationHistory: LocalDemoHistoryItem[];
} {
  const createdAt = nowIso();
  return {
    aiHistory: [
      {
        createdAt,
        id: "ai-history-1",
        mode: "ai",
        prompt: "Summarize local demo notes",
        response: "Mock AI response only. Future AI output must be verified.",
        title: "Demo AI Summary"
      }
    ],
    translationHistory: [
      {
        createdAt,
        id: "translation-history-1",
        mode: "translation",
        prompt: "English to French sample",
        response: "Mock translation preview only.",
        title: "Demo Translation"
      }
    ]
  };
}

export function createDefaultLocalAppData(authOverride?: LocalAuthSession): LocalAppData {
  const seededAt = nowIso();
  const reminders = createReminderCards();
  const history = createHistory();

  return {
    aiHistory: history.aiHistory,
    auth: authOverride ?? createAuthSession(),
    calendarEvents: createCalendarEvents(),
    courtReminders: reminders.courtReminders,
    followUpReminders: reminders.followUpReminders,
    incidentDrafts: createIncidentDrafts(),
    notesFiles: createNotesFiles(),
    notificationPreference: createDefaultNotificationPreference(),
    preferences: {
      biometricEnabled: Boolean(authOverride?.profile?.biometricEnabled),
      consentStatus: authOverride?.consent ?? emptyConsentState,
      notificationsEnabled: true,
      preferredLanguage: authOverride?.profile?.preferredLanguage ?? mockUserProfile.preferredLanguage,
      ptsdRemindersEnabled: true,
      theme: "dark"
    },
    seededAt,
    shiftReminders: createDefaultShiftReminders(),
    trainingReminders: reminders.trainingReminders,
    translationHistory: history.translationHistory,
    scheduledReminders: createDefaultScheduledReminders(),
    updatedAt: seededAt,
    version: CURRENT_STORAGE_VERSION
  };
}
