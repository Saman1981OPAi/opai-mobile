import { emptyConsentState, mockUserProfile } from "@/data/authMock";
import { calendarEvents, followUpReminders, incidentExamples, notesFiles, trainingReminders } from "@/data/uiMockups";
import { CURRENT_STORAGE_VERSION } from "@/storage/storageKeys";
import type {
  LocalAppData,
  LocalAuthSession,
  LocalCalendarEvent,
  LocalIncidentDraft,
  LocalNoteFileMetadata,
  LocalReminderCard
} from "@/storage/storageTypes";
import type { AICategoryId, AIConversation, AIPreferences } from "@/types/ai";
import type { IncidentNotes } from "@/types/incident";
import type { NotificationCategory, NotificationPreference, ScheduledReminder } from "@/types/notifications";
import type { TranslationPreferences, TranslationRecord } from "@/types/translation";
import type {
  CalendarWorkflowEvent,
  CourtWorkflowEvent,
  FollowUpWorkflowReminder,
  RequalificationWorkflowReminder,
  TrainingWorkflowEvent
} from "@/types/workflow";

const nowIso = () => new Date().toISOString();
const dateOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

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

export function createDefaultCalendarWorkflowEvents(): CalendarWorkflowEvent[] {
  const createdAt = nowIso();

  return [
    {
      createdAt,
      date: dateOffset(0),
      id: "calendar-workflow-court-prep",
      location: "Provincial Court - Courtroom 3",
      notes: "Prototype event. Confirm official schedule through authorized systems.",
      reminderEnabled: true,
      reminderLeadTime: "1Hour",
      status: "upcoming",
      time: "09:00",
      title: "Court appearance",
      type: "Court",
      updatedAt: createdAt
    },
    {
      createdAt,
      date: dateOffset(1),
      id: "calendar-workflow-training",
      location: "Training Unit",
      notes: "Local placeholder only.",
      reminderEnabled: true,
      reminderLeadTime: "1Day",
      status: "upcoming",
      time: "13:30",
      title: "Scenario training",
      type: "Training",
      updatedAt: createdAt
    },
    {
      createdAt,
      date: dateOffset(2),
      id: "calendar-workflow-follow-up",
      location: "Local task list",
      notes: "Follow-up reminder placeholder.",
      reminderEnabled: true,
      reminderLeadTime: "1Hour",
      status: "upcoming",
      time: "15:00",
      title: "Follow-up review",
      type: "Follow-up",
      updatedAt: createdAt
    }
  ];
}

export function createDefaultCourtWorkflowEvents(): CourtWorkflowEvent[] {
  const createdAt = nowIso();

  return [
    {
      courtName: "Provincial Court",
      courtroom: "Courtroom 3",
      createdAt,
      date: dateOffset(0),
      fileReference: "Demo-25-01873",
      id: "court-workflow-appearance",
      location: "Local courthouse",
      matterName: "Court appearance",
      notes: "Prototype court reminder. Verify official court information through authorized systems.",
      reminderEnabled: true,
      reminderLeadTime: "1Hour",
      status: "upcoming",
      time: "09:00",
      updatedAt: createdAt
    },
    {
      courtName: "Provincial Court",
      courtroom: "Virtual link",
      createdAt,
      date: dateOffset(4),
      fileReference: "Demo-25-02241",
      id: "court-workflow-disclosure",
      location: "Remote appearance",
      matterName: "Disclosure review",
      notes: "Local placeholder only.",
      reminderEnabled: true,
      reminderLeadTime: "1Day",
      status: "upcoming",
      time: "10:30",
      updatedAt: createdAt
    }
  ];
}

