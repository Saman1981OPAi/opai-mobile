import type { ReactNode } from "react";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { AIInputBar } from "@/components/ui/AIInputBar";
import { AppHeader } from "@/components/ui/AppHeader";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventCard } from "@/components/ui/EventCard";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PTSDRibbonCard } from "@/components/ui/PTSDRibbonCard";
import { ReminderCard } from "@/components/ui/ReminderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { secondaryModules, settingsItems } from "@/data/uiMockups";
import { aiService } from "@/services/aiService";
import { dashboardService } from "@/services/dashboardService";
import { incidentService } from "@/services/incidentService";
import {
  attachmentTypes,
  followUpTaskOptions,
  incidentPriorities,
  incidentStatuses,
  incidentTypes,
  incidentWorkflowService,
  occurrenceCategories,
  personRoles,
  type IncidentDraftFilter
} from "@/services/incidentWorkflowService";
import { notesService } from "@/services/notesService";
import { notificationService } from "@/services/notificationService";
import { notificationScheduler } from "@/services/notificationScheduler";
import type { LocalAppData, LocalIncidentDraft } from "@/storage/storageTypes";
import { translationService } from "@/services/translationService";
import { workflowService } from "@/services/workflowService";
import { colors, layout, radius, spacing, typography } from "@/theme/tokens";
import type { MockUserProfile } from "@/types/auth";
import type { AppModule, ModuleId } from "@/types/navigation";
import type { NotificationCategory, NotificationLeadTime, NotificationPreference, ScheduledReminder } from "@/types/notifications";
import type {
  IncidentAttachmentMetadata,
  IncidentDraftStatus,
  IncidentPerson,
  IncidentWitness
} from "@/types/incident";
import type {
  CalendarWorkflowEvent,
  CalendarWorkflowStatus,
  CalendarWorkflowType,
  CourtWorkflowEvent,
  CourtWorkflowStatus,
  FollowUpPriority,
  FollowUpWorkflowReminder,
  FollowUpWorkflowStatus,
  RequalificationCategory,
  RequalificationWorkflowReminder,
  RequalificationWorkflowStatus,
  TrainingCategory,
  TrainingWorkflowEvent,
  TrainingWorkflowStatus,
  WorkflowSummaryItem
} from "@/types/workflow";

type ModuleScreenProps = {
  localData: LocalAppData;
  module: AppModule;
  onClearLocalData: () => Promise<void>;
  onResetDemoData: () => Promise<void>;
  onSelectModule: (module: ModuleId) => void;
  onSignOut: () => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  profile: MockUserProfile | null;
};

const leadTimeLabels: Record<NotificationLeadTime, string> = {
  "15Minutes": "15 min before",
  "1Day": "1 day before",
  "1Hour": "1 hour before",
  "1Week": "1 week before",
  atTime: "At time"
};

const leadTimeOptions: NotificationLeadTime[] = ["atTime", "15Minutes", "1Hour", "1Day", "1Week"];
const calendarTypeOptions: CalendarWorkflowType[] = ["Court", "Training", "Requalification", "Follow-up", "Meeting", "Shift", "General"];
const calendarStatusOptions: CalendarWorkflowStatus[] = ["upcoming", "completed", "cancelled"];
const courtStatusOptions: CourtWorkflowStatus[] = ["upcoming", "completed", "adjourned", "cancelled"];
const trainingStatusOptions: TrainingWorkflowStatus[] = ["upcoming", "completed", "cancelled"];
const requalificationStatusOptions: RequalificationWorkflowStatus[] = ["valid", "dueSoon", "overdue", "completed"];
const followUpStatusOptions: FollowUpWorkflowStatus[] = ["open", "completed", "overdue"];
const followUpPriorityOptions: FollowUpPriority[] = ["low", "medium", "high"];
const trainingCategoryOptions: TrainingCategory[] = [
  "Firearms",
  "Use of Force",
  "CEW",
  "CPR / First Aid",
  "Scenario Training",
  "Policy Training",
  "Other"
];
const requalificationCategoryOptions: RequalificationCategory[] = [
  "Annual Firearms Qualification",
  "Use of Force Requalification",
  "CEW Requalification",
  "CPR / First Aid Renewal",
  "Driver Training",
  "Other"
];

const notificationPreferenceRows: Array<{
  key: keyof Pick<
    NotificationPreference,
    | "calendarEventRemindersEnabled"
    | "courtRemindersEnabled"
    | "followUpRemindersEnabled"
    | "requalificationRemindersEnabled"
    | "startShiftRemindersEnabled"
    | "trainingRemindersEnabled"
  >;
  label: string;
  type: NotificationCategory;
}> = [
  { key: "courtRemindersEnabled", label: "Court", type: "courtReminder" },
  { key: "trainingRemindersEnabled", label: "Training", type: "trainingReminder" },
  { key: "requalificationRemindersEnabled", label: "Requalification", type: "requalificationReminder" },
  { key: "startShiftRemindersEnabled", label: "Start My Shift", type: "startShiftReminder" },
  { key: "followUpRemindersEnabled", label: "Follow-Ups", type: "followUpReminder" },
  { key: "calendarEventRemindersEnabled", label: "Calendar", type: "calendarEventReminder" }
];