export function createDefaultTrainingWorkflowEvents(): TrainingWorkflowEvent[] {
  const createdAt = nowIso();

  return [
    {
      category: "Scenario Training",
      createdAt,
      date: dateOffset(1),
      id: "training-workflow-scenario",
      instructorOrUnit: "Training Unit",
      location: "Training Centre",
      notes: "Prototype training item. Confirm official training details through authorized systems.",
      reminderEnabled: true,
      reminderLeadTime: "1Day",
      status: "upcoming",
      time: "13:30",
      title: "Scenario training",
      updatedAt: createdAt
    },
    {
      category: "Use of Force",
      createdAt,
      date: dateOffset(6),
      id: "training-workflow-uof",
      instructorOrUnit: "Use of Force Instructor",
      location: "Training Centre",
      notes: "Local placeholder only.",
      reminderEnabled: true,
      reminderLeadTime: "1Week",
      status: "upcoming",
      time: "08:00",
      title: "Use of Force refresher",
      updatedAt: createdAt
    }
  ];
}

export function createDefaultRequalificationWorkflowReminders(): RequalificationWorkflowReminder[] {
  const createdAt = nowIso();

  return [
    {
      category: "Annual Firearms Qualification",
      createdAt,
      dueDate: dateOffset(21),
      expiryDate: dateOffset(45),
      id: "requalification-workflow-firearms",
      notes: "Due soon example for local testing.",
      reminderEnabled: true,
      reminderLeadTime: "1Week",
      status: "dueSoon",
      title: "Firearms qualification",
      updatedAt: createdAt
    },
    {
      category: "CEW Requalification",
      createdAt,
      dueDate: dateOffset(60),
      expiryDate: dateOffset(90),
      id: "requalification-workflow-cew",
      notes: "Future deadline example.",
      reminderEnabled: true,
      reminderLeadTime: "1Week",
      status: "valid",
      title: "CEW requalification",
      updatedAt: createdAt
    }
  ];
}