export function ModuleScreen({
  localData,
  module,
  onClearLocalData,
  onResetDemoData,
  onSelectModule,
  onSignOut,
  onUpdateLocalData,
  profile
}: ModuleScreenProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= layout.tabletBreakpoint;
  const [selectedItem, setSelectedItem] = useState("Home");
  const selectItem = (label: string) => setSelectedItem(label);
  const timestamp = () => new Date().toISOString();

  const cancelRelatedWorkflowReminder = async (relatedEntityId: string) => {
    const matches = localData.scheduledReminders.filter((reminder) => reminder.relatedEntityId === relatedEntityId);

    try {
      for (const reminder of matches) {
        if (reminder.localNotificationId) {
          await notificationScheduler.cancelLocalNotification(reminder.localNotificationId);
        }
      }
    } finally {
      onUpdateLocalData((current) => ({
        ...current,
        scheduledReminders: current.scheduledReminders.filter((reminder) => reminder.relatedEntityId !== relatedEntityId),
        updatedAt: timestamp()
      }));
    }
  };

  const upsertWorkflowReminder = async (reminder: ScheduledReminder) => {
    try {
      await cancelRelatedWorkflowReminder(reminder.relatedEntityId);
      const scheduled = await notificationService.scheduleReminder(reminder);
      onUpdateLocalData((current) => ({
        ...current,
        scheduledReminders: [
          scheduled,
          ...current.scheduledReminders.filter((item) => item.relatedEntityId !== scheduled.relatedEntityId)
        ].slice(0, 30),
        updatedAt: timestamp()
      }));
    } catch {
      Alert.alert("Local Reminder", "The item was saved, but the local notification could not be scheduled on this device.");
    }
  };

  const toggleShiftReminder = (id: string) => {
    onUpdateLocalData((current) => ({
      ...current,
      shiftReminders: current.shiftReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
      ),
      updatedAt: timestamp()
    }));
  };

  const addAiHistory = (prompt: string) => {
    onUpdateLocalData((current) => ({
      ...current,
      aiHistory: [
        {
          createdAt: timestamp(),
          id: `ai-history-${Date.now()}`,
          mode: "ai" as const,
          prompt,
          response: "Mock local response only. Verify future AI output before relying on it.",
          title: "Local AI Preview"
        },
        ...current.aiHistory
      ].slice(0, 12),
      updatedAt: timestamp()
    }));
  };

  const addTranslationHistory = (prompt: string) => {
    onUpdateLocalData((current) => ({
      ...current,
      translationHistory: [
        {
          createdAt: timestamp(),
          id: `translation-history-${Date.now()}`,
          mode: "translation" as const,
          prompt,
          response: "Mock local translation only. Production translation is not connected.",
          title: "Local Translation Preview"
        },
        ...current.translationHistory
      ].slice(0, 12),
      updatedAt: timestamp()
    }));
  };

  if (module.id === "dashboard") {
    return (
      <HomeDashboardScreen
        isTablet={isTablet}
        localData={localData}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "shift") {
    return (
      <StartShiftScreen
        isTablet={isTablet}
        localData={localData}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        onToggleReminder={toggleShiftReminder}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "incident") {
    return (
      <NewIncidentScreen
        isTablet={isTablet}
        localData={localData}
        onCancelReminder={cancelRelatedWorkflowReminder}
        onScheduleReminder={upsertWorkflowReminder}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        onUpdateLocalData={onUpdateLocalData}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "ai") {
    return (
      <AIAssistantScreen
        isTablet={isTablet}
        localData={localData}
        onAddHistory={addAiHistory}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "translation") {
    return (
      <TranslationScreen
        isTablet={isTablet}
        localData={localData}
        onAddHistory={addTranslationHistory}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "calendar") {
    return (
      <CalendarScreen
        onCancelReminder={cancelRelatedWorkflowReminder}
        isTablet={isTablet}
        localData={localData}
        onScheduleReminder={upsertWorkflowReminder}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        onUpdateLocalData={onUpdateLocalData}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "court") {
    return (
      <CourtScreen
        onCancelReminder={cancelRelatedWorkflowReminder}
        isTablet={isTablet}
        localData={localData}
        onScheduleReminder={upsertWorkflowReminder}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        onUpdateLocalData={onUpdateLocalData}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "training") {
    return (
      <TrainingScreen
        onCancelReminder={cancelRelatedWorkflowReminder}
        isTablet={isTablet}
        localData={localData}
        onScheduleReminder={upsertWorkflowReminder}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        onUpdateLocalData={onUpdateLocalData}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "notes") {
    return (
      <NotesFilesScreen
        isTablet={isTablet}
        localData={localData}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "settings") {
    return (
      <SettingsScreen
        isTablet={isTablet}
        localData={localData}
        onClearLocalData={onClearLocalData}
        onResetDemoData={onResetDemoData}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        onSignOut={onSignOut}
        onUpdateLocalData={onUpdateLocalData}
        profile={profile}
        selectedItem={selectedItem}
      />
    );
  }

  return (
    <ScreenFrame activeModule={module.id} isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title={module.shortLabel} />
      <EmptyState
        icon="progress-wrench"
        title={`${module.shortLabel} preview`}
        message="This module is planned for a later sprint. Sprint 003 keeps it as a local placeholder."
      />
      <DisclaimerBanner />
    </ScreenFrame>
  );
}

function ScreenFrame({
  activeModule,
  children,
  isTablet,
  onSelectModule
}: {
  activeModule: ModuleId;
  children: ReactNode;
  isTablet: boolean;
  onSelectModule: (module: ModuleId) => void;
}) {
  return (
    <View style={styles.screen}>
      <View style={[styles.content, isTablet ? styles.contentTablet : null]}>
        {children}
        <SecondaryModuleMenu
          activeModule={activeModule}
          isTablet={isTablet}
          onSelectModule={onSelectModule}
        />
      </View>
    </View>
  );
}

function HomeDashboardScreen({
  isTablet,
  localData,
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
  const dashboard = dashboardService.getDashboard(localData);
  const dutySummary = workflowService.getHomeSummary(localData);

  return (
    <ScreenFrame activeModule="dashboard" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Home" />
      <View style={[styles.hero, isTablet ? styles.heroTablet : null]}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>AI partner on duty.</Text>
          <Text style={styles.heroSub}>Reports. Translation. Reminders.</Text>
        </View>
        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="shield-check-outline" size={42} color={colors.primaryBlue} />
        </View>
      </View>

      <View style={[styles.grid, isTablet ? styles.gridTablet : null]}>
        {dashboard.features.map((feature) => (
          <FeatureCard
            compact={isTablet}
            icon={feature.icon}
            key={feature.id}
            onPress={() => onSelectModule(feature.id)}
            subtitle={feature.subtitle}
            title={feature.title}
          />
        ))}
      </View>

      <SectionHeader icon="view-dashboard-outline" title="Duty Snapshot" />
      <View style={[styles.summaryGrid, isTablet ? styles.summaryGridTablet : null]}>
        {dutySummary.map((item) => (
          <WorkflowSummaryCard
            key={item.id}
            item={item}
            onPress={() => onSelectItem(item.title)}
            selected={selectedItem === item.title}
          />
        ))}
      </View>

      <SectionHeader action="View All" icon="calendar-outline" title="Upcoming" />
      <View style={styles.stack}>
        {dashboard.upcoming.map((event) => (
          <EventCard
            key={event.title}
            onPress={() => onSelectItem(event.title)}
            {...event}
          />
        ))}
      </View>

      <PTSDRibbonCard />
      <AIInputBar onPress={() => onSelectModule("ai")} placeholder="Ask OPAi..." />
      <PrototypeSelection label={selectedItem} />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function StartShiftScreen({
  isTablet,
  localData,
  onSelectItem,
  onSelectModule,
  onToggleReminder,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onToggleReminder: (id: string) => void;
  selectedItem: string;
}) {
  const reminders = localData.shiftReminders;
  const readinessSummary = workflowService.getShiftReadinessSummary(localData);

  return (
    <ScreenFrame activeModule="shift" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Start My Shift" />
      <View style={styles.centerHero}>
        <Text style={styles.heroTitle}>
          Start Every Shift <Text style={styles.blueText}>Prepared</Text>
        </Text>
        <Text style={styles.heroSub}>Reminders only. Not mandatory.</Text>
      </View>

      <SectionHeader icon="calendar-check-outline" title="Today" />
      <View style={[styles.summaryGrid, isTablet ? styles.summaryGridTablet : null]}>
        {readinessSummary.map((item) => (
          <WorkflowSummaryCard
            key={item.id}
            item={item}
            onPress={() => onSelectItem(item.title)}
            selected={selectedItem === item.title}
          />
        ))}
      </View>

      <SectionHeader icon="shield-check-outline" title="Shift Reminders" />
      <View style={[styles.reminderGrid, isTablet ? styles.reminderGridTablet : null]}>
        {reminders.map((reminder) => (
          <ReminderCard
            active={selectedItem === reminder.title || !reminder.enabled}
            icon={reminder.icon}
            key={reminder.id}
            onPress={() => {
              onSelectItem(reminder.title);
              onToggleReminder(reminder.id);
            }}
            subtitle={reminder.enabled ? reminder.subtitle : "Disabled locally"}
            title={reminder.title}
          />
        ))}
      </View>

      <PrimaryButton label="I'm Ready">
        <MaterialCommunityIcons name="leaf-maple" size={24} color={colors.textPrimary} />
      </PrimaryButton>
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Supportive reminder preview only. This is not a mandatory checklist." />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

const incidentStepTitles = ["Basics", "Persons", "Witnesses", "Notes", "Attachments", "Review"] as const;

function createIncidentId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function createBlankIncidentPerson(): IncidentPerson {
  return {
    email: "",
    id: createIncidentId("incident-person"),
    name: "",
    notes: "",
    phone: "",
    role: "Other"
  };
}

function createBlankIncidentWitness(): IncidentWitness {
  return {
    contact: "",
    followUpRequired: false,
    id: createIncidentId("incident-witness"),
    name: "",
    statementSummary: ""
  };
}

function createBlankIncidentAttachment(): IncidentAttachmentMetadata {
  return {
    addedAt: new Date().toISOString(),
    attachmentType: "Document",
    description: "",
    fileName: "",
    id: createIncidentId("incident-attachment"),
    metadataOnly: true,
    notes: ""
  };
}

function createBlankIncidentDraft(): LocalIncidentDraft {
  const now = new Date().toISOString();

  return {
    attachmentMetadata: [],
    attachments: [],
    createdAt: now,
    date: workflowService.today(),
    followUpRequired: false,
    id: createIncidentId("incident-draft"),
    incidentNotes: {
      disclosureNotes: "",
      followUpNotes: "",
      narrativeDraft: "",
      observations: "",
      officerNotes: ""
    },
    incidentType: "Other",
    involvedPersons: [],
    location: "",
    notes: "",
    occurrenceCategory: "General",
    personsInvolved: [],
    priority: "Medium",
    status: "draft",
    time: "09:00",
    updatedAt: now,
    witnesses: [],
    witnessDetails: []
  };
}

function NewIncidentScreen({
  isTablet,
  localData,
  onCancelReminder,
  onScheduleReminder,
  onSelectItem,
  onSelectModule,
  onUpdateLocalData,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onCancelReminder: (relatedEntityId: string) => Promise<void>;
  onScheduleReminder: (reminder: ScheduledReminder) => Promise<void>;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  selectedItem: string;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [filter, setFilter] = useState<IncidentDraftFilter>("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<LocalIncidentDraft>(createBlankIncidentDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [followUpTitle, setFollowUpTitle] = useState<(typeof followUpTaskOptions)[number]>("Witness statement");
  const [followUpDate, setFollowUpDate] = useState(workflowService.today());
  const [calendarDate, setCalendarDate] = useState(workflowService.today());
  const incidentDrafts = incidentWorkflowService.filterDrafts(localData.incidentDrafts, filter, search);
  const completeness = incidentWorkflowService.calculateCompleteness(draft);

  const resetDraft = () => {
    setDraft(createBlankIncidentDraft());
    setEditingId(null);
    setStepIndex(0);
  };

  const syncDerivedDraftFields = (item: LocalIncidentDraft): LocalIncidentDraft => ({
    ...item,
    followUpRequired: item.followUpRequired || item.witnessDetails.some((witness) => witness.followUpRequired),
    involvedPersons: item.personsInvolved.map((person) => person.name).filter(Boolean),
    notes: item.incidentNotes.officerNotes || item.incidentNotes.narrativeDraft,
    status:
      item.status === "reviewed" || item.status === "archived"
        ? item.status
        : item.followUpRequired || item.witnessDetails.some((witness) => witness.followUpRequired)
          ? "followUpRequired"
          : item.status,
    witnesses: item.witnessDetails.map((witness) => witness.name).filter(Boolean)
  });

  const saveIncidentDraft = (statusOverride?: IncidentDraftStatus) => {
    const now = new Date().toISOString();
    const next = syncDerivedDraftFields({
      ...draft,
      id: editingId ?? draft.id,
      createdAt: editingId ? draft.createdAt : now,
      incidentType: draft.incidentType.trim() || "Other",
      location: draft.location.trim(),
      occurrenceCategory: draft.occurrenceCategory.trim() || "General",
      status: statusOverride ?? draft.status,
      updatedAt: now
    });

    onUpdateLocalData((current) => ({
      ...current,
      incidentDrafts: [
        next,
        ...current.incidentDrafts.filter((item) => item.id !== next.id)
      ],
      updatedAt: now
    }));
    setDraft(next);
    setEditingId(next.id);
    onSelectItem(next.incidentType);
    Alert.alert("Draft Saved", incidentWorkflowService.createReviewSummary(next));
  };

  const deleteIncidentDraft = (item: LocalIncidentDraft) => {
    Alert.alert("Delete Draft", "Remove this local prototype incident draft?", [
      { style: "cancel", text: "Cancel" },
      {
        onPress: () => {
          onUpdateLocalData((current) => ({
            ...current,
            incidentDrafts: current.incidentDrafts.filter((draftItem) => draftItem.id !== item.id),
            updatedAt: new Date().toISOString()
          }));
          if (editingId === item.id) {
            resetDraft();
          }
        },
        style: "destructive",
        text: "Delete"
      }
    ]);
  };

  const archiveIncidentDraft = (item: LocalIncidentDraft) => {
    const next = { ...item, status: "archived" as const, updatedAt: new Date().toISOString() };
    onUpdateLocalData((current) => ({
      ...current,
      incidentDrafts: current.incidentDrafts.map((draftItem) => (draftItem.id === item.id ? next : draftItem)),
      updatedAt: next.updatedAt
    }));
    if (editingId === item.id) {
      setDraft(next);
    }
  };

  const editIncidentDraft = (item: LocalIncidentDraft) => {
    setDraft(item);
    setEditingId(item.id);
    setStepIndex(0);
    onSelectItem(item.incidentType);
  };

  const addPerson = () => setDraft((item) => ({ ...item, personsInvolved: [...item.personsInvolved, createBlankIncidentPerson()] }));
  const addWitness = () => setDraft((item) => ({ ...item, witnessDetails: [...item.witnessDetails, createBlankIncidentWitness()] }));
  const addAttachment = () => setDraft((item) => ({ ...item, attachmentMetadata: [...item.attachmentMetadata, createBlankIncidentAttachment()] }));

  const createIncidentFollowUp = async () => {
    const now = new Date().toISOString();
    const savedDraft = syncDerivedDraftFields({ ...draft, followUpRequired: true, status: "followUpRequired", updatedAt: now });
    const followUp: FollowUpWorkflowReminder = {
      createdAt: now,
      dueDate: followUpDate,
      id: createIncidentId("incident-follow-up"),
      notes: `Incident follow-up: ${savedDraft.incidentType}. ${savedDraft.incidentNotes.followUpNotes || "Local prototype reminder only."}`,
      priority: savedDraft.priority === "Urgent" || savedDraft.priority === "High" ? "high" : savedDraft.priority === "Medium" ? "medium" : "low",
      relatedIncidentId: savedDraft.id,
      reminderEnabled: true,
      reminderLeadTime: "1Day",
      status: "open",
      title: followUpTitle,
      updatedAt: now
    };

    onUpdateLocalData((current) => ({
      ...current,
      followUpWorkflowReminders: workflowService.sortByDateTime([
        followUp,
        ...current.followUpWorkflowReminders
      ]),
      incidentDrafts: [
        savedDraft,
        ...current.incidentDrafts.filter((item) => item.id !== savedDraft.id)
      ],
      updatedAt: now
    }));
    setDraft(savedDraft);
    setEditingId(savedDraft.id);
    await onScheduleReminder(workflowService.createFollowUpReminder(followUp));
    Alert.alert("Follow-Up Created", "A local follow-up reminder was created from this prototype incident draft.");
  };

  const createIncidentCalendarItem = async () => {
    const now = new Date().toISOString();
    const event: CalendarWorkflowEvent = {
      createdAt: now,
      date: calendarDate,
      id: createIncidentId("incident-calendar"),
      location: draft.location,
      notes: `Incident-related calendar placeholder for ${draft.incidentType}. No external calendar sync.`,
      reminderEnabled: true,
      reminderLeadTime: "1Day",
      status: "upcoming",
      time: draft.time || "09:00",
      title: `${draft.incidentType} review`,
      type: "Follow-up",
      updatedAt: now
    };

    onUpdateLocalData((current) => ({
      ...current,
      calendarWorkflowEvents: workflowService.sortByDateTime([
        event,
        ...current.calendarWorkflowEvents
      ]),
      updatedAt: now
    }));
    await onScheduleReminder(workflowService.createCalendarReminder(event));
    Alert.alert("Calendar Placeholder Added", "A local calendar reminder was added. No external calendar sync was used.");
  };

  const showAiPlaceholder = () => {
    const preview = incidentWorkflowService.buildAiReadyPreview(draft);
    Alert.alert("Prepare for AI Review", preview.warning);
  };

  return (
    <ScreenFrame activeModule="incident" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="New Incident" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Structured draft.</Text>
          <Text style={styles.heroSub}>Local incident workflow. No RMS sync.</Text>
        </View>
        <MaterialCommunityIcons name="file-plus-outline" size={48} color={colors.primaryBlue} />
      </View>

      <SectionHeader icon="file-document-edit-outline" title="Incident Drafts" />
      <WorkflowField label="Search drafts" value={search} onChangeText={setSearch} />
      <View style={styles.filterRow}>
        {(["All", "Draft", "Follow-up Required", "Reviewed", "Archived"] as IncidentDraftFilter[]).map((item) => (
          <SecondaryButton key={item} label={item} onPress={() => setFilter(item)}>
            <MaterialCommunityIcons name={filter === item ? "check-circle-outline" : "circle-outline"} size={18} color={colors.primaryBlue} />
          </SecondaryButton>
        ))}
      </View>
      <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
        {incidentDrafts.map((item) => {
          const itemCompleteness = incidentWorkflowService.calculateCompleteness(item);
          return (
            <WorkflowItemCard
              accent={item.priority === "Urgent" ? colors.danger : item.priority === "High" ? colors.warning : colors.primaryBlue}
              active={selectedItem === item.incidentType}
              icon="file-document-edit-outline"
              key={item.id}
              meta={`${item.date} - ${item.time} - ${item.priority}`}
              onDelete={() => deleteIncidentDraft(item)}
              onEdit={() => editIncidentDraft(item)}
              onPress={() => editIncidentDraft(item)}
              onPrimary={() => archiveIncidentDraft(item)}
              primaryLabel={item.status === "archived" ? "Archived" : "Archive"}
              reminderEnabled={item.followUpRequired}
              status={`${incidentWorkflowService.statusLabel(item.status)} ${itemCompleteness.percent}%`}
              subtitle={item.location || "No location added"}
              title={item.incidentType}
            />
          );
        })}
      </View>
      {incidentDrafts.length === 0 ? (
        <EmptyState icon="file-document-outline" title="No drafts" message="Create or reset local prototype incident drafts." />
      ) : null}

      <SectionHeader icon="progress-check" title={`Step ${stepIndex + 1} of ${incidentStepTitles.length}: ${incidentStepTitles[stepIndex]}`} />
      <View style={styles.stepperRow}>
        {incidentStepTitles.map((step, index) => (
          <Pressable
            accessibilityRole="button"
            key={step}
            onPress={() => setStepIndex(index)}
            style={[styles.stepPill, stepIndex === index ? styles.stepPillActive : null]}
          >
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.stepPillText}>{index + 1}. {step}</Text>
          </Pressable>
        ))}
      </View>

      {stepIndex === 0 ? (
        <WorkflowFormPanel icon="clipboard-text-outline" title="Incident Basics">
          <View style={styles.filterRow}>
            <SecondaryButton label={draft.incidentType} onPress={() => setDraft((item) => ({ ...item, incidentType: cycleOption([...incidentTypes], item.incidentType as (typeof incidentTypes)[number]) }))}>
              <MaterialCommunityIcons name="tag-outline" size={18} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label={draft.occurrenceCategory} onPress={() => setDraft((item) => ({ ...item, occurrenceCategory: cycleOption([...occurrenceCategories], item.occurrenceCategory as (typeof occurrenceCategories)[number]) }))}>
              <MaterialCommunityIcons name="shape-outline" size={18} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label={`Priority: ${draft.priority}`} onPress={() => setDraft((item) => ({ ...item, priority: cycleOption(incidentPriorities, item.priority) }))}>
              <MaterialCommunityIcons name="flag-outline" size={18} color={draft.priority === "Urgent" ? colors.danger : colors.warning} />
            </SecondaryButton>
            <SecondaryButton label={incidentWorkflowService.statusLabel(draft.status)} onPress={() => setDraft((item) => ({ ...item, status: cycleOption(incidentStatuses, item.status) }))}>
              <MaterialCommunityIcons name="progress-check" size={18} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
          <View style={styles.formRow}>
            <WorkflowField label="Date" value={draft.date} onChangeText={(date) => setDraft((item) => ({ ...item, date }))} />
            <WorkflowField label="Time" value={draft.time} onChangeText={(time) => setDraft((item) => ({ ...item, time }))} />
          </View>
          <WorkflowField label="Location" value={draft.location} onChangeText={(location) => setDraft((item) => ({ ...item, location }))} />
          <DisclaimerBanner message="Priority labels are local productivity labels only and do not replace official dispatch, RMS, supervision, or service policy." />
        </WorkflowFormPanel>
      ) : null}

      {stepIndex === 1 ? (
        <WorkflowFormPanel icon="account-multiple-outline" title="Persons Involved">
          <PrimaryButton label="Add Person" onPress={addPerson}>
            <MaterialCommunityIcons name="account-plus-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          {draft.personsInvolved.map((person) => (
            <View key={person.id} style={styles.workflowPanel}>
              <View style={styles.filterRow}>
                <SecondaryButton label={person.role} onPress={() => setDraft((item) => ({
                  ...item,
                  personsInvolved: item.personsInvolved.map((entry) => entry.id === person.id ? { ...entry, role: cycleOption(personRoles, entry.role) } : entry)
                }))}>
                  <MaterialCommunityIcons name="account-tag-outline" size={18} color={colors.primaryBlue} />
                </SecondaryButton>
                <SecondaryButton label="Remove" onPress={() => setDraft((item) => ({ ...item, personsInvolved: item.personsInvolved.filter((entry) => entry.id !== person.id) }))}>
                  <MaterialCommunityIcons name="delete-outline" size={18} color={colors.danger} />
                </SecondaryButton>
              </View>
              <WorkflowField label="Name placeholder" value={person.name} onChangeText={(name) => setDraft((item) => ({
                ...item,
                personsInvolved: item.personsInvolved.map((entry) => entry.id === person.id ? { ...entry, name } : entry)
              }))} />
              <View style={styles.formRow}>
                <WorkflowField label="Phone optional" value={person.phone} onChangeText={(phone) => setDraft((item) => ({
                  ...item,
                  personsInvolved: item.personsInvolved.map((entry) => entry.id === person.id ? { ...entry, phone } : entry)
                }))} />
                <WorkflowField label="Email optional" value={person.email} onChangeText={(email) => setDraft((item) => ({
                  ...item,
                  personsInvolved: item.personsInvolved.map((entry) => entry.id === person.id ? { ...entry, email } : entry)
                }))} />
              </View>
              <WorkflowField label="Notes" value={person.notes} onChangeText={(notes) => setDraft((item) => ({
                ...item,
                personsInvolved: item.personsInvolved.map((entry) => entry.id === person.id ? { ...entry, notes } : entry)
              }))} />
            </View>
          ))}
          <DisclaimerBanner message="Do not enter real personal information in this testing version." />
        </WorkflowFormPanel>
      ) : null}

      {stepIndex === 2 ? (
        <WorkflowFormPanel icon="account-voice" title="Witnesses">
          <PrimaryButton label="Add Witness" onPress={addWitness}>
            <MaterialCommunityIcons name="account-plus-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          {draft.witnessDetails.map((witness) => (
            <View key={witness.id} style={styles.workflowPanel}>
              <View style={styles.filterRow}>
                <SecondaryButton label={`Follow-up ${witness.followUpRequired ? "On" : "Off"}`} onPress={() => setDraft((item) => ({
                  ...item,
                  witnessDetails: item.witnessDetails.map((entry) => entry.id === witness.id ? { ...entry, followUpRequired: !entry.followUpRequired } : entry)
                }))}>
                  <MaterialCommunityIcons name={witness.followUpRequired ? "bell-check-outline" : "bell-off-outline"} size={18} color={colors.primaryBlue} />
                </SecondaryButton>
                <SecondaryButton label="Remove" onPress={() => setDraft((item) => ({ ...item, witnessDetails: item.witnessDetails.filter((entry) => entry.id !== witness.id) }))}>
                  <MaterialCommunityIcons name="delete-outline" size={18} color={colors.danger} />
                </SecondaryButton>
              </View>
              <WorkflowField label="Name placeholder" value={witness.name} onChangeText={(name) => setDraft((item) => ({
                ...item,
                witnessDetails: item.witnessDetails.map((entry) => entry.id === witness.id ? { ...entry, name } : entry)
              }))} />
              <WorkflowField label="Contact placeholder" value={witness.contact} onChangeText={(contact) => setDraft((item) => ({
                ...item,
                witnessDetails: item.witnessDetails.map((entry) => entry.id === witness.id ? { ...entry, contact } : entry)
              }))} />
              <WorkflowField label="Statement summary" multiline value={witness.statementSummary} onChangeText={(statementSummary) => setDraft((item) => ({
                ...item,
                witnessDetails: item.witnessDetails.map((entry) => entry.id === witness.id ? { ...entry, statementSummary } : entry)
              }))} />
            </View>
          ))}
        </WorkflowFormPanel>
      ) : null}

      {stepIndex === 3 ? (
        <WorkflowFormPanel icon="note-edit-outline" title="Notes">
          <WorkflowField label="Officer notes" multiline value={draft.incidentNotes.officerNotes} onChangeText={(officerNotes) => setDraft((item) => ({ ...item, incidentNotes: { ...item.incidentNotes, officerNotes } }))} />
          <WorkflowField label="Narrative draft" multiline value={draft.incidentNotes.narrativeDraft} onChangeText={(narrativeDraft) => setDraft((item) => ({ ...item, incidentNotes: { ...item.incidentNotes, narrativeDraft } }))} />
          <WorkflowField label="Observations" multiline value={draft.incidentNotes.observations} onChangeText={(observations) => setDraft((item) => ({ ...item, incidentNotes: { ...item.incidentNotes, observations } }))} />
          <WorkflowField label="Follow-up notes" multiline value={draft.incidentNotes.followUpNotes} onChangeText={(followUpNotes) => setDraft((item) => ({ ...item, incidentNotes: { ...item.incidentNotes, followUpNotes } }))} />
          <WorkflowField label="Disclosure notes placeholder" multiline value={draft.incidentNotes.disclosureNotes} onChangeText={(disclosureNotes) => setDraft((item) => ({ ...item, incidentNotes: { ...item.incidentNotes, disclosureNotes } }))} />
        </WorkflowFormPanel>
      ) : null}

      {stepIndex === 4 ? (
        <WorkflowFormPanel icon="paperclip" title="Attachment Metadata">
          <PrimaryButton label="Add Metadata" onPress={addAttachment}>
            <MaterialCommunityIcons name="paperclip-plus" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          {draft.attachmentMetadata.map((attachment) => (
            <View key={attachment.id} style={styles.workflowPanel}>
              <View style={styles.filterRow}>
                <SecondaryButton label={attachment.attachmentType} onPress={() => setDraft((item) => ({
                  ...item,
                  attachmentMetadata: item.attachmentMetadata.map((entry) => entry.id === attachment.id ? { ...entry, attachmentType: cycleOption(attachmentTypes, entry.attachmentType) } : entry)
                }))}>
                  <MaterialCommunityIcons name="paperclip" size={18} color={colors.primaryBlue} />
                </SecondaryButton>
                <SecondaryButton label="Remove" onPress={() => setDraft((item) => ({ ...item, attachmentMetadata: item.attachmentMetadata.filter((entry) => entry.id !== attachment.id) }))}>
                  <MaterialCommunityIcons name="delete-outline" size={18} color={colors.danger} />
                </SecondaryButton>
              </View>
              <WorkflowField label="File name placeholder" value={attachment.fileName} onChangeText={(fileName) => setDraft((item) => ({
                ...item,
                attachmentMetadata: item.attachmentMetadata.map((entry) => entry.id === attachment.id ? { ...entry, fileName } : entry)
              }))} />
              <WorkflowField label="Description" value={attachment.description} onChangeText={(description) => setDraft((item) => ({
                ...item,
                attachmentMetadata: item.attachmentMetadata.map((entry) => entry.id === attachment.id ? { ...entry, description } : entry)
              }))} />
              <WorkflowField label="Notes" multiline value={attachment.notes} onChangeText={(notes) => setDraft((item) => ({
                ...item,
                attachmentMetadata: item.attachmentMetadata.map((entry) => entry.id === attachment.id ? { ...entry, notes } : entry)
              }))} />
            </View>
          ))}
          <DisclaimerBanner message="Attachment metadata only. This sprint does not upload files or access camera, microphone, photos, or documents." />
        </WorkflowFormPanel>
      ) : null}

      {stepIndex === 5 ? (
        <WorkflowFormPanel icon="clipboard-check-outline" title="Review & Save">
          <View style={styles.reviewPanel}>
            <Text style={styles.profileName}>{incidentWorkflowService.createReviewSummary(draft)}</Text>
            <Text style={styles.profileMeta}>{completeness.complete} of {completeness.total} sections complete</Text>
            <Text style={styles.workflowSubtitle}>Persons: {draft.personsInvolved.length} - Witnesses: {draft.witnessDetails.length} - Attachments: {draft.attachmentMetadata.length}</Text>
          </View>
          <View style={styles.formRow}>
            <WorkflowField label="Follow-up date" value={followUpDate} onChangeText={setFollowUpDate} />
            <WorkflowField label="Calendar date" value={calendarDate} onChangeText={setCalendarDate} />
          </View>
          <View style={styles.filterRow}>
            <SecondaryButton label={`Task: ${followUpTitle}`} onPress={() => setFollowUpTitle((current) => cycleOption([...followUpTaskOptions], current))}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={18} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label={`Follow-up ${draft.followUpRequired ? "On" : "Off"}`} onPress={() => setDraft((item) => ({ ...item, followUpRequired: !item.followUpRequired, status: !item.followUpRequired ? "followUpRequired" : item.status }))}>
              <MaterialCommunityIcons name={draft.followUpRequired ? "bell-check-outline" : "bell-off-outline"} size={18} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
          <View style={styles.actionRow}>
            <PrimaryButton label="Save Draft" onPress={() => saveIncidentDraft("draft")}>
              <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} />
            </PrimaryButton>
            <SecondaryButton label="Mark Reviewed" onPress={() => saveIncidentDraft("reviewed")}>
              <MaterialCommunityIcons name="check-decagram-outline" size={20} color={colors.ptsdGreen} />
            </SecondaryButton>
            <SecondaryButton label="Archive" onPress={() => saveIncidentDraft("archived")}>
              <MaterialCommunityIcons name="archive-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label="Create Follow-Up" onPress={createIncidentFollowUp}>
              <MaterialCommunityIcons name="bell-plus-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label="Add Calendar Reminder" onPress={createIncidentCalendarItem}>
              <MaterialCommunityIcons name="calendar-plus-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label="Prepare for AI Review" onPress={showAiPlaceholder}>
              <MaterialCommunityIcons name="brain" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label="New Draft" onPress={resetDraft}>
              <MaterialCommunityIcons name="file-plus-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
        </WorkflowFormPanel>
      ) : null}

      <View style={styles.actionRow}>
        <SecondaryButton label="Back" onPress={() => setStepIndex(Math.max(0, stepIndex - 1))}>
          <Ionicons name="chevron-back" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton label="Next" onPress={() => setStepIndex(Math.min(incidentStepTitles.length - 1, stepIndex + 1))}>
          <Ionicons name="chevron-forward" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <PrimaryButton label="Save" onPress={() => saveIncidentDraft()}>
          <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} />
        </PrimaryButton>
      </View>

      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="OPAi Police is a productivity and AI assistance tool." />
      <DisclaimerBanner message="New Incident drafts are local prototype records only and do not replace official police RMS, notebook requirements, reporting systems, supervision, policy, or legal obligations." />
      <DisclaimerBanner message="Do not enter real police records, confidential information, sensitive personal information, or real evidence into this testing version." />
      <DisclaimerBanner message="Future AI-assisted report features may produce incomplete or inaccurate content and must be verified by the user." />
      <LocalPrototypeWarning />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}
function AIAssistantScreen({
  isTablet,
  localData,
  onAddHistory,
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onAddHistory: (prompt: string) => void;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
  const tools = aiService.getSuggestedActions();

  return (
    <ScreenFrame activeModule="ai" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="AI Assistant" />
      <View style={styles.aiPanel}>
        <View style={styles.aiOrb}>
          <MaterialCommunityIcons name="brain" size={44} color={colors.primaryBlue} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>OPAi AI</Text>
          <Text style={styles.heroSub}>Talk. Ask. Draft.</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <SecondaryButton label="Talk">
          <MaterialCommunityIcons name="microphone-outline" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton label="Report" onPress={() => onSelectModule("incident")}>
          <MaterialCommunityIcons name="file-plus-outline" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
      </View>

      <SectionHeader icon="brain" title="AI Tools" />
      <View style={[styles.reminderGrid, isTablet ? styles.reminderGridTablet : null]}>
        {tools.map((tool) => (
          <ReminderCard
            active={selectedItem === tool.title}
            key={tool.title}
            onPress={() => onSelectItem(tool.title)}
            {...tool}
          />
        ))}
      </View>

      <SectionHeader icon="history" title="Local Demo History" />
      <View style={styles.stack}>
        {localData.aiHistory.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            icon="history"
            key={item.id}
            onPress={() => onSelectItem(item.title)}
            subtitle={item.response}
            title={item.title}
          />
        ))}
      </View>

      <AIInputBar
        onPress={() => {
          onSelectItem("AI input preview");
          onAddHistory("Voice or text command");
        }}
        placeholder="Voice or text command..."
      />
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Static UI only. AI calls and data processing start in a later sprint." />
      <LocalPrototypeWarning />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function TranslationScreen({
  isTablet,
  localData,
  onAddHistory,
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onAddHistory: (prompt: string) => void;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
  const modes = translationService.getModes();
  const examples = translationService.getExamples();

  return (
    <ScreenFrame activeModule="translation" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Translation" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Communicate clearly.</Text>
          <Text style={styles.heroSub}>Text, voice, camera, document.</Text>
        </View>
        <MaterialCommunityIcons name="translate" size={48} color={colors.primaryBlue} />
      </View>

      <SectionHeader icon="translate" title="Modes" />
      <View style={[styles.grid, isTablet ? styles.gridTablet : null]}>
        {modes.map((mode) => (
          <FeatureCard
            compact={isTablet}
            icon={mode.icon}
            key={mode.title}
            onPress={() => onSelectItem(mode.title)}
            subtitle={mode.subtitle}
            title={mode.title}
          />
        ))}
      </View>

      <SectionHeader icon="message-text-outline" title="Examples" />
      <View style={styles.stack}>
        {examples.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            key={item.title}
            onPress={() => onSelectItem(item.title)}
            {...item}
          />
        ))}
      </View>

      <SectionHeader icon="history" title="Local Translation History" />
      <View style={styles.stack}>
        {localData.translationHistory.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            icon="history"
            key={item.id}
            onPress={() => onSelectItem(item.title)}
            subtitle={item.response}
            title={item.title}
          />
        ))}
      </View>

      <AIInputBar
        onPress={() => {
          onSelectItem("Translation input");
          onAddHistory("Enter text to translate");
        }}
        placeholder="Enter text to translate..."
      />
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Translation is a static preview. Police-context translation logic is not connected yet." />
      <LocalPrototypeWarning />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function cycleOption<T extends string>(options: T[], current: T): T {
  const next = options[(options.indexOf(current) + 1) % options.length];
  return next ?? current;
}

function newWorkflowId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function createBlankCalendarDraft(): CalendarWorkflowEvent {
  const now = new Date().toISOString();

  return {
    createdAt: now,
    date: workflowService.today(),
    id: newWorkflowId("calendar-workflow"),
    location: "",
    notes: "",
    reminderEnabled: true,
    reminderLeadTime: "1Hour",
    status: "upcoming",
    time: "09:00",
    title: "",
    type: "General",
    updatedAt: now
  };
}

function createBlankCourtDraft(): CourtWorkflowEvent {
  const now = new Date().toISOString();

  return {
    courtName: "",
    courtroom: "",
    createdAt: now,
    date: workflowService.today(),
    fileReference: "",
    id: newWorkflowId("court-workflow"),
    location: "",
    matterName: "",
    notes: "",
    reminderEnabled: true,
    reminderLeadTime: "1Hour",
    status: "upcoming",
    time: "09:00",
    updatedAt: now
  };
}

function createBlankTrainingDraft(): TrainingWorkflowEvent {
  const now = new Date().toISOString();

  return {
    category: "Other",
    createdAt: now,
    date: workflowService.today(),
    id: newWorkflowId("training-workflow"),
    instructorOrUnit: "",
    location: "",
    notes: "",
    reminderEnabled: true,
    reminderLeadTime: "1Day",
    status: "upcoming",
    time: "09:00",
    title: "",
    updatedAt: now
  };
}

function createBlankRequalificationDraft(): RequalificationWorkflowReminder {
  const now = new Date().toISOString();

  return {
    category: "Other",
    createdAt: now,
    dueDate: workflowService.today(),
    expiryDate: workflowService.today(),
    id: newWorkflowId("requalification-workflow"),
    notes: "",
    reminderEnabled: true,
    reminderLeadTime: "1Week",
    status: "valid",
    title: "",
    updatedAt: now
  };
}

function createBlankFollowUpDraft(): FollowUpWorkflowReminder {
  const now = new Date().toISOString();

  return {
    createdAt: now,
    dueDate: workflowService.today(),
    id: newWorkflowId("follow-up-workflow"),
    notes: "",
    priority: "medium",
    relatedIncidentId: "",
    reminderEnabled: true,
    reminderLeadTime: "1Hour",
    status: "open",
    title: "",
    updatedAt: now
  };
}

function CalendarScreen({
  isTablet,
  localData,
  onCancelReminder,
  onScheduleReminder,
  onSelectItem,
  onSelectModule,
  onUpdateLocalData,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onCancelReminder: (relatedEntityId: string) => Promise<void>;
  onScheduleReminder: (reminder: ScheduledReminder) => Promise<void>;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  selectedItem: string;
}) {
  const [filter, setFilter] = useState<CalendarWorkflowType | "All">("All");
  const [eventDraft, setEventDraft] = useState<CalendarWorkflowEvent>(createBlankCalendarDraft);
  const [eventEditingId, setEventEditingId] = useState<string | null>(null);
  const [followUpDraft, setFollowUpDraft] = useState<FollowUpWorkflowReminder>(createBlankFollowUpDraft);
  const [followUpEditingId, setFollowUpEditingId] = useState<string | null>(null);
  const events = workflowService
    .sortByDateTime(localData.calendarWorkflowEvents)
    .filter((event) => filter === "All" || event.type === filter);
  const followUps = workflowService.sortByDateTime(localData.followUpWorkflowReminders);

  const resetEventDraft = () => {
    setEventDraft(createBlankCalendarDraft());
    setEventEditingId(null);
  };

  const resetFollowUpDraft = () => {
    setFollowUpDraft(createBlankFollowUpDraft());
    setFollowUpEditingId(null);
  };

  const saveCalendarEvent = async () => {
    const missing = workflowService.validateRequired({
      date: eventDraft.date,
      time: eventDraft.time,
      title: eventDraft.title
    });

    if (missing.length > 0) {
      Alert.alert("Missing Details", "Add a title, date, and time before saving.");
      return;
    }

    const now = new Date().toISOString();
    const item: CalendarWorkflowEvent = {
      ...eventDraft,
      createdAt: eventEditingId ? eventDraft.createdAt : now,
      id: eventEditingId ?? eventDraft.id,
      location: eventDraft.location.trim(),
      notes: eventDraft.notes.trim(),
      title: eventDraft.title.trim(),
      updatedAt: now
    };

    onUpdateLocalData((current) => ({
      ...current,
      calendarWorkflowEvents: workflowService.sortByDateTime([
        item,
        ...current.calendarWorkflowEvents.filter((event) => event.id !== item.id)
      ]),
      updatedAt: now
    }));

    if (item.reminderEnabled && item.status === "upcoming") {
      await onScheduleReminder(workflowService.createCalendarReminder(item));
    } else {
      await onCancelReminder(item.id);
    }

    onSelectItem(item.title);
    resetEventDraft();
  };

  const saveFollowUp = async () => {
    const missing = workflowService.validateRequired({
      dueDate: followUpDraft.dueDate,
      title: followUpDraft.title
    });

    if (missing.length > 0) {
      Alert.alert("Missing Details", "Add a title and due date before saving.");
      return;
    }

    const now = new Date().toISOString();
    const item: FollowUpWorkflowReminder = {
      ...followUpDraft,
      notes: followUpDraft.notes.trim(),
      relatedIncidentId: followUpDraft.relatedIncidentId.trim(),
      createdAt: followUpEditingId ? followUpDraft.createdAt : now,
      id: followUpEditingId ?? followUpDraft.id,
      status: workflowService.calculateFollowUpStatus(followUpDraft),
      title: followUpDraft.title.trim(),
      updatedAt: now
    };

    onUpdateLocalData((current) => ({
      ...current,
      followUpWorkflowReminders: workflowService.sortByDateTime([
        item,
        ...current.followUpWorkflowReminders.filter((followUp) => followUp.id !== item.id)
      ]),
      updatedAt: now
    }));

    if (item.reminderEnabled && item.status === "open") {
      await onScheduleReminder(workflowService.createFollowUpReminder(item));
    } else {
      await onCancelReminder(item.id);
    }

    onSelectItem(item.title);
    resetFollowUpDraft();
  };

  const deleteCalendarEvent = (item: CalendarWorkflowEvent) => {
    Alert.alert("Delete Calendar Item", "Remove this local prototype item?", [
      { style: "cancel", text: "Cancel" },
      {
        onPress: async () => {
          onUpdateLocalData((current) => ({
            ...current,
            calendarWorkflowEvents: current.calendarWorkflowEvents.filter((event) => event.id !== item.id),
            updatedAt: new Date().toISOString()
          }));
          await onCancelReminder(item.id);
        },
        style: "destructive",
        text: "Delete"
      }
    ]);
  };

  const deleteFollowUp = (item: FollowUpWorkflowReminder) => {
    Alert.alert("Delete Follow-Up", "Remove this local prototype follow-up?", [
      { style: "cancel", text: "Cancel" },
      {
        onPress: async () => {
          onUpdateLocalData((current) => ({
            ...current,
            followUpWorkflowReminders: current.followUpWorkflowReminders.filter((followUp) => followUp.id !== item.id),
            updatedAt: new Date().toISOString()
          }));
          await onCancelReminder(item.id);
        },
        style: "destructive",
        text: "Delete"
      }
    ]);
  };

  const updateCalendarStatus = async (item: CalendarWorkflowEvent, status: CalendarWorkflowStatus) => {
    const next = { ...item, status, updatedAt: new Date().toISOString() };
    onUpdateLocalData((current) => ({
      ...current,
      calendarWorkflowEvents: current.calendarWorkflowEvents.map((event) => (event.id === next.id ? next : event)),
      updatedAt: next.updatedAt
    }));

    if (next.reminderEnabled && next.status === "upcoming") {
      await onScheduleReminder(workflowService.createCalendarReminder(next));
    } else {
      await onCancelReminder(next.id);
    }
  };

  const updateFollowUpStatus = async (item: FollowUpWorkflowReminder, status: FollowUpWorkflowStatus) => {
    const next = { ...item, status, updatedAt: new Date().toISOString() };
    onUpdateLocalData((current) => ({
      ...current,
      followUpWorkflowReminders: current.followUpWorkflowReminders.map((followUp) => (followUp.id === next.id ? next : followUp)),
      updatedAt: next.updatedAt
    }));

    if (next.reminderEnabled && next.status === "open") {
      await onScheduleReminder(workflowService.createFollowUpReminder(next));
    } else {
      await onCancelReminder(next.id);
    }
  };

  return (
    <ScreenFrame activeModule="calendar" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Calendar" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Know what is next.</Text>
          <Text style={styles.heroSub}>Court, training, follow-ups.</Text>
        </View>
        <Ionicons name="calendar-outline" size={48} color={colors.primaryBlue} />
      </View>

      <SectionHeader icon="filter-outline" title="Filters" />
      <View style={styles.filterRow}>
        {(["All", ...calendarTypeOptions] as Array<CalendarWorkflowType | "All">).map((option) => (
          <SecondaryButton key={option} label={option} onPress={() => setFilter(option)}>
            <MaterialCommunityIcons name={filter === option ? "check-circle-outline" : "circle-outline"} size={18} color={colors.primaryBlue} />
          </SecondaryButton>
        ))}
      </View>

      <WorkflowFormPanel icon="calendar-plus-outline" title={eventEditingId ? "Edit Calendar Item" : "Add Calendar Item"}>
        <WorkflowField label="Title" value={eventDraft.title} onChangeText={(title) => setEventDraft((draft) => ({ ...draft, title }))} />
        <View style={styles.formRow}>
          <WorkflowField label="Date" value={eventDraft.date} onChangeText={(date) => setEventDraft((draft) => ({ ...draft, date }))} />
          <WorkflowField label="Time" value={eventDraft.time} onChangeText={(time) => setEventDraft((draft) => ({ ...draft, time }))} />
        </View>
        <WorkflowField label="Location" value={eventDraft.location} onChangeText={(location) => setEventDraft((draft) => ({ ...draft, location }))} />
        <WorkflowField label="Notes" multiline value={eventDraft.notes} onChangeText={(notes) => setEventDraft((draft) => ({ ...draft, notes }))} />
        <View style={styles.filterRow}>
          <SecondaryButton label={`Type: ${eventDraft.type}`} onPress={() => setEventDraft((draft) => ({ ...draft, type: cycleOption(calendarTypeOptions, draft.type) }))}>
            <MaterialCommunityIcons name="shape-outline" size={18} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label={`Status: ${workflowService.statusLabel(eventDraft.status)}`} onPress={() => setEventDraft((draft) => ({ ...draft, status: cycleOption(calendarStatusOptions, draft.status) }))}>
            <MaterialCommunityIcons name="progress-check" size={18} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label={leadTimeLabels[eventDraft.reminderLeadTime]} onPress={() => setEventDraft((draft) => ({ ...draft, reminderLeadTime: cycleOption(leadTimeOptions, draft.reminderLeadTime) }))}>
            <MaterialCommunityIcons name="timer-outline" size={18} color={colors.ptsdGreen} />
          </SecondaryButton>
          <SecondaryButton label={`Reminder ${eventDraft.reminderEnabled ? "On" : "Off"}`} onPress={() => setEventDraft((draft) => ({ ...draft, reminderEnabled: !draft.reminderEnabled }))}>
            <MaterialCommunityIcons name={eventDraft.reminderEnabled ? "bell-check-outline" : "bell-off-outline"} size={18} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <View style={styles.actionRow}>
          <PrimaryButton label={eventEditingId ? "Save Changes" : "Add Item"} onPress={saveCalendarEvent}>
            <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          <SecondaryButton label="Reset" onPress={resetEventDraft}>
            <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
      </WorkflowFormPanel>

      <SectionHeader icon="calendar-month-outline" title="Calendar Items" />
      <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
        {events.map((event) => (
          <WorkflowItemCard
            accent={event.type === "Court" ? "#B56CFF" : event.type === "Training" ? colors.primaryBlue : event.type === "Requalification" ? colors.ptsdGreen : colors.accentBlue}
            active={selectedItem === event.title}
            icon={event.type === "Court" ? "scale-balance" : event.type === "Training" ? "school-outline" : event.type === "Follow-up" ? "clipboard-check-outline" : "calendar-outline"}
            key={event.id}
            meta={`${event.date} - ${event.time} - ${event.location || "No location"}`}
            status={workflowService.statusLabel(event.status)}
            subtitle={event.notes || `${event.type} reminder`}
            title={event.title}
            reminderEnabled={event.reminderEnabled}
            onPress={() => onSelectItem(event.title)}
            onEdit={() => {
              setEventDraft(event);
              setEventEditingId(event.id);
            }}
            onDelete={() => deleteCalendarEvent(event)}
            onPrimary={() => updateCalendarStatus(event, event.status === "completed" ? "upcoming" : "completed")}
            primaryLabel={event.status === "completed" ? "Reopen" : "Complete"}
          />
        ))}
      </View>
      {events.length === 0 ? (
        <EmptyState icon="calendar-blank-outline" title="No calendar items" message="Add local prototype items or change the filter." />
      ) : null}

      <WorkflowFormPanel icon="clipboard-plus-outline" title={followUpEditingId ? "Edit Follow-Up" : "Add Follow-Up"}>
        <WorkflowField label="Title" value={followUpDraft.title} onChangeText={(title) => setFollowUpDraft((draft) => ({ ...draft, title }))} />
        <View style={styles.formRow}>
          <WorkflowField label="Due Date" value={followUpDraft.dueDate} onChangeText={(dueDate) => setFollowUpDraft((draft) => ({ ...draft, dueDate }))} />
          <WorkflowField label="Incident ID" value={followUpDraft.relatedIncidentId} onChangeText={(relatedIncidentId) => setFollowUpDraft((draft) => ({ ...draft, relatedIncidentId }))} />
        </View>
        <WorkflowField label="Notes" multiline value={followUpDraft.notes} onChangeText={(notes) => setFollowUpDraft((draft) => ({ ...draft, notes }))} />
        <View style={styles.filterRow}>
          <SecondaryButton label={`Priority: ${followUpDraft.priority}`} onPress={() => setFollowUpDraft((draft) => ({ ...draft, priority: cycleOption(followUpPriorityOptions, draft.priority) }))}>
            <MaterialCommunityIcons name="flag-outline" size={18} color={colors.warning} />
          </SecondaryButton>
          <SecondaryButton label={`Status: ${workflowService.statusLabel(followUpDraft.status)}`} onPress={() => setFollowUpDraft((draft) => ({ ...draft, status: cycleOption(followUpStatusOptions, draft.status) }))}>
            <MaterialCommunityIcons name="progress-check" size={18} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label={leadTimeLabels[followUpDraft.reminderLeadTime]} onPress={() => setFollowUpDraft((draft) => ({ ...draft, reminderLeadTime: cycleOption(leadTimeOptions, draft.reminderLeadTime) }))}>
            <MaterialCommunityIcons name="timer-outline" size={18} color={colors.ptsdGreen} />
          </SecondaryButton>
          <SecondaryButton label={`Reminder ${followUpDraft.reminderEnabled ? "On" : "Off"}`} onPress={() => setFollowUpDraft((draft) => ({ ...draft, reminderEnabled: !draft.reminderEnabled }))}>
            <MaterialCommunityIcons name={followUpDraft.reminderEnabled ? "bell-check-outline" : "bell-off-outline"} size={18} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <View style={styles.actionRow}>
          <PrimaryButton label={followUpEditingId ? "Save Follow-Up" : "Add Follow-Up"} onPress={saveFollowUp}>
            <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          <SecondaryButton label="Reset" onPress={resetFollowUpDraft}>
            <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
      </WorkflowFormPanel>

      <SectionHeader icon="clipboard-check-outline" title="Follow-Up Reminders" />
      <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
        {followUps.map((item) => (
          <WorkflowItemCard
            accent={item.priority === "high" ? colors.warning : item.priority === "medium" ? colors.primaryBlue : colors.ptsdGreen}
            active={selectedItem === item.title}
            icon="clipboard-check-outline"
            key={item.id}
            meta={`Due ${item.dueDate}${item.relatedIncidentId ? ` - ${item.relatedIncidentId}` : ""}`}
            status={workflowService.statusLabel(workflowService.calculateFollowUpStatus(item))}
            subtitle={item.notes || "Local follow-up reminder"}
            title={item.title}
            reminderEnabled={item.reminderEnabled}
            onPress={() => onSelectItem(item.title)}
            onEdit={() => {
              setFollowUpDraft(item);
              setFollowUpEditingId(item.id);
            }}
            onDelete={() => deleteFollowUp(item)}
            onPrimary={() => updateFollowUpStatus(item, item.status === "completed" ? "open" : "completed")}
            primaryLabel={item.status === "completed" ? "Reopen" : "Complete"}
          />
        ))}
      </View>

      <SecondaryButton label="External Sync Later">
        <Ionicons name="lock-closed-outline" size={20} color={colors.primaryBlue} />
      </SecondaryButton>
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Calendar sync requires explicit authorization and is not connected in Sprint 009. These items are local prototype data only." />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function CourtScreen({
  isTablet,
  localData,
  onCancelReminder,
  onScheduleReminder,
  onSelectItem,
  onSelectModule,
  onUpdateLocalData,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onCancelReminder: (relatedEntityId: string) => Promise<void>;
  onScheduleReminder: (reminder: ScheduledReminder) => Promise<void>;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  selectedItem: string;
}) {
  const [draft, setDraft] = useState<CourtWorkflowEvent>(createBlankCourtDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const events = workflowService.sortByDateTime(localData.courtWorkflowEvents);

  const resetDraft = () => {
    setDraft(createBlankCourtDraft());
    setEditingId(null);
  };

  const saveCourtEvent = async () => {
    const missing = workflowService.validateRequired({
      courtName: draft.courtName,
      date: draft.date,
      matterName: draft.matterName,
      time: draft.time
    });

    if (missing.length > 0) {
      Alert.alert("Missing Details", "Add a matter, court name, date, and time before saving.");
      return;
    }

    const now = new Date().toISOString();
    const item: CourtWorkflowEvent = {
      ...draft,
      courtName: draft.courtName.trim(),
      courtroom: draft.courtroom.trim(),
      createdAt: editingId ? draft.createdAt : now,
      fileReference: draft.fileReference.trim(),
      id: editingId ?? draft.id,
      location: draft.location.trim(),
      matterName: draft.matterName.trim(),
      notes: draft.notes.trim(),
      updatedAt: now
    };

    onUpdateLocalData((current) => ({
      ...current,
      courtWorkflowEvents: workflowService.sortByDateTime([
        item,
        ...current.courtWorkflowEvents.filter((event) => event.id !== item.id)
      ]),
      updatedAt: now
    }));

    if (item.reminderEnabled && item.status === "upcoming") {
      await onScheduleReminder(workflowService.createCourtReminder(item));
    } else {
      await onCancelReminder(item.id);
    }

    onSelectItem(item.matterName);
    resetDraft();
  };

  const deleteCourtEvent = (item: CourtWorkflowEvent) => {
    Alert.alert("Delete Court Reminder", "Remove this local prototype court reminder?", [
      { style: "cancel", text: "Cancel" },
      {
        onPress: async () => {
          onUpdateLocalData((current) => ({
            ...current,
            courtWorkflowEvents: current.courtWorkflowEvents.filter((event) => event.id !== item.id),
            updatedAt: new Date().toISOString()
          }));
          await onCancelReminder(item.id);
        },
        style: "destructive",
        text: "Delete"
      }
    ]);
  };

  const updateCourtStatus = async (item: CourtWorkflowEvent, status: CourtWorkflowStatus) => {
    const next = { ...item, status, updatedAt: new Date().toISOString() };
    onUpdateLocalData((current) => ({
      ...current,
      courtWorkflowEvents: current.courtWorkflowEvents.map((event) => (event.id === next.id ? next : event)),
      updatedAt: next.updatedAt
    }));

    if (next.reminderEnabled && next.status === "upcoming") {
      await onScheduleReminder(workflowService.createCourtReminder(next));
    } else {
      await onCancelReminder(next.id);
    }
  };

  return (
    <ScreenFrame activeModule="court" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Court" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Court ready.</Text>
          <Text style={styles.heroSub}>Dates, prep, follow-ups.</Text>
        </View>
        <MaterialCommunityIcons name="scale-balance" size={48} color={colors.primaryBlue} />
      </View>

      <WorkflowFormPanel icon="scale-balance" title={editingId ? "Edit Court Reminder" : "Add Court Reminder"}>
        <WorkflowField label="Matter" value={draft.matterName} onChangeText={(matterName) => setDraft((item) => ({ ...item, matterName }))} />
        <View style={styles.formRow}>
          <WorkflowField label="Date" value={draft.date} onChangeText={(date) => setDraft((item) => ({ ...item, date }))} />
          <WorkflowField label="Time" value={draft.time} onChangeText={(time) => setDraft((item) => ({ ...item, time }))} />
        </View>
        <WorkflowField label="Court Name" value={draft.courtName} onChangeText={(courtName) => setDraft((item) => ({ ...item, courtName }))} />
        <View style={styles.formRow}>
          <WorkflowField label="Courtroom" value={draft.courtroom} onChangeText={(courtroom) => setDraft((item) => ({ ...item, courtroom }))} />
          <WorkflowField label="File Ref" value={draft.fileReference} onChangeText={(fileReference) => setDraft((item) => ({ ...item, fileReference }))} />
        </View>
        <WorkflowField label="Location" value={draft.location} onChangeText={(location) => setDraft((item) => ({ ...item, location }))} />
        <WorkflowField label="Notes" multiline value={draft.notes} onChangeText={(notes) => setDraft((item) => ({ ...item, notes }))} />
        <View style={styles.filterRow}>
          <SecondaryButton label={`Status: ${workflowService.statusLabel(draft.status)}`} onPress={() => setDraft((item) => ({ ...item, status: cycleOption(courtStatusOptions, item.status) }))}>
            <MaterialCommunityIcons name="progress-check" size={18} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label={leadTimeLabels[draft.reminderLeadTime]} onPress={() => setDraft((item) => ({ ...item, reminderLeadTime: cycleOption(leadTimeOptions, item.reminderLeadTime) }))}>
            <MaterialCommunityIcons name="timer-outline" size={18} color={colors.ptsdGreen} />
          </SecondaryButton>
          <SecondaryButton label={`Reminder ${draft.reminderEnabled ? "On" : "Off"}`} onPress={() => setDraft((item) => ({ ...item, reminderEnabled: !item.reminderEnabled }))}>
            <MaterialCommunityIcons name={draft.reminderEnabled ? "bell-check-outline" : "bell-off-outline"} size={18} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <View style={styles.actionRow}>
          <PrimaryButton label={editingId ? "Save Court" : "Add Court"} onPress={saveCourtEvent}>
            <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          <SecondaryButton label="Reset" onPress={resetDraft}>
            <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
      </WorkflowFormPanel>

      <SectionHeader icon="scale-balance" title="Court Reminders" />
      <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
        {events.map((item) => (
          <WorkflowItemCard
            accent={item.status === "cancelled" ? colors.danger : item.status === "adjourned" ? colors.warning : "#B56CFF"}
            active={selectedItem === item.matterName}
            icon="scale-balance"
            key={item.id}
            meta={`${item.date} - ${item.time} - ${item.courtroom || "Courtroom TBD"}`}
            status={workflowService.statusLabel(item.status)}
            subtitle={`${item.courtName}${item.fileReference ? ` - ${item.fileReference}` : ""}`}
            title={item.matterName}
            reminderEnabled={item.reminderEnabled}
            onPress={() => onSelectItem(item.matterName)}
            onEdit={() => {
              setDraft(item);
              setEditingId(item.id);
            }}
            onDelete={() => deleteCourtEvent(item)}
            onPrimary={() => updateCourtStatus(item, item.status === "completed" ? "upcoming" : "completed")}
            primaryLabel={item.status === "completed" ? "Reopen" : "Complete"}
          />
        ))}
      </View>
      {events.length === 0 ? (
        <EmptyState icon="scale-balance" title="No court reminders" message="Add a local court reminder to test the workflow." />
      ) : null}
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Court reminders are productivity aids only. Always verify court dates, file details, locations, adjournments, and obligations through authorized systems." />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function TrainingScreen({
  isTablet,
  localData,
  onCancelReminder,
  onScheduleReminder,
  onSelectItem,
  onSelectModule,
  onUpdateLocalData,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onCancelReminder: (relatedEntityId: string) => Promise<void>;
  onScheduleReminder: (reminder: ScheduledReminder) => Promise<void>;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  selectedItem: string;
}) {
  const [trainingDraft, setTrainingDraft] = useState<TrainingWorkflowEvent>(createBlankTrainingDraft);
  const [trainingEditingId, setTrainingEditingId] = useState<string | null>(null);
  const [requalificationDraft, setRequalificationDraft] = useState<RequalificationWorkflowReminder>(createBlankRequalificationDraft);
  const [requalificationEditingId, setRequalificationEditingId] = useState<string | null>(null);
  const trainingEvents = workflowService.sortByDateTime(localData.trainingWorkflowEvents);
  const requalificationReminders = workflowService.sortByDateTime(
    localData.requalificationWorkflowReminders.map((item) => ({
      ...item,
      status: workflowService.calculateRequalificationStatus(item)
    }))
  );

  const resetTrainingDraft = () => {
    setTrainingDraft(createBlankTrainingDraft());
    setTrainingEditingId(null);
  };

  const resetRequalificationDraft = () => {
    setRequalificationDraft(createBlankRequalificationDraft());
    setRequalificationEditingId(null);
  };

  const saveTraining = async () => {
    const missing = workflowService.validateRequired({
      date: trainingDraft.date,
      time: trainingDraft.time,
      title: trainingDraft.title
    });

    if (missing.length > 0) {
      Alert.alert("Missing Details", "Add a title, date, and time before saving.");
      return;
    }

    const now = new Date().toISOString();
    const item: TrainingWorkflowEvent = {
      ...trainingDraft,
      createdAt: trainingEditingId ? trainingDraft.createdAt : now,
      id: trainingEditingId ?? trainingDraft.id,
      instructorOrUnit: trainingDraft.instructorOrUnit.trim(),
      location: trainingDraft.location.trim(),
      notes: trainingDraft.notes.trim(),
      title: trainingDraft.title.trim(),
      updatedAt: now
    };

    onUpdateLocalData((current) => ({
      ...current,
      trainingWorkflowEvents: workflowService.sortByDateTime([
        item,
        ...current.trainingWorkflowEvents.filter((event) => event.id !== item.id)
      ]),
      updatedAt: now
    }));

    if (item.reminderEnabled && item.status === "upcoming") {
      await onScheduleReminder(workflowService.createTrainingReminder(item));
    } else {
      await onCancelReminder(item.id);
    }

    onSelectItem(item.title);
    resetTrainingDraft();
  };

  const saveRequalification = async () => {
    const missing = workflowService.validateRequired({
      dueDate: requalificationDraft.dueDate,
      title: requalificationDraft.title
    });

    if (missing.length > 0) {
      Alert.alert("Missing Details", "Add a title and due date before saving.");
      return;
    }

    const now = new Date().toISOString();
    const calculatedStatus = workflowService.calculateRequalificationStatus(requalificationDraft);
    const item: RequalificationWorkflowReminder = {
      ...requalificationDraft,
      createdAt: requalificationEditingId ? requalificationDraft.createdAt : now,
      id: requalificationEditingId ?? requalificationDraft.id,
      notes: requalificationDraft.notes.trim(),
      status: requalificationDraft.status === "completed" ? "completed" : calculatedStatus,
      title: requalificationDraft.title.trim(),
      updatedAt: now
    };

    onUpdateLocalData((current) => ({
      ...current,
      requalificationWorkflowReminders: workflowService.sortByDateTime([
        item,
        ...current.requalificationWorkflowReminders.filter((reminderItem) => reminderItem.id !== item.id)
      ]),
      updatedAt: now
    }));

    if (item.reminderEnabled && item.status !== "completed") {
      await onScheduleReminder(workflowService.createRequalificationReminder(item));
    } else {
      await onCancelReminder(item.id);
    }

    onSelectItem(item.title);
    resetRequalificationDraft();
  };

  const deleteTraining = (item: TrainingWorkflowEvent) => {
    Alert.alert("Delete Training", "Remove this local prototype training item?", [
      { style: "cancel", text: "Cancel" },
      {
        onPress: async () => {
          onUpdateLocalData((current) => ({
            ...current,
            trainingWorkflowEvents: current.trainingWorkflowEvents.filter((event) => event.id !== item.id),
            updatedAt: new Date().toISOString()
          }));
          await onCancelReminder(item.id);
        },
        style: "destructive",
        text: "Delete"
      }
    ]);
  };

  const deleteRequalification = (item: RequalificationWorkflowReminder) => {
    Alert.alert("Delete Qualification", "Remove this local prototype qualification reminder?", [
      { style: "cancel", text: "Cancel" },
      {
        onPress: async () => {
          onUpdateLocalData((current) => ({
            ...current,
            requalificationWorkflowReminders: current.requalificationWorkflowReminders.filter((reminderItem) => reminderItem.id !== item.id),
            updatedAt: new Date().toISOString()
          }));
          await onCancelReminder(item.id);
        },
        style: "destructive",
        text: "Delete"
      }
    ]);
  };

  const updateTrainingStatus = async (item: TrainingWorkflowEvent, status: TrainingWorkflowStatus) => {
    const next = { ...item, status, updatedAt: new Date().toISOString() };
    onUpdateLocalData((current) => ({
      ...current,
      trainingWorkflowEvents: current.trainingWorkflowEvents.map((event) => (event.id === next.id ? next : event)),
      updatedAt: next.updatedAt
    }));

    if (next.reminderEnabled && next.status === "upcoming") {
      await onScheduleReminder(workflowService.createTrainingReminder(next));
    } else {
      await onCancelReminder(next.id);
    }
  };

  const updateRequalificationStatus = async (item: RequalificationWorkflowReminder, status: RequalificationWorkflowStatus) => {
    const next = { ...item, status, updatedAt: new Date().toISOString() };
    onUpdateLocalData((current) => ({
      ...current,
      requalificationWorkflowReminders: current.requalificationWorkflowReminders.map((reminderItem) => (reminderItem.id === next.id ? next : reminderItem)),
      updatedAt: next.updatedAt
    }));

    if (next.reminderEnabled && next.status !== "completed") {
      await onScheduleReminder(workflowService.createRequalificationReminder(next));
    } else {
      await onCancelReminder(next.id);
    }
  };

  return (
    <ScreenFrame activeModule="training" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Training" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Stay qualified.</Text>
          <Text style={styles.heroSub}>Training and requalification reminders.</Text>
        </View>
        <MaterialCommunityIcons name="school-outline" size={48} color={colors.primaryBlue} />
      </View>

      <WorkflowFormPanel icon="school-outline" title={trainingEditingId ? "Edit Training" : "Add Training"}>
        <WorkflowField label="Title" value={trainingDraft.title} onChangeText={(title) => setTrainingDraft((item) => ({ ...item, title }))} />
        <View style={styles.formRow}>
          <WorkflowField label="Date" value={trainingDraft.date} onChangeText={(date) => setTrainingDraft((item) => ({ ...item, date }))} />
          <WorkflowField label="Time" value={trainingDraft.time} onChangeText={(time) => setTrainingDraft((item) => ({ ...item, time }))} />
        </View>
        <WorkflowField label="Location" value={trainingDraft.location} onChangeText={(location) => setTrainingDraft((item) => ({ ...item, location }))} />
        <WorkflowField label="Instructor / Unit" value={trainingDraft.instructorOrUnit} onChangeText={(instructorOrUnit) => setTrainingDraft((item) => ({ ...item, instructorOrUnit }))} />
        <WorkflowField label="Notes" multiline value={trainingDraft.notes} onChangeText={(notes) => setTrainingDraft((item) => ({ ...item, notes }))} />
        <View style={styles.filterRow}>
          <SecondaryButton label={trainingDraft.category} onPress={() => setTrainingDraft((item) => ({ ...item, category: cycleOption(trainingCategoryOptions, item.category) }))}>
            <MaterialCommunityIcons name="tag-outline" size={18} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label={`Status: ${workflowService.statusLabel(trainingDraft.status)}`} onPress={() => setTrainingDraft((item) => ({ ...item, status: cycleOption(trainingStatusOptions, item.status) }))}>
            <MaterialCommunityIcons name="progress-check" size={18} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label={leadTimeLabels[trainingDraft.reminderLeadTime]} onPress={() => setTrainingDraft((item) => ({ ...item, reminderLeadTime: cycleOption(leadTimeOptions, item.reminderLeadTime) }))}>
            <MaterialCommunityIcons name="timer-outline" size={18} color={colors.ptsdGreen} />
          </SecondaryButton>
          <SecondaryButton label={`Reminder ${trainingDraft.reminderEnabled ? "On" : "Off"}`} onPress={() => setTrainingDraft((item) => ({ ...item, reminderEnabled: !item.reminderEnabled }))}>
            <MaterialCommunityIcons name={trainingDraft.reminderEnabled ? "bell-check-outline" : "bell-off-outline"} size={18} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <View style={styles.actionRow}>
          <PrimaryButton label={trainingEditingId ? "Save Training" : "Add Training"} onPress={saveTraining}>
            <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          <SecondaryButton label="Reset" onPress={resetTrainingDraft}>
            <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
      </WorkflowFormPanel>

      <SectionHeader icon="school-outline" title="Training Events" />
      <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
        {trainingEvents.map((item) => (
          <WorkflowItemCard
            accent={item.status === "cancelled" ? colors.danger : colors.primaryBlue}
            active={selectedItem === item.title}
            icon="school-outline"
            key={item.id}
            meta={`${item.date} - ${item.time} - ${item.location || "Location TBD"}`}
            status={workflowService.statusLabel(item.status)}
            subtitle={`${item.category}${item.instructorOrUnit ? ` - ${item.instructorOrUnit}` : ""}`}
            title={item.title}
            reminderEnabled={item.reminderEnabled}
            onPress={() => onSelectItem(item.title)}
            onEdit={() => {
              setTrainingDraft(item);
              setTrainingEditingId(item.id);
            }}
            onDelete={() => deleteTraining(item)}
            onPrimary={() => updateTrainingStatus(item, item.status === "completed" ? "upcoming" : "completed")}
            primaryLabel={item.status === "completed" ? "Reopen" : "Complete"}
          />
        ))}
      </View>

      <WorkflowFormPanel icon="target" title={requalificationEditingId ? "Edit Qualification" : "Add Qualification"}>
        <WorkflowField label="Title" value={requalificationDraft.title} onChangeText={(title) => setRequalificationDraft((item) => ({ ...item, title }))} />
        <View style={styles.formRow}>
          <WorkflowField label="Due Date" value={requalificationDraft.dueDate} onChangeText={(dueDate) => setRequalificationDraft((item) => ({ ...item, dueDate }))} />
          <WorkflowField label="Expiry Date" value={requalificationDraft.expiryDate} onChangeText={(expiryDate) => setRequalificationDraft((item) => ({ ...item, expiryDate }))} />
        </View>
        <WorkflowField label="Notes" multiline value={requalificationDraft.notes} onChangeText={(notes) => setRequalificationDraft((item) => ({ ...item, notes }))} />
        <View style={styles.filterRow}>
          <SecondaryButton label={requalificationDraft.category} onPress={() => setRequalificationDraft((item) => ({ ...item, category: cycleOption(requalificationCategoryOptions, item.category) }))}>
            <MaterialCommunityIcons name="tag-outline" size={18} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label={`Status: ${workflowService.statusLabel(workflowService.calculateRequalificationStatus(requalificationDraft))}`} onPress={() => setRequalificationDraft((item) => ({ ...item, status: cycleOption(requalificationStatusOptions, item.status) }))}>
            <MaterialCommunityIcons name="progress-check" size={18} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label={leadTimeLabels[requalificationDraft.reminderLeadTime]} onPress={() => setRequalificationDraft((item) => ({ ...item, reminderLeadTime: cycleOption(leadTimeOptions, item.reminderLeadTime) }))}>
            <MaterialCommunityIcons name="timer-outline" size={18} color={colors.ptsdGreen} />
          </SecondaryButton>
          <SecondaryButton label={`Reminder ${requalificationDraft.reminderEnabled ? "On" : "Off"}`} onPress={() => setRequalificationDraft((item) => ({ ...item, reminderEnabled: !item.reminderEnabled }))}>
            <MaterialCommunityIcons name={requalificationDraft.reminderEnabled ? "bell-check-outline" : "bell-off-outline"} size={18} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <View style={styles.actionRow}>
          <PrimaryButton label={requalificationEditingId ? "Save Qualification" : "Add Qualification"} onPress={saveRequalification}>
            <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          <SecondaryButton label="Reset" onPress={resetRequalificationDraft}>
            <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
      </WorkflowFormPanel>

      <SectionHeader icon="target" title="Requalification" />
      <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
        {requalificationReminders.map((item) => (
          <WorkflowItemCard
            accent={item.status === "overdue" ? colors.danger : item.status === "dueSoon" ? colors.warning : colors.ptsdGreen}
            active={selectedItem === item.title}
            icon="target"
            key={item.id}
            meta={`Due ${item.dueDate} - Expires ${item.expiryDate || "TBD"}`}
            status={workflowService.statusLabel(item.status)}
            subtitle={item.category}
            title={item.title}
            reminderEnabled={item.reminderEnabled}
            onPress={() => onSelectItem(item.title)}
            onEdit={() => {
              setRequalificationDraft(item);
              setRequalificationEditingId(item.id);
            }}
            onDelete={() => deleteRequalification(item)}
            onPrimary={() => updateRequalificationStatus(item, item.status === "completed" ? workflowService.calculateRequalificationStatus(item) : "completed")}
            primaryLabel={item.status === "completed" ? "Reopen" : "Complete"}
          />
        ))}
      </View>
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Training and requalification reminders are supportive local reminders only. Verify all mandatory training, qualifications, and policy requirements through authorized systems and supervisors." />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function NotesFilesScreen({
  isTablet,
  localData,
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
  const items = notesService.getNotesAndFiles(localData);

  return (
    <ScreenFrame activeModule="notes" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Notes & Files" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Organize locally.</Text>
          <Text style={styles.heroSub}>Placeholder notes and files.</Text>
        </View>
        <MaterialCommunityIcons name="folder-outline" size={48} color={colors.primaryBlue} />
      </View>

      <SectionHeader icon="folder-outline" title="Local Samples" />
      <View style={styles.stack}>
        {items.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            key={item.title}
            onPress={() => onSelectItem(item.title)}
            {...item}
          />
        ))}
      </View>
      <PrototypeSelection label={selectedItem} />
      <LocalPrototypeWarning />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function SettingsScreen({
  isTablet,
  localData,
  onClearLocalData,
  onResetDemoData,
  onSelectItem,
  onSelectModule,
  onSignOut,
  onUpdateLocalData,
  profile,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onClearLocalData: () => Promise<void>;
  onResetDemoData: () => Promise<void>;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onSignOut: () => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  profile: MockUserProfile | null;
  selectedItem: string;
}) {
  const notificationPreference = localData.notificationPreference;

  const togglePreference = (
    key: "biometricEnabled" | "notificationsEnabled" | "ptsdRemindersEnabled"
  ) => {
    onUpdateLocalData((current) => {
      const nextValue = !current.preferences[key];
      return {
        ...current,
        auth: {
          ...current.auth,
          biometricPreference:
            key === "biometricEnabled" ? (nextValue ? "deviceBiometrics" : "disabled") : current.auth.biometricPreference,
          notificationPreferences:
            key === "notificationsEnabled"
              ? {
                  courtReminders: nextValue,
                  shiftReminders: nextValue,
                  trainingReminders: nextValue,
                  wellnessReminders: nextValue
                }
              : current.auth.notificationPreferences,
          profile: current.auth.profile
            ? {
                ...current.auth.profile,
                biometricEnabled: key === "biometricEnabled" ? nextValue : current.auth.profile.biometricEnabled,
                notificationPreferences:
                  key === "notificationsEnabled"
                    ? {
                        courtReminders: nextValue,
                        shiftReminders: nextValue,
                        trainingReminders: nextValue,
                        wellnessReminders: nextValue
                      }
                    : current.auth.profile.notificationPreferences
              }
            : null
        },
        preferences: {
          ...current.preferences,
          [key]: nextValue
        },
        notificationPreference: {
          ...current.notificationPreference,
          enabled: key === "notificationsEnabled" ? nextValue : current.notificationPreference.enabled,
          lastUpdatedAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      };
    });
  };

  const updateNotificationPreference = (updater: (current: NotificationPreference) => NotificationPreference) => {
    onUpdateLocalData((current) => {
      const nextPreference = updater(current.notificationPreference);
      return {
        ...current,
        auth: {
          ...current.auth,
          notificationPreferences: {
            courtReminders: nextPreference.courtRemindersEnabled,
            shiftReminders: nextPreference.startShiftRemindersEnabled,
            trainingReminders: nextPreference.trainingRemindersEnabled,
            wellnessReminders: current.auth.notificationPreferences.wellnessReminders
          },
          profile: current.auth.profile
            ? {
                ...current.auth.profile,
                notificationPreferences: {
                  courtReminders: nextPreference.courtRemindersEnabled,
                  shiftReminders: nextPreference.startShiftRemindersEnabled,
                  trainingReminders: nextPreference.trainingRemindersEnabled,
                  wellnessReminders: current.auth.profile.notificationPreferences.wellnessReminders
                }
              }
            : null
        },
        notificationPreference: nextPreference,
        preferences: {
          ...current.preferences,
          notificationsEnabled: nextPreference.enabled
        },
        updatedAt: new Date().toISOString()
      };
    });
  };

  const toggleNotificationCategory = (key: (typeof notificationPreferenceRows)[number]["key"]) => {
    updateNotificationPreference((current) => ({
      ...current,
      [key]: !current[key],
      lastUpdatedAt: new Date().toISOString()
    }));
  };

  const cycleLeadTime = (category: NotificationCategory) => {
    updateNotificationPreference((current) => {
      const currentLeadTime = current.reminderLeadTimes[category];
      const nextIndex = (leadTimeOptions.indexOf(currentLeadTime) + 1) % leadTimeOptions.length;
      return {
        ...current,
        lastUpdatedAt: new Date().toISOString(),
        reminderLeadTimes: {
          ...current.reminderLeadTimes,
          [category]: leadTimeOptions[nextIndex]
        }
      };
    });
  };

  const handleRequestNotificationPermission = async () => {
    try {
      const status = await notificationService.requestPermission();
      updateNotificationPreference((current) => ({
        ...current,
        enabled: status === "granted",
        lastUpdatedAt: new Date().toISOString(),
        permissionPromptSeen: true,
        permissionStatus: status
      }));
      Alert.alert("Notification Permission", status === "granted" ? "Local reminders are enabled." : "Permission was not granted.");
    } catch {
      Alert.alert("Notification Permission", "Could not request notification permission on this device.");
    }
  };

  const handleMaybeLater = () => {
    updateNotificationPreference((current) => ({
      ...current,
      enabled: false,
      lastUpdatedAt: new Date().toISOString(),
      permissionPromptSeen: true,
      permissionStatus: "maybeLater"
    }));
  };

  const scheduleDemo = async (kind: "test" | "court" | "training") => {
    try {
      const localNotificationId =
        kind === "court"
          ? await notificationService.scheduleDemoCourtReminder()
          : kind === "training"
            ? await notificationService.scheduleDemoTrainingReminder()
            : await notificationService.scheduleTestNotification();

      const now = new Date().toISOString();
      const reminder: ScheduledReminder = {
        body:
          kind === "court"
            ? "Demo court reminder. Verify official court details through authorized systems."
            : kind === "training"
              ? "Demo training reminder. Confirm official training details through authorized systems."
              : "This is a local prototype notification. No remote push service was used.",
        createdAt: now,
        enabled: true,
        id: `scheduled-${kind}-${Date.now()}`,
        localNotificationId,
        relatedEntityId: `${kind}-demo`,
        relatedEntityType: kind === "court" ? "court" : kind === "training" ? "training" : "system",
        scheduledAt: new Date(Date.now() + 10 * 1000).toISOString(),
        title: kind === "court" ? "Demo Court Reminder" : kind === "training" ? "Demo Training Reminder" : "OPAi Test Reminder",
        type: kind === "court" ? "courtReminder" : kind === "training" ? "trainingReminder" : "systemReminder",
        updatedAt: now
      };

      onUpdateLocalData((current) => ({
        ...current,
        scheduledReminders: [
          reminder,
          ...current.scheduledReminders
        ].slice(0, 20),
        updatedAt: now
      }));
      Alert.alert("Local Notification Scheduled", "A local prototype notification was scheduled for about 10 seconds from now.");
    } catch {
      Alert.alert("Local Notification", "Could not schedule the local notification. Check device notification permission.");
    }
  };

  const scheduleStoredReminders = async () => {
    try {
      const candidates = notificationService.buildScheduledReminderMetadata(localData).slice(0, 8);
      const scheduled: ScheduledReminder[] = [];

      for (const reminder of candidates) {
        scheduled.push(await notificationService.scheduleReminder(reminder));
      }

      onUpdateLocalData((current) => ({
        ...current,
        scheduledReminders: scheduled,
        updatedAt: new Date().toISOString()
      }));
      Alert.alert("Local Reminders Scheduled", `${scheduled.length} prototype reminders were scheduled locally.`);
    } catch {
      Alert.alert("Local Reminders", "Could not schedule local reminders. Check device notification permission.");
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await notificationService.cancelAll();
      onUpdateLocalData((current) => ({
        ...current,
        scheduledReminders: [],
        updatedAt: new Date().toISOString()
      }));
      Alert.alert("Local Notifications", "All local prototype notifications were cancelled.");
    } catch {
      Alert.alert("Local Notifications", "Could not cancel local notifications on this device.");
    }
  };

  const confirmResetDemoData = () => {
    Alert.alert(
      "Reset Demo Data",
      "This will restore default prototype reminders, drafts, notes, and history while keeping the current mock sign-in.",
      [
        { style: "cancel", text: "Cancel" },
        { onPress: onResetDemoData, text: "Reset" }
      ]
    );
  };

  const confirmClearLocalData = () => {
    Alert.alert(
      "Clear Local Data",
      "This will remove local prototype data, sign out, and return to the Welcome screen.",
      [
        { style: "cancel", text: "Cancel" },
        { onPress: onClearLocalData, style: "destructive", text: "Clear" }
      ]
    );
  };

  return (
    <ScreenFrame activeModule="settings" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Settings" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Pre-launch settings.</Text>
          <Text style={styles.heroSub}>Preferences are local mockups.</Text>
        </View>
        <MaterialCommunityIcons name="cog-outline" size={48} color={colors.primaryBlue} />
      </View>

      <SectionHeader icon="cog-outline" title="Settings Menu" />
      <View style={styles.profilePanel}>
        <MaterialCommunityIcons name="account-circle-outline" size={42} color={colors.primaryBlue} />
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>
            {profile ? `${profile.firstName} ${profile.lastName}` : "Mock User"}
          </Text>
          <Text style={styles.profileMeta}>
            {profile?.role ?? "Canadian Police Officer"} - {profile?.preferredLanguage ?? "English"}
          </Text>
        </View>
      </View>
      <LocalPrototypeWarning />
      <View style={styles.localDataPanel}>
        <View style={styles.localDataHeader}>
          <MaterialCommunityIcons name="database-outline" size={24} color={colors.ptsdGreen} />
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>Local Prototype Storage</Text>
            <Text style={styles.profileMeta}>
              {localData.incidentDrafts.length} drafts - {localData.shiftReminders.length} reminders - updated{" "}
              {new Date(localData.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <SecondaryButton label="Reset Demo Data" onPress={confirmResetDemoData}>
          <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton label="Clear Local Data" onPress={confirmClearLocalData}>
          <MaterialCommunityIcons name="delete-outline" size={20} color={colors.danger} />
        </SecondaryButton>
      </View>
      <View style={styles.localDataPanel}>
        <View style={styles.localDataHeader}>
          <MaterialCommunityIcons name="tune-variant" size={24} color={colors.primaryBlue} />
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>Persisted Preferences</Text>
            <Text style={styles.profileMeta}>Local placeholders only. No production device permissions are changed.</Text>
          </View>
        </View>
        <SecondaryButton
          label={`Notifications ${localData.preferences.notificationsEnabled ? "On" : "Off"}`}
          onPress={() => togglePreference("notificationsEnabled")}
        >
          <MaterialCommunityIcons name="bell-outline" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton
          label={`Biometrics ${localData.preferences.biometricEnabled ? "On" : "Off"}`}
          onPress={() => togglePreference("biometricEnabled")}
        >
          <MaterialCommunityIcons name="fingerprint" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton
          label={`PTSD Reminders ${localData.preferences.ptsdRemindersEnabled ? "On" : "Off"}`}
          onPress={() => togglePreference("ptsdRemindersEnabled")}
        >
          <MaterialCommunityIcons name="ribbon" size={20} color={colors.ptsdGreen} />
        </SecondaryButton>
      </View>
      <View style={styles.localDataPanel}>
        <View style={styles.localDataHeader}>
          <MaterialCommunityIcons name="bell-ring-outline" size={24} color={colors.primaryBlue} />
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>Notifications</Text>
            <Text style={styles.profileMeta}>
              OPAi can send local reminders for court dates, training, requalification deadlines, shift readiness,
              follow-ups, and calendar events. You can change this anytime in Settings.
            </Text>
          </View>
        </View>
        <DisclaimerBanner message="Notification reminders in this testing version are scheduled locally on this device. OPAi does not send remote push notifications in this prototype." />
        <SecondaryButton label={`Permission: ${notificationPreference.permissionStatus}`} onPress={handleRequestNotificationPermission}>
          <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <View style={styles.actionRow}>
          <SecondaryButton label="Enable Notifications" onPress={handleRequestNotificationPermission}>
            <MaterialCommunityIcons name="bell-check-outline" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label="Maybe Later" onPress={handleMaybeLater}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <SecondaryButton
          label={`Enable All ${notificationPreference.enabled ? "On" : "Off"}`}
          onPress={() =>
            updateNotificationPreference((current) => ({
              ...current,
              enabled: !current.enabled,
              lastUpdatedAt: new Date().toISOString()
            }))
          }
        >
          <MaterialCommunityIcons name="toggle-switch-outline" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        {notificationPreferenceRows.map((row) => (
          <View key={row.key} style={styles.notificationPreferenceRow}>
            <SecondaryButton
              label={`${row.label} ${notificationPreference[row.key] ? "On" : "Off"}`}
              onPress={() => toggleNotificationCategory(row.key)}
            >
              <MaterialCommunityIcons name={notificationPreference[row.key] ? "bell-check-outline" : "bell-off-outline"} size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton
              label={leadTimeLabels[notificationPreference.reminderLeadTimes[row.type]]}
              onPress={() => cycleLeadTime(row.type)}
            >
              <MaterialCommunityIcons name="timer-outline" size={20} color={colors.ptsdGreen} />
            </SecondaryButton>
          </View>
        ))}
        <DisclaimerBanner message="OPAi reminders are productivity aids only. Users remain responsible for verifying court dates, training schedules, qualification deadlines, and official obligations through authorized systems and supervisors." />
      </View>
      <View style={styles.localDataPanel}>
        <View style={styles.localDataHeader}>
          <MaterialCommunityIcons name="test-tube" size={24} color={colors.ptsdGreen} />
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>Notification Testing - Local Prototype</Text>
            <Text style={styles.profileMeta}>
              Scheduled locally: {localData.scheduledReminders.length}. No APNs server, FCM, backend push, or remote token is used.
            </Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          <SecondaryButton label="Test in 10 sec" onPress={() => scheduleDemo("test")}>
            <MaterialCommunityIcons name="timer-sand" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
          <SecondaryButton label="Demo Court" onPress={() => scheduleDemo("court")}>
            <MaterialCommunityIcons name="scale-balance" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
        <SecondaryButton label="Demo Training" onPress={() => scheduleDemo("training")}>
          <MaterialCommunityIcons name="school-outline" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton label="Schedule Local Reminders" onPress={scheduleStoredReminders}>
          <MaterialCommunityIcons name="calendar-sync-outline" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton label="Cancel All Local Notifications" onPress={cancelAllNotifications}>
          <MaterialCommunityIcons name="bell-cancel-outline" size={20} color={colors.danger} />
        </SecondaryButton>
      </View>
      <View style={styles.stack}>
        {settingsItems.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            key={item.title}
            onPress={() => onSelectItem(item.title)}
            {...item}
          />
        ))}
      </View>
      <SecondaryButton label="Mock Sign Out" onPress={onSignOut}>
        <Ionicons name="log-out-outline" size={20} color={colors.primaryBlue} />
      </SecondaryButton>
      <PrototypeSelection label={selectedItem} />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function LocalPrototypeWarning() {
  return (
    <DisclaimerBanner message="OPAi is currently in testing/pre-launch. Data in this prototype may be stored locally on this device for demonstration purposes. Do not enter real police records, real evidence, confidential information, or sensitive personal information. Future production versions will use secure backend storage, encryption, access controls, and privacy-by-design protections." />
  );
}

function SecondaryModuleMenu({
  activeModule,
  isTablet,
  onSelectModule
}: {
  activeModule: ModuleId;
  isTablet: boolean;
  onSelectModule: (module: ModuleId) => void;
}) {
  return (
    <View style={styles.secondaryMenu}>
      <SectionHeader icon="view-grid-outline" title="More Modules" />
      <View style={[styles.grid, isTablet ? styles.gridTablet : null]}>
        {secondaryModules.map((module) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: activeModule === module.id }}
            key={module.id}
            onPress={() => onSelectModule(module.id)}
            style={({ pressed }) => [
              styles.secondaryTile,
              activeModule === module.id ? styles.secondaryTileActive : null,
              pressed ? styles.pressed : null
            ]}
          >
            <MaterialCommunityIcons name={module.icon} size={25} color={colors.primaryBlue} />
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.secondaryTileTitle}>{module.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function PrototypeSelection({ label }: { label: string }) {
  return (
    <View style={styles.selectionBanner}>
      <Ionicons name="radio-button-on" size={16} color={colors.ptsdGreen} />
      <Text numberOfLines={1} style={styles.selectionText}>Prototype selection: {label}</Text>
    </View>
  );
}

function CoreDisclaimer() {
  return (
    <View style={styles.disclaimerStack}>
      <DisclaimerBanner message="OPAi Police is a productivity and AI assistance tool. It does not replace official systems, supervision, service policy, legal advice, medical advice, or professional judgment." />
      <DisclaimerBanner message="AI-generated responses may be incomplete or inaccurate and must be verified. PTSD awareness content is educational only and is not diagnosis, treatment, therapy, or crisis intervention." />
    </View>
  );
}

function WorkflowSummaryCard({
  item,
  onPress,
  selected
}: {
  item: WorkflowSummaryItem;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.summaryCard,
        selected ? styles.workflowCardActive : null,
        pressed ? styles.pressed : null,
        { borderColor: `${item.accent}66` }
      ]}
    >
      <View style={[styles.summaryIcon, { backgroundColor: `${item.accent}20` }]}>
        <MaterialCommunityIcons name={item.icon} size={24} color={item.accent} />
      </View>
      <View style={styles.profileCopy}>
        <Text numberOfLines={1} style={styles.summaryTitle}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.summaryMeta}>{item.subtitle}</Text>
      </View>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.statusBadge, { color: item.accent }]}>
        {item.status}
      </Text>
    </Pressable>
  );
}

function WorkflowFormPanel({ children, icon, title }: { children: ReactNode; icon: string; title: string }) {
  return (
    <View style={styles.workflowPanel}>
      <View style={styles.localDataHeader}>
        <MaterialCommunityIcons name={icon as never} size={24} color={colors.primaryBlue} />
        <Text style={styles.profileName}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function WorkflowField({
  label,
  multiline = false,
  onChangeText,
  value
}: {
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  value: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.textSubtle}
        style={[styles.fieldInput, multiline ? styles.fieldInputMultiline : null]}
        value={value}
      />
    </View>
  );
}

function WorkflowItemCard({
  accent,
  active,
  icon,
  meta,
  onDelete,
  onEdit,
  onPress,
  onPrimary,
  primaryLabel,
  reminderEnabled,
  status,
  subtitle,
  title
}: {
  accent: string;
  active: boolean;
  icon: string;
  meta: string;
  onDelete: () => void;
  onEdit: () => void;
  onPress: () => void;
  onPrimary: () => void;
  primaryLabel: string;
  reminderEnabled: boolean;
  status: string;
  subtitle: string;
  title: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.workflowCard,
        active ? styles.workflowCardActive : null,
        pressed ? styles.pressed : null,
        { borderColor: `${accent}66` }
      ]}
    >
      <View style={styles.workflowCardHeader}>
        <View style={[styles.summaryIcon, { backgroundColor: `${accent}20` }]}>
          <MaterialCommunityIcons name={icon as never} size={25} color={accent} />
        </View>
        <View style={styles.profileCopy}>
          <Text numberOfLines={1} style={styles.workflowTitle}>{title}</Text>
          <Text numberOfLines={1} style={styles.workflowMeta}>{meta}</Text>
        </View>
        <Text numberOfLines={1} style={[styles.statusBadge, { color: accent }]}>{status}</Text>
      </View>
      <Text numberOfLines={2} style={styles.workflowSubtitle}>{subtitle}</Text>
      <View style={styles.workflowCardFooter}>
        <View style={styles.reminderStatus}>
          <MaterialCommunityIcons name={reminderEnabled ? "bell-check-outline" : "bell-off-outline"} size={16} color={reminderEnabled ? colors.ptsdGreen : colors.textMuted} />
          <Text style={styles.reminderStatusText}>{reminderEnabled ? "Reminder on" : "Reminder off"}</Text>
        </View>
        <View style={styles.workflowActions}>
          <Pressable accessibilityRole="button" onPress={onEdit} style={styles.iconAction}>
            <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primaryBlue} />
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onPrimary} style={styles.iconAction}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.ptsdGreen} />
            <Text style={styles.iconActionLabel}>{primaryLabel}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onDelete} style={styles.iconAction}>
            <MaterialCommunityIcons name="delete-outline" size={18} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  aiOrb: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: colors.primaryBlue,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 76,
    justifyContent: "center",
    width: 76
  },
  aiPanel: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.72)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  blueText: {
    color: colors.primaryBlue
  },
  centerHero: {
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md
  },
  content: {
    gap: spacing.lg,
    width: "100%"
  },
  contentTablet: {
    alignSelf: "center",
    maxWidth: layout.contentMaxWidth
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  gridTablet: {
    justifyContent: "flex-start"
  },
  hero: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.38)",
    borderColor: "rgba(77,163,255,0.14)",
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  heroCopy: {
    flex: 1
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.12)",
    borderRadius: radius.xl,
    height: 68,
    justifyContent: "center",
    width: 68
  },
  localDataHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  localDataPanel: {
    backgroundColor: "rgba(7,23,42,0.72)",
    borderColor: "rgba(127,255,212,0.28)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  notificationPreferenceRow: {
    gap: spacing.sm
  },
  heroSub: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs
  },
  heroTablet: {
    minHeight: 160
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.hero,
    fontWeight: "900",
    lineHeight: 39
  },
  reminderGrid: {
    gap: spacing.sm
  },
  reminderGridTablet: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  reminderStatus: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  reminderStatusText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "800"
  },
  reviewPanel: {
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  disclaimerStack: {
    gap: spacing.sm
  },
  fieldGroup: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 130
  },
  fieldInput: {
    backgroundColor: "rgba(3,14,26,0.82)",
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm
  },
  fieldInputMultiline: {
    minHeight: 86,
    textAlignVertical: "top"
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  formRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  iconAction: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 34,
    paddingHorizontal: spacing.sm
  },
  iconActionLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.76,
    transform: [{ translateY: 1 }]
  },
  profileCopy: {
    flex: 1
  },
  profileMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20
  },
  profileName: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: "900"
  },
  profilePanel: {
    alignItems: "center",
    backgroundColor: "rgba(7,23,42,0.72)",
    borderColor: "rgba(127,255,212,0.26)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  secondaryMenu: {
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  secondaryTile: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.56)",
    borderColor: "rgba(77,163,255,0.18)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: "48%",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 50,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  secondaryTileActive: {
    backgroundColor: "rgba(10,132,255,0.18)",
    borderColor: colors.primaryBlue
  },
  secondaryTileTitle: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: "900"
  },
  selectionBanner: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.base
  },
  selectionText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 13,
    fontWeight: "800"
  },
  screen: {
    backgroundColor: colors.background,
    minHeight: "100%",
    overflow: "hidden",
    padding: spacing.md,
    paddingBottom: layout.bottomNavHeight + spacing.lg
  },
  stack: {
    gap: spacing.sm
  },
  stepperRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  stepPill: {
    backgroundColor: "rgba(6,29,56,0.65)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.full,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm
  },
  stepPillActive: {
    backgroundColor: "rgba(10,132,255,0.22)",
    borderColor: colors.primaryBlue
  },
  stepPillText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: "900"
  },
  statusBadge: {
    fontSize: typography.caption,
    fontWeight: "900",
    maxWidth: 84,
    textAlign: "right",
    textTransform: "uppercase"
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.65)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 68,
    padding: spacing.base
  },
  summaryGrid: {
    gap: spacing.sm
  },
  summaryGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  summaryIcon: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  summaryMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "900"
  },
  workflowActions: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    justifyContent: "flex-end"
  },
  workflowCard: {
    backgroundColor: "rgba(7,23,42,0.78)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.base
  },
  workflowCardActive: {
    backgroundColor: "rgba(10,132,255,0.18)",
    borderColor: colors.primaryBlue
  },
  workflowCardFooter: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  workflowCardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  workflowGrid: {
    gap: spacing.sm
  },
  workflowGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  workflowMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "800"
  },
  workflowPanel: {
    backgroundColor: "rgba(7,23,42,0.72)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  workflowSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 20
  },
  workflowTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: "900"
  }
});