export function createDefaultFollowUpWorkflowReminders(): FollowUpWorkflowReminder[] {
  const createdAt = nowIso();

  return [
    {
      createdAt,
      dueDate: dateOffset(0),
      id: "follow-up-workflow-statement",
      notes: "Demo follow-up reminder. Do not enter real personal information.",
      priority: "high",
      relatedIncidentId: "draft-1",
      reminderEnabled: true,
      reminderLeadTime: "1Hour",
      status: "open",
      title: "Witness statement follow-up",
      updatedAt: createdAt
    },
    {
      createdAt,
      dueDate: dateOffset(2),
      id: "follow-up-workflow-report",
      notes: "Local placeholder only.",
      priority: "medium",
      relatedIncidentId: "draft-2",
      reminderEnabled: true,
      reminderLeadTime: "1Day",
      status: "open",
      title: "Draft report review",
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
    attachmentMetadata: [
      {
        addedAt: createdAt,
        attachmentType: index === 0 ? "Photo" : index === 1 ? "Document" : "Audio",
        description: "Metadata-only placeholder. No real file is stored.",
        fileName: `${example.title.toLowerCase().replace(/\s+/g, "-")}-reference.txt`,
        id: `incident-metadata-${index + 1}`,
        metadataOnly: true,
        notes: "Local prototype metadata only."
      }
    ],
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
    followUpRequired: index === 1,
    id: `draft-${index + 1}`,
    incidentType: example.title,
    incidentNotes: createDefaultIncidentNotes("Prototype-only draft. Do not enter real police records or sensitive personal information."),
    involvedPersons: ["Placeholder person"],
    location: "Local demo location",
    notes: "Prototype-only draft. Do not enter real police records or sensitive personal information.",
    occurrenceCategory: index === 0 ? "Public Safety" : index === 1 ? "Property" : "General",
    personsInvolved: [
      {
        email: "",
        id: `person-draft-${index + 1}`,
        name: "Placeholder person",
        notes: "No real personal information.",
        phone: "",
        role: "Other"
      }
    ],
    priority: index === 1 ? "High" : "Medium",
    status: index === 1 ? "followUpRequired" : "draft",
    time: index === 0 ? "09:15" : index === 1 ? "12:40" : "17:05",
    updatedAt: createdAt,
    witnesses: ["Placeholder witness"],
    witnessDetails: [
      {
        contact: "",
        followUpRequired: index === 1,
        id: `witness-draft-${index + 1}`,
        name: "Placeholder witness",
        statementSummary: "Placeholder witness summary only."
      }
    ]
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
  aiHistory: AIConversation[];
  translationHistory: TranslationRecord[];
} {
  const createdAt = nowIso();
  return {
    aiHistory: [
      {
        category: "incident_summary",
        createdAt,
        id: "ai-history-1",
        mockResponse: "[Mock AI Response] Future AI output must be verified. This local prototype does not generate real AI content.",
        prompt: "Summarize local demo notes",
        updatedAt: createdAt
      }
    ],
    translationHistory: [
      {
        createdAt,
        id: "translation-history-1",
        mode: "text",
        notes: "Mock translation preview only.",
        relatedIncidentId: "",
        sourceLanguage: "English",
        sourceText: "English to French sample",
        targetLanguage: "French",
        translatedText: "[Mock Translation] This feature is currently in testing. Future versions may provide real-time translation support."
      }
    ]
  };
}

export function createDefaultTranslationPreferences(): TranslationPreferences {
  return {
    lastUpdatedAt: nowIso(),
    preferredSourceLanguage: "English",
    preferredTargetLanguage: "French",
    saveToHistory: true
  };
}

export function createDefaultAIPreferences(): AIPreferences {
  return {
    lastSelectedCategory: "general",
    lastUpdatedAt: nowIso(),
    saveHistory: true
  };
}

type LegacyAIHistoryItem = Partial<AIConversation> & {
  mode?: "ai" | "translation";
  response?: string;
  title?: string;
};

function normalizeAICategory(category?: string): AICategoryId {
  const allowed: AICategoryId[] = [
    "general",
    "report_review",
    "incident_summary",
    "follow_up",
    "court",
    "calendar",
    "training",
    "translation",
    "legal_reference_placeholder",
    "policy_placeholder",
    "wellness"
  ];

  return allowed.includes(category as AICategoryId) ? category as AICategoryId : "general";
}

export function normalizeAIHistory(history: LegacyAIHistoryItem[] | undefined): AIConversation[] {
  const createdAt = nowIso();
  const items: LegacyAIHistoryItem[] = history ?? createHistory().aiHistory;

  return items.map((item, index) => {
    const conversation: AIConversation = {
      category: normalizeAICategory(item.category),
      createdAt: item.createdAt ?? createdAt,
      id: item.id ?? `ai-history-${index + 1}`,
      mockResponse:
        item.mockResponse ??
        item.response ??
        "[Mock AI Response] This local prototype does not generate real AI content. Verify future AI output before relying on it.",
      prompt: item.prompt ?? item.title ?? "Local mock AI prompt",
      updatedAt: item.updatedAt ?? item.createdAt ?? createdAt
    };

    return {
      ...conversation,
      ...(item.relatedIncidentId ? { relatedIncidentId: item.relatedIncidentId } : {}),
      ...(item.relatedNoteId ? { relatedNoteId: item.relatedNoteId } : {})
    };
  });
}

type LegacyTranslationHistoryItem = {
  createdAt?: string;
  id?: string;
  mode?: TranslationRecord["mode"] | "ai" | "translation";
  notes?: string;
  prompt?: string;
  relatedIncidentId?: string;
  response?: string;
  sourceLanguage?: TranslationRecord["sourceLanguage"];
  sourceText?: string;
  targetLanguage?: TranslationRecord["targetLanguage"];
  title?: string;
  translatedText?: string;
};

export function normalizeTranslationHistory(history: LegacyTranslationHistoryItem[] | undefined): TranslationRecord[] {
  const createdAt = nowIso();
  const items: LegacyTranslationHistoryItem[] = history ?? createHistory().translationHistory;

  return items.map((item, index) => ({
    createdAt: item.createdAt ?? createdAt,
    id: item.id ?? `translation-history-${index + 1}`,
    mode: item.mode === "ai" || item.mode === "translation" || item.mode === undefined ? "text" : item.mode,
    notes: item.notes ?? item.title ?? "Local mock translation.",
    relatedIncidentId: item.relatedIncidentId ?? "",
    sourceLanguage: item.sourceLanguage ?? "English",
    sourceText: item.sourceText ?? item.prompt ?? "Mock translation source",
    targetLanguage: item.targetLanguage ?? "French",
    translatedText:
      item.translatedText ??
      item.response ??
      "[Mock Translation] This feature is currently in testing. Future versions may provide real-time translation support."
  }));
}

function createDefaultIncidentNotes(seed = "Prototype-only draft. Do not enter real police records or sensitive personal information."): IncidentNotes {
  return {
    disclosureNotes: "Disclosure placeholder only.",
    followUpNotes: "No follow-up notes added.",
    narrativeDraft: seed,
    observations: "Observation placeholder.",
    officerNotes: seed
  };
}

export function normalizeIncidentDraft(draft: LocalIncidentDraft): LocalIncidentDraft {
  const now = nowIso();
  const fallbackNotes = draft.notes || "Prototype-only draft. Do not enter real police records or sensitive personal information.";

  return {
    ...draft,
    attachmentMetadata: draft.attachmentMetadata ?? draft.attachments.map((attachment) => ({
      addedAt: attachment.addedAt,
      attachmentType: attachment.fileType === "audio" ? "Audio" : attachment.fileType === "document" ? "Document" : attachment.fileType === "video" ? "Video" : "Other",
      description: "Metadata-only placeholder.",
      fileName: attachment.fileName,
      id: attachment.id,
      metadataOnly: true,
      notes: "No real file is stored."
    })),
    followUpRequired: draft.followUpRequired ?? draft.status === "followUpRequired",
    incidentNotes: draft.incidentNotes ?? createDefaultIncidentNotes(fallbackNotes),
    occurrenceCategory: draft.occurrenceCategory ?? "General",
    personsInvolved: draft.personsInvolved ?? draft.involvedPersons.map((name, index) => ({
      email: "",
      id: `person-${draft.id}-${index + 1}`,
      name,
      notes: "Placeholder person only.",
      phone: "",
      role: "Other"
    })),
    priority: draft.priority ?? "Medium",
    updatedAt: draft.updatedAt ?? now,
    witnessDetails: draft.witnessDetails ?? draft.witnesses.map((name, index) => ({
      contact: "",
      followUpRequired: false,
      id: `witness-${draft.id}-${index + 1}`,
      name,
      statementSummary: "Placeholder witness summary only."
    }))
  };
}

export function normalizeIncidentDrafts(drafts: LocalIncidentDraft[] | undefined): LocalIncidentDraft[] {
  return (drafts ?? createIncidentDrafts()).map(normalizeIncidentDraft);
}

export function createDefaultLocalAppData(authOverride?: LocalAuthSession): LocalAppData {
  const seededAt = nowIso();
  const reminders = createReminderCards();
  const history = createHistory();

  return {
    aiHistory: history.aiHistory,
    aiPreferences: createDefaultAIPreferences(),
    auth: authOverride ?? createAuthSession(),
    calendarEvents: createCalendarEvents(),
    calendarWorkflowEvents: createDefaultCalendarWorkflowEvents(),
    courtReminders: reminders.courtReminders,
    courtWorkflowEvents: createDefaultCourtWorkflowEvents(),
    followUpWorkflowReminders: createDefaultFollowUpWorkflowReminders(),
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
    requalificationWorkflowReminders: createDefaultRequalificationWorkflowReminders(),
    trainingReminders: reminders.trainingReminders,
    trainingWorkflowEvents: createDefaultTrainingWorkflowEvents(),
    translationHistory: history.translationHistory,
    translationPreferences: createDefaultTranslationPreferences(),
    scheduledReminders: createDefaultScheduledReminders(),
    updatedAt: seededAt,
    version: CURRENT_STORAGE_VERSION
  };
}
