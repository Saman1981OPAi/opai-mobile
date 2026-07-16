import type { ReactNode } from "react";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { TodayContextCard } from "@/components/TodayContextCard";
import { AIInputBar } from "@/components/ui/AIInputBar";
import { AppHeader } from "@/components/ui/AppHeader";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventCard } from "@/components/ui/EventCard";
import { PTSDRibbonCard } from "@/components/ui/PTSDRibbonCard";
import { ReminderCard } from "@/components/ui/ReminderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { releaseInfo } from "@/config/release";
import { externalLinks, openExternalUrl } from "@/config/externalLinks";
import { secondaryModules } from "@/data/uiMockups";
import type { MciIcon } from "@/data/uiMockups";
import { DeviceTestingScreen } from "@/features/deviceTesting/DeviceTestingScreen";
import { Build25TranslationScreen } from "@/features/build25/Build25TranslationScreen";
import { aiService } from "@/services/aiService";
import { aiApi } from "@/services/api/aiApi";
import type { AIRequestMode, AIUsageResponse } from "@/services/api/apiTypes";
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
import { fileMetadataCategories, linkedTypeOptions, noteCategories, notesService } from "@/services/notesService";
import { notificationService } from "@/services/notificationService";
import { notificationScheduler } from "@/services/notificationScheduler";
import type { LocalAppData, LocalIncidentDraft } from "@/storage/storageTypes";
import { translationService } from "@/services/translationService";
import { workflowService } from "@/services/workflowService";
import { colors, layout, radius, spacing, typography } from "@/theme/tokens";
import type { AICategoryId, AIConversation } from "@/types/ai";
import type { MockUserProfile } from "@/types/auth";
import type { AppModule, ModuleId } from "@/types/navigation";
import type { NotificationCategory, NotificationLeadTime, NotificationPreference, ScheduledReminder } from "@/types/notifications";
import type {
  LocalFileMetadataCategory,
  LocalFileMetadataPlaceholder,
  LocalLinkedItemType,
  LocalNoteCategory,
  LocalNoteFolder,
  LocalStructuredNote,
  NotesFilesFilters
} from "@/types/notesFiles";
import type { TranslationLanguage, TranslationMode, TranslationRecord } from "@/types/translation";
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

type SettingsViewId =
  | "overview"
  | "profile"
  | "consent"
  | "data"
  | "dataSources"
  | "notifications"
  | "preferences"
  | "privacy"
  | "terms"
  | "ai"
  | "professional"
  | "translation"
  | "ptsd"
  | "prototype"
  | "courtTraining"
  | "incident"
  | "files"
  | "support"
  | "about";

type LegalDocument = {
  id: SettingsViewId;
  icon: MciIcon;
  title: string;
  subtitle: string;
  body: string[];
  productionUrl?: string;
};

const generalAppDisclaimer = "OPAi Police is a productivity and AI assistance tool.";
const professionalUseDisclaimer =
  "OPAi Police is not a replacement for official police systems, supervision, service policy, legal advice, medical advice, training, court requirements, or professional judgment.";
const aiDisclaimer =
  "AI-generated responses may be incomplete, inaccurate, or inappropriate for a specific situation and must be verified by the user.";
const prototypeDisclaimer =
  "OPAi is currently in testing/pre-launch. Do not enter real police records, confidential information, sensitive personal information, real evidence, real statements, or official documents into this prototype.";
const ptsdDisclaimer =
  "PTSD awareness content is educational and supportive only. It is not medical diagnosis, treatment, therapy, crisis intervention, or emergency support. If you are in immediate danger or crisis, contact local emergency services or a qualified crisis support service.";
const translationDisclaimer =
  "OPAi translation features are productivity aids only. Translation output may be incomplete, inaccurate, or contextually incorrect and must be verified by the user. For official proceedings, investigations, court, statements, cautions, rights, or legal processes, users must follow authorized service procedures and obtain qualified interpretation or certified translation where required.";
const courtTrainingDisclaimer =
  "OPAi reminders are productivity aids only. Users remain responsible for verifying court dates, training schedules, qualification deadlines, and official obligations through authorized systems, supervisors, and service policies.";
const incidentDisclaimer =
  "Report Writing sends officer-supplied facts to the secure OPAi AI service only when requested. Drafts require officer verification and do not replace RMS, notebook requirements, supervision, policy, or legal obligations.";
const filesDisclaimer =
  "Notes & Files remain local metadata placeholders. Files explicitly selected inside Translation may be transmitted for that requested translation only.";

const legalDocuments: LegalDocument[] = [
  {
    body: [
      "OPAi is currently in testing/pre-launch.",
      "Local preferences, consent dates, and optional history are stored on the user's device.",
      "Authentication and requested AI/translation content use the secure OPAi staging backend during internal testing.",
      "OPAi may transmit user-requested text, audio, selected images, and selected documents to OpenAI for processing. OPAi does not add police-system sync, advertising, tracking, or third-party analytics.",
      "Users should not enter real police records, evidence, confidential information, sensitive personal information, or official documents.",
      "Future production versions may use secure backend services, encrypted storage, authentication, audit logging, AI services, and optional integrations.",
      "Production URL to be verified before final App Store submission."
    ],
    icon: "shield-lock-outline",
    id: "privacy",
    productionUrl: "https://opaiapp.com/privacy",
    subtitle: "Local draft for testing",
    title: "Privacy Policy"
  },
  {
    body: [
      generalAppDisclaimer,
      "OPAi Police is not official police software and is not affiliated with a police service or government agency unless explicitly stated in future authorized agreements.",
      professionalUseDisclaimer,
      "This prototype should not be used for real police operations.",
      "No real records, evidence, statements, official documents, or sensitive information should be entered during testing.",
      "AI and translation features are AI-generated, may be inaccurate, and require verification.",
      "Users are responsible for verifying all information.",
      "Production URL to be verified before final App Store submission."
    ],
    icon: "file-document-check-outline",
    id: "terms",
    productionUrl: "https://opaiapp.com/terms",
    subtitle: "Local draft for testing",
    title: "Terms of Use"
  },
  {
    body: [generalAppDisclaimer, aiDisclaimer, "Prompts are sent through the authenticated OPAi backend. Provider storage is disabled, but users must not submit operational or confidential information during internal testing."],
    icon: "brain",
    id: "ai",
    subtitle: "AI safety boundary",
    title: "AI Disclaimer"
  },
  {
    body: [generalAppDisclaimer, professionalUseDisclaimer, "Users must follow service policy, law, training, supervisor direction, court requirements, and professional judgment."],
    icon: "shield-alert-outline",
    id: "professional",
    subtitle: "Professional use boundary",
    title: "Police / Professional Use Disclaimer"
  },
  {
    body: [translationDisclaimer, "Requested translation content may be transmitted to OPAi and OpenAI. Translation is not certified, official, or court-approved."],
    icon: "translate",
    id: "translation",
    subtitle: "Translation safety boundary",
    title: "Translation Disclaimer"
  },
  {
    body: [ptsdDisclaimer, "OPAi PTSD awareness messaging exists to support stigma reduction and awareness, not clinical care."],
    icon: "ribbon",
    id: "ptsd",
    subtitle: "Wellness awareness boundary",
    title: "PTSD Awareness Disclaimer"
  },
  {
    body: [prototypeDisclaimer, "Prototype data may be stored locally on this device until reset, cleared, or removed by the operating system."],
    icon: "test-tube",
    id: "prototype",
    subtitle: "Testing / pre-launch",
    title: "Prototype / Testing Disclaimer"
  },
  {
    body: [courtTrainingDisclaimer],
    icon: "calendar-alert",
    id: "courtTraining",
    subtitle: "Reminder safety boundary",
    title: "Court / Training Reminder Disclaimer"
  },
  {
    body: [incidentDisclaimer],
    icon: "file-document-edit-outline",
    id: "incident",
    subtitle: "Drafting safety boundary",
    title: "Report Writing Disclaimer"
  },
  {
    body: [filesDisclaimer],
    icon: "file-cabinet",
    id: "files",
    subtitle: "File metadata boundary",
    title: "Files Disclaimer"
  }
];

const settingsMenuSections: Array<{
  title: string;
  items: Array<{ id: SettingsViewId; icon: MciIcon; title: string; subtitle: string }>;
}> = [
  {
    items: [
      { icon: "account-circle-outline", id: "profile", subtitle: "Mock user and account status", title: "Profile" },
      { icon: "logout", id: "overview", subtitle: "Use the sign-out button below", title: "Mock Account Status" }
    ],
    title: "Account"
  },
  {
    items: [
      { icon: "shield-lock-outline", id: "privacy", subtitle: "Local privacy draft", title: "Privacy Policy" },
      { icon: "file-document-check-outline", id: "terms", subtitle: "Local terms draft", title: "Terms of Use" },
      { icon: "file-check-outline", id: "consent", subtitle: "Accepted locally", title: "Consent Status" },
      { icon: "database-outline", id: "data", subtitle: "Local prototype storage", title: "Data & Storage" },
      { icon: "weather-partly-cloudy", id: "dataSources", subtitle: "Apple Weather and local sources", title: "Data Sources" },
      { icon: "fingerprint", id: "profile", subtitle: "Placeholder only", title: "Biometric Placeholder" }
    ],
    title: "Privacy & Security"
  },
  {
    items: [
      { icon: "bell-ring-outline", id: "notifications", subtitle: "Local reminders only", title: "Notifications" },
      { icon: "tune-variant", id: "preferences", subtitle: "Language and wellness", title: "App Preferences" }
    ],
    title: "Notifications & Preferences"
  },
  {
    items: legalDocuments
      .filter((doc) => !["privacy", "terms"].includes(doc.id))
      .map((doc) => ({ icon: doc.icon, id: doc.id, subtitle: doc.subtitle, title: doc.title })),
    title: "Legal & Compliance"
  },
  {
    items: [
      { icon: "lifebuoy", id: "support", subtitle: "Contacts and links", title: "Support" },
      { icon: "information-outline", id: "about", subtitle: "Mission and status", title: "About OPAi" }
    ],
    title: "Support & About"
  }
];

const storageCategoryRows: Array<{ icon: MciIcon; title: string; getCount: (data: LocalAppData) => number | string }> = [
  { getCount: (data) => (data.auth.profile ? 1 : 0), icon: "account-outline", title: "Mock user profile" },
  { getCount: (data) => Object.values(data.auth.consent).filter(Boolean).length, icon: "file-check-outline", title: "Consent status" },
  { getCount: () => "local", icon: "tune-variant", title: "Preferences" },
  { getCount: (data) => data.shiftReminders.length, icon: "shield-check-outline", title: "Start My Shift reminders" },
  { getCount: (data) => data.calendarWorkflowEvents.length, icon: "calendar-outline", title: "Calendar events" },
  { getCount: (data) => data.courtWorkflowEvents.length, icon: "scale-balance", title: "Court events" },
  { getCount: (data) => data.trainingWorkflowEvents.length, icon: "school-outline", title: "Training events" },
  { getCount: (data) => data.requalificationWorkflowReminders.length, icon: "target", title: "Requalification reminders" },
  { getCount: (data) => data.followUpWorkflowReminders.length, icon: "clipboard-check-outline", title: "Follow-ups" },
  { getCount: (data) => data.incidentDrafts.length, icon: "file-document-edit-outline", title: "Report drafts" },
  { getCount: (data) => data.translationHistory.length, icon: "translate", title: "Translation history" },
  { getCount: (data) => data.aiHistory.length, icon: "brain", title: "AI mock history" },
  { getCount: (data) => data.structuredNotes.length, icon: "note-text-outline", title: "Notes" },
  { getCount: (data) => data.fileMetadataPlaceholders.length, icon: "file-cabinet", title: "File metadata placeholders" }
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

  const addTranslationHistory = (prompt: string) => {
    const createdAt = timestamp();
    onUpdateLocalData((current) => ({
      ...current,
      translationHistory: [
        {
          createdAt,
          id: `translation-history-${Date.now()}`,
          mode: "text" as const,
          notes: "Mock local translation only. Production translation is not connected.",
          relatedIncidentId: "",
          sourceLanguage: current.translationPreferences.preferredSourceLanguage,
          sourceText: prompt,
          targetLanguage: current.translationPreferences.preferredTargetLanguage,
          translatedText: translationService.mockTranslateText(prompt)
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

  if (module.id === "deviceTesting") {
    return (
      <ScreenFrame activeModule="deviceTesting" isTablet={isTablet} onSelectModule={onSelectModule}>
        <DeviceTestingScreen isTablet={isTablet} />
        <CoreDisclaimer />
      </ScreenFrame>
    );
  }

  if (module.id === "ai") {
    return (
      <AIAssistantScreen
        isTablet={isTablet}
        localData={localData}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        onUpdateLocalData={onUpdateLocalData}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "translation") {
    return (
      <ScreenFrame activeModule="translation" isTablet={isTablet} onSelectModule={onSelectModule}>
        <AppHeader title="Translation" />
        <Build25TranslationScreen />
        <CoreDisclaimer />
      </ScreenFrame>
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
        onUpdateLocalData={onUpdateLocalData}
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

const primaryHomeActionIds: ModuleId[] = ["shift", "incident", "deviceTesting", "translation", "calendar", "ai"];

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
  const primaryActions = primaryHomeActionIds
    .map((id) => dashboard.features.find((feature) => feature.id === id))
    .filter((feature): feature is NonNullable<typeof feature> => Boolean(feature));

  return (
    <ScreenFrame activeModule="dashboard" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Home" />
      <HomeHeroCard />
      <TodayContextCard />

      <View style={[styles.homeActionGrid, isTablet ? styles.homeActionGridTablet : null]}>
        {primaryActions.map((feature) => (
          <HomeQuickActionCard
            icon={feature.icon}
            key={feature.id}
            onPress={() => onSelectModule(feature.id)}
            title={feature.title}
          />
        ))}
      </View>

      <CommunityLinksCard compact />

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

function HomeHeroCard() {
  const chips = [
    { icon: "file-document-outline" as MciIcon, label: "Report" },
    { icon: "weather-partly-cloudy" as MciIcon, label: "Weather" },
    { icon: "bell-outline" as MciIcon, label: "Reminders" },
    { icon: "gauge" as MciIcon, label: "Devices" }
  ];

  return (
    <View style={styles.homeHero}>
      <View style={styles.homeHeroCopy}>
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.homeHeroTitle}>Ready for duty</Text>
        <View style={styles.homeHeroChips}>
          {chips.map((chip) => (
            <View key={chip.label} style={styles.homeHeroChip}>
              <MaterialCommunityIcons name={chip.icon} size={14} color={colors.accentBlue} />
              <Text numberOfLines={1} style={styles.homeHeroChipText}>{chip.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.homeHeroMark}>
        <MaterialCommunityIcons name="shield-star-outline" size={38} color={colors.primaryBlue} />
      </View>
    </View>
  );
}

function HomeQuickActionCard({
  icon,
  onPress,
  title
}: {
  icon: MciIcon;
  onPress: () => void;
  title: string;
}) {
  return (
    <Pressable
      accessibilityLabel={`Open ${title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.homeActionCard, pressed ? styles.pressed : null]}
    >
      <View style={styles.homeActionIcon}>
        <MaterialCommunityIcons name={icon} size={29} color={colors.primaryBlue} />
      </View>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.homeActionTitle}>{title}</Text>
    </Pressable>
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
  const [isDraftingReport, setIsDraftingReport] = useState(false);
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

  const showAiPlaceholder = async () => {
    const facts = [
      `Report type: ${draft.incidentType}`,
      `Date/time: ${draft.date} ${draft.time}`,
      `Location: ${draft.location || "Not supplied"}`,
      `Officer notes: ${draft.incidentNotes.officerNotes || draft.notes || "Not supplied"}`,
      `Observations: ${draft.incidentNotes.observations || "Not supplied"}`,
      `Existing narrative: ${draft.incidentNotes.narrativeDraft || "Not supplied"}`
    ].join("\n");
    if (!draft.incidentNotes.officerNotes.trim() && !draft.incidentNotes.narrativeDraft.trim() && !draft.notes.trim()) {
      Alert.alert("Report Writing", "Add officer-supplied facts before creating a draft.");
      return;
    }
    setIsDraftingReport(true);
    try {
      const result = await aiApi.report(facts, "create_draft");
      setDraft((current) => ({
        ...current,
        incidentNotes: { ...current.incidentNotes, narrativeDraft: result.organized_draft },
        updatedAt: new Date().toISOString()
      }));
      Alert.alert("Draft created", `${result.warning}${result.missing_information.length ? `\n\nMissing: ${result.missing_information.join(", ")}` : ""}`);
    } catch (error) {
      Alert.alert("Report Writing unavailable", error instanceof Error ? error.message : "Try again later.");
    } finally {
      setIsDraftingReport(false);
    }
  };

  return (
    <ScreenFrame activeModule="incident" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Report Writing" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Draft faster.</Text>
          <Text style={styles.heroSub}>Local report workflow. No RMS sync.</Text>
        </View>
        <MaterialCommunityIcons name="file-plus-outline" size={48} color={colors.primaryBlue} />
      </View>

      <SectionHeader icon="file-document-edit-outline" title="Report Drafts" />
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
        <EmptyState icon="file-document-outline" title="No drafts" message="Create or reset local report drafts." />
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
        <WorkflowFormPanel icon="clipboard-text-outline" title="Report Basics">
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
            <SecondaryButton label={isDraftingReport ? "Drafting..." : "Create AI Draft"} onPress={() => void showAiPlaceholder()}>
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
      <DisclaimerBanner message="Report Writing drafts are local prototype records only and do not replace official police RMS, notebook requirements, reporting systems, supervision, policy, or legal obligations." />
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
  onSelectItem,
  onSelectModule,
  onUpdateLocalData,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  selectedItem: string;
}) {
  const categories = aiService.getAICategories();
  const actions = aiService.getSuggestedActions();
  const [selectedCategory, setSelectedCategory] = useState<AICategoryId>(localData.aiPreferences.lastSelectedCategory);
  const [historyFilter, setHistoryFilter] = useState<AICategoryId | "all">("all");
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [usage, setUsage] = useState<AIUsageResponse | null>(null);
  const [latestConversation, setLatestConversation] = useState<AIConversation | null>(localData.aiHistory[0] ?? null);
  const [selectedIncidentId, setSelectedIncidentId] = useState(localData.incidentDrafts[0]?.id ?? "");
  const selectedCategoryMeta = categories.find((category) => category.id === selectedCategory) ?? {
    description: "General mock assistance for local prototype workflows.",
    icon: "chat-processing-outline",
    id: "general" as const,
    label: "General Support",
    shortLabel: "General"
  };
  const selectedIncident = localData.incidentDrafts.find((draft) => draft.id === selectedIncidentId);
  const filteredHistory = aiService.getAIHistory(localData, historyFilter);
  const promptSuggestions = aiService.getPromptSuggestions(selectedCategory);

  const updateAIPreferences = (category: AICategoryId, saveHistory = localData.aiPreferences.saveHistory) => {
    onUpdateLocalData((current) =>
      aiService.saveAIPreferences(current, {
        lastSelectedCategory: category,
        lastUpdatedAt: new Date().toISOString(),
        saveHistory
      })
    );
  };

  const runAIPrompt = async (nextPrompt: string, category = selectedCategory) => {
    const trimmedPrompt = nextPrompt.trim();

    if (!trimmedPrompt) {
      Alert.alert("OPAi Assistant", "Enter a prompt first.");
      return;
    }
    setIsSending(true);
    let conversation: AIConversation;
    try {
      const response = await aiApi.chat({
        message: trimmedPrompt,
        mode: aiModeForCategory(category),
        ...(latestConversation?.id ? { conversationId: latestConversation.id } : {})
      });
      setUsage(await aiApi.getAIUsage().catch(() => null));
      conversation = aiService.createLiveConversation({
        category,
        prompt: trimmedPrompt,
        response,
        ...(selectedIncidentId ? { relatedIncidentId: selectedIncidentId } : {})
      });
    } catch (error) {
      Alert.alert("Assistant unavailable", error instanceof Error ? error.message : "Try again later.");
      return;
    } finally {
      setIsSending(false);
    }

    setLatestConversation(conversation);
    setPrompt("");
    onSelectItem(conversation.prompt);

    onUpdateLocalData((current) => {
      const withPrefs = aiService.saveAIPreferences(current, {
        lastSelectedCategory: category,
        lastUpdatedAt: new Date().toISOString(),
        saveHistory: current.aiPreferences.saveHistory
      });

      return withPrefs.aiPreferences.saveHistory ? aiService.saveAIConversation(withPrefs, conversation) : withPrefs;
    });
  };

  const deleteHistoryItem = (conversationId: string) => {
    onUpdateLocalData((current) => aiService.deleteAIConversation(current, conversationId));
  };

  const clearHistory = () => {
    Alert.alert("Clear AI History", "Clear all local mock AI history from this device?", [
      { style: "cancel", text: "Cancel" },
      {
        onPress: () => {
          onUpdateLocalData((current) => aiService.clearAIHistory(current));
          setLatestConversation(null);
        },
        style: "destructive",
        text: "Clear"
      }
    ]);
  };

  const saveLatestToNotes = () => {
    if (!latestConversation) {
      Alert.alert("OPAi Assistant", "Create an AI response first.");
      return;
    }

    onUpdateLocalData((current) => aiService.saveAIResponseToNote(aiService.saveAIConversation(current, latestConversation), latestConversation));
    Alert.alert("Saved Locally", "AI response saved as a local note.");
  };

  const attachLatestToIncident = () => {
    if (!latestConversation || !selectedIncidentId) {
      Alert.alert("OPAi Assistant", "Create an AI response and select a local report draft first.");
      return;
    }

    onUpdateLocalData((current) =>
      aiService.attachAIResponseToIncidentDraft(aiService.saveAIConversation(current, latestConversation), latestConversation, selectedIncidentId)
    );
    Alert.alert("Attached Locally", "AI response attached to the local report draft.");
  };

  return (
    <ScreenFrame activeModule="ai" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="OPAi Assistant" />
      <View style={styles.aiPanel}>
        <View style={styles.aiOrb}>
          <MaterialCommunityIcons name="brain" size={34} color={colors.primaryBlue} />
        </View>
        <View style={styles.aiHeroCopy}>
          <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.78} style={styles.aiHeroTitle}>
            OPAi Assistant
          </Text>
          <Text numberOfLines={1} style={styles.aiHeroSub}>Secure AI assistance</Text>
        </View>
        <View style={styles.mockBadge}>
          <Text style={styles.mockBadgeText}>AI</Text>
        </View>
      </View>

      <AIPrototypeBanner />
      <AISafetyNotice />
      {usage ? <Text style={styles.workflowMeta}>Daily usage: AI {usage.ai_requests}/{usage.ai_limit} - Translation {usage.translation_requests}/{usage.translation_limit}</Text> : null}

      <SectionHeader icon="shape-outline" title="Categories" />
      <View style={styles.filterRow}>
        {categories.map((category) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === category.id }}
            key={category.id}
            onPress={() => {
              setSelectedCategory(category.id);
              updateAIPreferences(category.id);
              onSelectItem(category.label);
            }}
            style={({ pressed }) => [
              styles.categoryChip,
              selectedCategory === category.id ? styles.categoryChipActive : null,
              pressed ? styles.pressed : null
            ]}
          >
            <MaterialCommunityIcons name={category.icon} size={18} color={selectedCategory === category.id ? colors.textPrimary : colors.primaryBlue} />
            <Text numberOfLines={1} style={styles.categoryChipText}>{category.shortLabel}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.reviewPanel}>
        <Text style={styles.profileName}>{selectedCategoryMeta.label}</Text>
        <Text style={styles.workflowSubtitle}>{selectedCategoryMeta.description}</Text>
        {selectedCategoryMeta.placeholderOnly ? (
          <DisclaimerBanner message="This category is a placeholder only. It does not provide legal advice, policy interpretation, statute lookup, or official direction." />
        ) : null}
        {selectedCategoryMeta.wellnessOnly ? <WellnessDisclaimer /> : null}
      </View>

      <SectionHeader icon="lightbulb-on-outline" title="Prompt Chips" />
      <View style={styles.reviewPanel}>
        <Text style={styles.workflowSubtitle}>Tap a prompt for the selected category.</Text>
        <View style={styles.filterRow}>
          {promptSuggestions.map((suggestion) => (
            <Pressable
              accessibilityLabel={`Run mock prompt: ${suggestion.label}`}
              accessibilityRole="button"
              key={suggestion.id}
              onPress={() => void runAIPrompt(suggestion.prompt, suggestion.category)}
              style={({ pressed }) => [styles.promptChip, pressed ? styles.pressed : null]}
            >
              <MaterialCommunityIcons name="lightning-bolt-outline" size={16} color={colors.ptsdGreen} />
              <Text numberOfLines={1} style={styles.promptChipText}>{suggestion.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <SectionHeader icon="star-four-points-outline" title="Suggested Actions" />
      <View style={[styles.reminderGrid, isTablet ? styles.reminderGridTablet : null]}>
        {actions.map((action) => (
          <ReminderCard
            active={selectedItem === action.title}
            icon={action.icon}
            key={action.id}
            onPress={() => {
              setSelectedCategory(action.category);
              updateAIPreferences(action.category);
              void runAIPrompt(action.prompt, action.category);
            }}
            subtitle={action.subtitle}
            title={action.title}
          />
        ))}
      </View>

      <SectionHeader icon="chat-processing-outline" title="Assistant" />
      <WorkflowFormPanel icon="robot-outline" title="Secure Prompt">
        <View style={styles.formRow}>
          <WorkflowField
            label="Prompt"
            multiline
            onChangeText={setPrompt}
            value={prompt}
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Report Link Placeholder</Text>
            <View style={styles.filterRow}>
              {localData.incidentDrafts.slice(0, 4).map((draft) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedIncidentId === draft.id }}
                  key={draft.id}
                  onPress={() => setSelectedIncidentId(draft.id)}
                  style={({ pressed }) => [
                    styles.stepPill,
                    selectedIncidentId === draft.id ? styles.stepPillActive : null,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <Text numberOfLines={1} style={styles.stepPillText}>{draft.incidentType}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.workflowMeta}>
              {selectedIncident ? `Selected local draft: ${selectedIncident.incidentType}` : "No local incident draft selected."}
            </Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          <PrimaryButton label={isSending ? "Sending..." : "Send"} loading={isSending} onPress={() => void runAIPrompt(prompt)}>
            <MaterialCommunityIcons name="send-outline" size={20} color={colors.textPrimary} />
          </PrimaryButton>
          <SecondaryButton
            label={localData.aiPreferences.saveHistory ? "History On" : "History Off"}
            onPress={() => {
              const nextValue = !localData.aiPreferences.saveHistory;
              updateAIPreferences(selectedCategory, nextValue);
            }}
          >
            <MaterialCommunityIcons name="history" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
      </WorkflowFormPanel>

      {latestConversation ? (
        <View style={styles.chatCard}>
          <View style={styles.chatBubbleUser}>
            <Text style={styles.chatLabel}>Prompt</Text>
            <Text style={styles.chatText}>{latestConversation.prompt}</Text>
          </View>
          <View style={styles.chatBubbleAssistant}>
            <View style={styles.localDataHeader}>
              <MaterialCommunityIcons name="robot-outline" size={22} color={colors.ptsdGreen} />
              <Text style={styles.profileName}>AI Response</Text>
            </View>
            <Text style={styles.chatText}>{latestConversation.mockResponse}</Text>
            {latestConversation.summary ? <Text style={styles.workflowMeta}>Summary: {latestConversation.summary}</Text> : null}
            {latestConversation.refusalReason ? <Text style={styles.workflowMeta}>Refusal: {latestConversation.refusalReason}</Text> : null}
            {latestConversation.warnings?.map((warning) => <Text key={warning} style={styles.workflowMeta}>- {warning}</Text>)}
            {latestConversation.missingInformation?.map((item) => <Text key={item} style={styles.workflowMeta}>Missing: {item}</Text>)}
            {latestConversation.sources?.map((source) => <Text key={`${source.title}-${source.url ?? "local"}`} style={styles.workflowMeta}>Source: {source.title}</Text>)}
            {latestConversation.verificationRequired ? <DisclaimerBanner message="AI-generated response. Verify all information before use." /> : null}
            <View style={styles.actionRow}>
              <SecondaryButton label="Save Note" onPress={saveLatestToNotes}>
                <MaterialCommunityIcons name="note-plus-outline" size={20} color={colors.primaryBlue} />
              </SecondaryButton>
              <SecondaryButton label="Attach Draft" onPress={attachLatestToIncident}>
                <MaterialCommunityIcons name="link-variant" size={20} color={colors.primaryBlue} />
              </SecondaryButton>
              <SecondaryButton label="Clear Chat" onPress={() => setLatestConversation(null)}>
                <MaterialCommunityIcons name="broom" size={20} color={colors.primaryBlue} />
              </SecondaryButton>
            </View>
          </View>
        </View>
      ) : (
        <EmptyState
          icon="robot-outline"
          message="Tap a suggested action or enter a prompt."
          title="No active chat"
        />
      )}

      <DisclaimerBanner message="AI incident support is a prototype productivity aid only. It does not replace official police reports, notebook requirements, RMS, supervision, policy, legal advice, or professional judgment." />

      <SectionHeader icon="history" title="Local Demo History" />
      <View style={styles.filterRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: historyFilter === "all" }}
          onPress={() => setHistoryFilter("all")}
          style={({ pressed }) => [
            styles.categoryChip,
            historyFilter === "all" ? styles.categoryChipActive : null,
            pressed ? styles.pressed : null
          ]}
        >
          <MaterialCommunityIcons name="history" size={18} color={historyFilter === "all" ? colors.textPrimary : colors.primaryBlue} />
          <Text style={styles.categoryChipText}>All</Text>
        </Pressable>
        {categories.slice(0, 6).map((category) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: historyFilter === category.id }}
            key={category.id}
            onPress={() => setHistoryFilter(category.id)}
            style={({ pressed }) => [
              styles.categoryChip,
              historyFilter === category.id ? styles.categoryChipActive : null,
              pressed ? styles.pressed : null
            ]}
          >
            <Text numberOfLines={1} style={styles.categoryChipText}>{category.shortLabel}</Text>
          </Pressable>
        ))}
      </View>
      <DisclaimerBanner message="OPAi is currently in testing/pre-launch. Do not enter real police records, confidential information, sensitive personal information, real statements, real evidence, or official documents into this prototype." />
      <View style={styles.stack}>
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <View key={item.id} style={styles.workflowCard}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setLatestConversation(item);
                  onSelectItem(item.prompt);
                }}
                style={({ pressed }) => [styles.workflowCardHeader, pressed ? styles.pressed : null]}
              >
                <View style={styles.summaryIcon}>
                  <MaterialCommunityIcons name="history" size={22} color={colors.primaryBlue} />
                </View>
                <View style={styles.profileCopy}>
                  <Text numberOfLines={1} style={styles.workflowTitle}>{item.prompt}</Text>
                  <Text numberOfLines={2} style={styles.workflowMeta}>{item.mockResponse}</Text>
                </View>
                <Text style={styles.statusBadge}>{categories.find((category) => category.id === item.category)?.shortLabel ?? "AI"}</Text>
              </Pressable>
              <View style={styles.workflowCardFooter}>
                <Text style={styles.reminderStatusText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                <Pressable accessibilityRole="button" onPress={() => deleteHistoryItem(item.id)} style={styles.iconAction}>
                  <MaterialCommunityIcons name="delete-outline" size={18} color={colors.danger} />
                  <Text style={styles.iconActionLabel}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <EmptyState icon="history" message="AI conversations saved on this device will appear here." title="No AI history" />
        )}
      </View>
      <SecondaryButton label="Clear AI History" onPress={clearHistory}>
        <MaterialCommunityIcons name="delete-sweep-outline" size={20} color={colors.danger} />
      </SecondaryButton>

      <AIInputBar
        onPress={() => {
          setPrompt("Voice command placeholder");
          void runAIPrompt("Help me organize my current workflow.");
        }}
        placeholder="Voice or text command..."
      />
      <PrototypeSelection label={selectedItem} />
      <LocalPrototypeWarning />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function TranslationScreen({
  isTablet,
  localData,
  onSelectItem,
  onSelectModule,
  onUpdateLocalData,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onAddHistory: (prompt: string) => void;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  selectedItem: string;
}) {
  const [mode, setMode] = useState<TranslationMode | "history">("text");
  const [sourceLanguage, setSourceLanguage] = useState<TranslationLanguage>(localData.translationPreferences.preferredSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState<TranslationLanguage>(localData.translationPreferences.preferredTargetLanguage);
  const [sourceText, setSourceText] = useState("Where are you coming from?");
  const [translatedText, setTranslatedText] = useState(translationService.mockTranslateText("Where are you coming from?"));
  const [saveToHistory, setSaveToHistory] = useState(localData.translationPreferences.saveToHistory);
  const [historyFilter, setHistoryFilter] = useState<TranslationMode | "all">("all");
  const [historySearch, setHistorySearch] = useState("");
  const [relatedIncidentId, setRelatedIncidentId] = useState(localData.incidentDrafts[0]?.id ?? "");
  const modes = translationService.getTranslationModes();
  const languages = translationService.getSupportedLanguages();
  const history = translationService
    .getTranslationHistory(localData)
    .filter((item) => historyFilter === "all" || item.mode === historyFilter)
    .filter((item) => {
      const query = historySearch.trim().toLowerCase();
      if (!query) return true;
      return `${item.sourceLanguage} ${item.targetLanguage} ${item.sourceText} ${item.translatedText}`.toLowerCase().includes(query);
    });

  const persistPreferences = (nextSource = sourceLanguage, nextTarget = targetLanguage, nextSave = saveToHistory) => {
    onUpdateLocalData((current) =>
      translationService.saveTranslationPreferences(current, {
        lastUpdatedAt: new Date().toISOString(),
        preferredSourceLanguage: nextSource,
        preferredTargetLanguage: nextTarget,
        saveToHistory: nextSave
      })
    );
  };

  const buildRecord = (recordMode: TranslationMode, input: string, output: string): TranslationRecord => ({
    createdAt: new Date().toISOString(),
    id: `translation-record-${Date.now()}`,
    mode: recordMode,
    notes: "Local prototype translation record only.",
    relatedIncidentId,
    sourceLanguage,
    sourceText: input,
    targetLanguage,
    translatedText: output
  });

  const saveRecord = (record: TranslationRecord) => {
    const incident = localData.incidentDrafts.find((item) => item.id === relatedIncidentId);
    const nextRecord = incident ? translationService.attachTranslationToIncidentDraft(record, incident) : record;
    onUpdateLocalData((current) => translationService.saveTranslationRecord(current, nextRecord));
    onSelectItem("Translation saved");
  };

  const runMockTranslation = () => {
    const result = translationService.mockTranslateText(sourceText);
    setTranslatedText(result);
    persistPreferences();
    if (saveToHistory) {
      saveRecord(buildRecord("text", sourceText, result));
    }
  };

  const savePlaceholder = (recordMode: TranslationMode, input: string) => {
    const output = translationService.mockTranslateText(input);
    setTranslatedText(output);
    persistPreferences();
    if (saveToHistory) {
      saveRecord(buildRecord(recordMode, input, output));
    }
  };

  const deleteHistoryItem = (id: string) => {
    onUpdateLocalData((current) => translationService.deleteTranslationRecord(current, id));
  };

  const clearHistory = () => {
    Alert.alert("Clear Translation History", "Delete all local prototype translation records?", [
      { style: "cancel", text: "Cancel" },
      {
        onPress: () => onUpdateLocalData((current) => translationService.clearTranslationHistory(current)),
        style: "destructive",
        text: "Clear"
      }
    ]);
  };

  const cycleSourceLanguage = () => {
    const next = cycleOption(languages, sourceLanguage);
    setSourceLanguage(next);
    persistPreferences(next, targetLanguage, saveToHistory);
  };

  const cycleTargetLanguage = () => {
    const next = cycleOption(languages, targetLanguage);
    setTargetLanguage(next);
    persistPreferences(sourceLanguage, next, saveToHistory);
  };

  const cycleIncidentLink = () => {
    if (localData.incidentDrafts.length === 0) {
      setRelatedIncidentId("");
      return;
    }
    const ids = localData.incidentDrafts.map((item) => item.id);
    setRelatedIncidentId(cycleOption(ids, relatedIncidentId || (ids[0] ?? "")));
  };

  const selectedIncident = localData.incidentDrafts.find((item) => item.id === relatedIncidentId);

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
      <View style={styles.filterRow}>
        {modes.map((mode) => (
          <SecondaryButton key={mode.id} label={mode.label} onPress={() => setMode(mode.id)}>
            <MaterialCommunityIcons name={mode.id === "history" ? "history" : mode.id === "voice" ? "microphone-outline" : mode.id === "camera" ? "camera-outline" : mode.id === "document" ? "file-document-outline" : mode.id === "conversation" ? "chat-processing-outline" : "translate"} size={18} color={colors.primaryBlue} />
          </SecondaryButton>
        ))}
      </View>
      <DisclaimerBanner message={modes.find((item) => item.id === mode)?.notice ?? "Local prototype translation only."} />

      {mode !== "history" ? (
        <WorkflowFormPanel icon="translate" title="Language Settings">
          <View style={styles.filterRow}>
            <SecondaryButton label={`From: ${sourceLanguage}`} onPress={cycleSourceLanguage}>
              <MaterialCommunityIcons name="translate" size={18} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label={`To: ${targetLanguage}`} onPress={cycleTargetLanguage}>
              <MaterialCommunityIcons name="swap-horizontal" size={18} color={colors.ptsdGreen} />
            </SecondaryButton>
            <SecondaryButton label={`Save ${saveToHistory ? "On" : "Off"}`} onPress={() => {
              const next = !saveToHistory;
              setSaveToHistory(next);
              persistPreferences(sourceLanguage, targetLanguage, next);
            }}>
              <MaterialCommunityIcons name={saveToHistory ? "content-save-check-outline" : "content-save-off-outline"} size={18} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label={selectedIncident ? `Report: ${selectedIncident.incidentType}` : "Report: none"} onPress={cycleIncidentLink}>
              <MaterialCommunityIcons name="file-link-outline" size={18} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
          <DisclaimerBanner message="Linked translations are local prototype notes only and do not replace official translation, interpretation, disclosure, evidence, or reporting requirements." />
        </WorkflowFormPanel>
      ) : null}

      {mode === "text" ? (
        <WorkflowFormPanel icon="text-box-edit-outline" title="Text Translation">
          <WorkflowField label="Source text" multiline value={sourceText} onChangeText={setSourceText} />
          <WorkflowField label="Mock translated text" multiline value={translatedText} onChangeText={setTranslatedText} />
          <View style={styles.actionRow}>
            <PrimaryButton label="Mock Translate" onPress={runMockTranslation}>
              <MaterialCommunityIcons name="translate" size={20} color={colors.textPrimary} />
            </PrimaryButton>
            <SecondaryButton label="Clear" onPress={() => {
              setSourceText("");
              setTranslatedText("");
            }}>
              <MaterialCommunityIcons name="close-circle-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label="Copy Placeholder" onPress={() => Alert.alert("Copy Placeholder", "Copy behavior is not connected in this prototype.")}>
              <MaterialCommunityIcons name="content-copy" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
        </WorkflowFormPanel>
      ) : null}

      {mode === "voice" ? (
        <WorkflowFormPanel icon="microphone-outline" title="Voice Translation Placeholder">
          <View style={styles.aiOrb}>
            <MaterialCommunityIcons name="microphone-outline" size={44} color={colors.primaryBlue} />
          </View>
          <WorkflowField label="Mock transcript" multiline value="Voice transcript placeholder. No microphone permission or recording is used." onChangeText={() => undefined} />
          <WorkflowField label="Mock result" multiline value={translationService.mockTranslateText("Voice translation placeholder")} onChangeText={() => undefined} />
          <View style={styles.actionRow}>
            <SecondaryButton label="Start Placeholder" onPress={() => savePlaceholder("voice", "Voice translation placeholder")}>
              <MaterialCommunityIcons name="play-circle-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label="Stop Placeholder" onPress={() => Alert.alert("Voice Placeholder", "No audio is recorded or uploaded in Sprint 011.")}>
              <MaterialCommunityIcons name="stop-circle-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
          <DisclaimerBanner message="Voice translation is currently a prototype placeholder. Do not record or enter sensitive information in this testing version." />
        </WorkflowFormPanel>
      ) : null}

      {mode === "conversation" ? (
        <WorkflowFormPanel icon="chat-processing-outline" title="Conversation Mode Placeholder">
          <WorkflowItemCard
            accent={colors.primaryBlue}
            active={false}
            icon="account-tie-outline"
            meta={sourceLanguage}
            onDelete={() => undefined}
            onEdit={() => undefined}
            onPress={() => undefined}
            onPrimary={() => savePlaceholder("conversation", "Officer: Where are you coming from?")}
            primaryLabel="Save"
            reminderEnabled={false}
            status="Mock"
            subtitle="[Mock Translation] Future translation output will appear here."
            title="Officer: Where are you coming from?"
          />
          <WorkflowItemCard
            accent={colors.ptsdGreen}
            active={false}
            icon="account-outline"
            meta={targetLanguage}
            onDelete={() => undefined}
            onEdit={() => undefined}
            onPress={() => undefined}
            onPrimary={() => savePlaceholder("conversation", "Civilian: Je viens de la maison.")}
            primaryLabel="Save"
            reminderEnabled={false}
            status="Mock"
            subtitle="[Mock Translation] Future translation output will appear here."
            title="Civilian: Je viens de la maison."
          />
          <SecondaryButton label="Clear Conversation" onPress={() => Alert.alert("Conversation Placeholder", "Placeholder conversation cleared locally.")}>
            <MaterialCommunityIcons name="delete-sweep-outline" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
        </WorkflowFormPanel>
      ) : null}

      {mode === "camera" ? (
        <WorkflowFormPanel icon="camera-outline" title="Camera / OCR Placeholder">
          <WorkflowField label="Detected text placeholder" multiline value="Camera/OCR detected text placeholder. No image is processed." onChangeText={() => undefined} />
          <WorkflowField label="Mock translation result" multiline value={translationService.mockTranslateText("Camera OCR placeholder")} onChangeText={() => undefined} />
          <View style={styles.actionRow}>
            <SecondaryButton label="Scan Placeholder" onPress={() => savePlaceholder("camera", "Camera OCR placeholder")}>
              <MaterialCommunityIcons name="camera-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label="Image Import Placeholder" onPress={() => Alert.alert("Image Placeholder", "No camera, photo library, upload, or OCR is connected.")}>
              <MaterialCommunityIcons name="image-outline" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
          <DisclaimerBanner message="Camera and OCR translation are planned features. This testing version does not process real images." />
        </WorkflowFormPanel>
      ) : null}

      {mode === "document" ? (
        <WorkflowFormPanel icon="file-document-outline" title="Document Translation Placeholder">
          <WorkflowField label="Document name placeholder" value="sample-document-placeholder.pdf" onChangeText={() => undefined} />
          <WorkflowField label="Mock extracted text" multiline value="Document extracted text placeholder. No file is parsed or uploaded." onChangeText={() => undefined} />
          <WorkflowField label="Mock translation result" multiline value={translationService.mockTranslateText("Document translation placeholder")} onChangeText={() => undefined} />
          <SecondaryButton label="Select Document Placeholder" onPress={() => savePlaceholder("document", "Document translation placeholder")}>
            <MaterialCommunityIcons name="file-plus-outline" size={20} color={colors.primaryBlue} />
          </SecondaryButton>
          <DisclaimerBanner message="Document translation is currently a prototype placeholder. Do not upload real police records, confidential documents, or sensitive personal information." />
        </WorkflowFormPanel>
      ) : null}

      {mode === "history" ? (
        <WorkflowFormPanel icon="history" title="Translation History">
          <WorkflowField label="Search history" value={historySearch} onChangeText={setHistorySearch} />
          <View style={styles.filterRow}>
            {(["all", "text", "voice", "conversation", "camera", "document"] as Array<TranslationMode | "all">).map((item) => (
              <SecondaryButton key={item} label={item === "all" ? "All" : item} onPress={() => setHistoryFilter(item)}>
                <MaterialCommunityIcons name={historyFilter === item ? "check-circle-outline" : "circle-outline"} size={18} color={colors.primaryBlue} />
              </SecondaryButton>
            ))}
          </View>
          <SecondaryButton label="Clear All History" onPress={clearHistory}>
            <MaterialCommunityIcons name="delete-sweep-outline" size={20} color={colors.danger} />
          </SecondaryButton>
          <View style={styles.stack}>
            {history.map((item) => (
              <WorkflowItemCard
                accent={colors.primaryBlue}
                active={selectedItem === item.id}
                icon="translate"
                key={item.id}
                meta={`${item.sourceLanguage} to ${item.targetLanguage} - ${item.mode}`}
                onDelete={() => deleteHistoryItem(item.id)}
                onEdit={() => onSelectItem(item.id)}
                onPress={() => onSelectItem(item.id)}
                onPrimary={() => Alert.alert("History Placeholder", "This local record is available for future detail review.")}
                primaryLabel="View"
                reminderEnabled={Boolean(item.relatedIncidentId)}
                status="Local"
                subtitle={item.translatedText}
                title={item.sourceText}
              />
            ))}
          </View>
          {history.length === 0 ? (
            <EmptyState icon="history" title="No translation history" message="Save a mock translation to local history." />
          ) : null}
        </WorkflowFormPanel>
      ) : null}

      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="OPAi translation features are productivity aids only. Translation output may be incomplete, inaccurate, or contextually incorrect and must be verified by the user. For official proceedings, investigations, court, statements, cautions, rights, or legal processes, users must follow authorized service procedures and obtain qualified interpretation or certified translation where required." />
      <DisclaimerBanner message="OPAi is currently in testing/pre-launch. Do not enter real police records, confidential information, sensitive personal information, real statements, real evidence, or official documents into this prototype." />
      <LocalPrototypeWarning />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function cycleOption<T extends string>(options: T[], current: T): T {
  const next = options[(options.indexOf(current) + 1) % options.length];
  return next ?? current;
}

function aiModeForCategory(category: AICategoryId): AIRequestMode {
  if (category === "training") return "training";
  if (category === "calendar" || category === "court" || category === "follow_up") return "calendar";
  if (category === "wellness" || category === "ptsd_stress_support") return "wellness";
  if (category === "translation") return "translation_support";
  if (category === "report_review" || category === "incident_summary") return "report_writing";
  return "general";
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
  onUpdateLocalData,
  selectedItem
}: {
  isTablet: boolean;
  localData: LocalAppData;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  selectedItem: string;
}) {
  type NotesFilesTab = "Notes" | "Folders" | "File Metadata" | "Linked Items";

  const tabs: NotesFilesTab[] = ["Notes", "Folders", "File Metadata", "Linked Items"];
  const [activeTab, setActiveTab] = useState<NotesFilesTab>("Notes");
  const [filters, setFilters] = useState<NotesFilesFilters>({
    category: "All",
    folderId: "All",
    linkedType: "All",
    pinnedOnly: false,
    search: "",
    showArchived: false
  });
  const firstFolderId = localData.noteFolders[0]?.id;
  const [noteDraft, setNoteDraft] = useState<LocalStructuredNote>(notesService.createBlankNote(firstFolderId));
  const [noteEditingId, setNoteEditingId] = useState<string | null>(null);
  const [folderDraft, setFolderDraft] = useState<LocalNoteFolder>(notesService.createBlankFolder());
  const [folderEditingId, setFolderEditingId] = useState<string | null>(null);
  const [metadataDraft, setMetadataDraft] = useState<LocalFileMetadataPlaceholder>(notesService.createBlankFileMetadata());
  const [metadataEditingId, setMetadataEditingId] = useState<string | null>(null);

  const filteredNotes = notesService.filterNotes(localData, filters);
  const filteredFolders = notesService.filterFolders(localData, filters.search, filters.showArchived);
  const filteredMetadata = notesService.filterFileMetadata(localData, filters.search, "All");
  const linkedNotes = localData.structuredNotes.filter((note) => notesService.getLinkedSummaries(localData, note).length > 0);

  const setNoteField = <Key extends keyof LocalStructuredNote>(key: Key, value: LocalStructuredNote[Key]) => {
    setNoteDraft((current) => ({ ...current, [key]: value }));
  };

  const setFolderField = <Key extends keyof LocalNoteFolder>(key: Key, value: LocalNoteFolder[Key]) => {
    setFolderDraft((current) => ({ ...current, [key]: value }));
  };

  const setMetadataField = <Key extends keyof LocalFileMetadataPlaceholder>(
    key: Key,
    value: LocalFileMetadataPlaceholder[Key]
  ) => {
    setMetadataDraft((current) => ({ ...current, [key]: value }));
  };

  const startNewNote = () => {
    setNoteEditingId(null);
    setNoteDraft(notesService.createBlankNote(firstFolderId));
  };

  const saveNote = () => {
    onUpdateLocalData((current) => notesService.upsertNote(current, noteDraft));
    onSelectItem(noteDraft.title || "Untitled local note");
    startNewNote();
  };

  const editNote = (note: LocalStructuredNote) => {
    setActiveTab("Notes");
    setNoteEditingId(note.id);
    setNoteDraft(note);
    onSelectItem(note.title);
  };

  const startNewFolder = () => {
    setFolderEditingId(null);
    setFolderDraft(notesService.createBlankFolder());
  };

  const saveFolder = () => {
    onUpdateLocalData((current) => notesService.upsertFolder(current, folderDraft));
    onSelectItem(folderDraft.name || "Untitled folder");
    startNewFolder();
  };

  const editFolder = (folder: LocalNoteFolder) => {
    setActiveTab("Folders");
    setFolderEditingId(folder.id);
    setFolderDraft(folder);
    onSelectItem(folder.name);
  };

  const startNewMetadata = () => {
    setMetadataEditingId(null);
    setMetadataDraft(notesService.createBlankFileMetadata());
  };

  const saveMetadata = () => {
    onUpdateLocalData((current) => notesService.upsertFileMetadata(current, metadataDraft));
    onSelectItem(metadataDraft.fileName || "File metadata placeholder");
    startNewMetadata();
  };

  const editMetadata = (item: LocalFileMetadataPlaceholder) => {
    setActiveTab("File Metadata");
    setMetadataEditingId(item.id);
    setMetadataDraft(item);
    onSelectItem(item.fileName);
  };

  const cycleFolder = () => {
    const folders = localData.noteFolders.filter((folder) => !folder.archived);
    const currentIndex = folders.findIndex((folder) => folder.id === noteDraft.folderId);
    const next = folders[(currentIndex + 1) % Math.max(folders.length, 1)];
    setNoteField("folderId", next?.id);
  };

  const cycleMetadataCategory = () => {
    const currentIndex = fileMetadataCategories.indexOf(metadataDraft.category);
    const next = fileMetadataCategories[(currentIndex + 1) % fileMetadataCategories.length] ?? "Other";
    setMetadataField("category", next);
  };

  const linkedTypeLabel = (type: LocalLinkedItemType | "All") =>
    type === "All" ? "All links" : type === "followUp" ? "Follow-up" : type === "ai" ? "AI" : type;

  const confirmLocalAction = (title: string, message: string, actionLabel: string, action: () => void) => {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: actionLabel, style: "destructive", onPress: action }
    ]);
  };

  return (
    <ScreenFrame activeModule="notes" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Notes & Files" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Organize locally.</Text>
          <Text style={styles.heroSub}>Notes, folders, file metadata, and workflow links.</Text>
        </View>
        <MaterialCommunityIcons name="folder-outline" size={48} color={colors.primaryBlue} />
      </View>

      <DisclaimerBanner message="OPAi is currently in testing/pre-launch. Do not enter real police records, confidential information, sensitive personal information, real evidence, real statements, or official documents into this prototype." />
      <DisclaimerBanner message="Files in this prototype are metadata placeholders only. OPAi does not upload, store, process, or sync real files in this testing version." />

      <View style={styles.filterRow}>
        {tabs.map((tab) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab }}
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={({ pressed }) => [
              styles.categoryChip,
              activeTab === tab ? styles.categoryChipActive : null,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.categoryChipText}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <WorkflowFormPanel icon="magnify" title="Search & Filter">
        <WorkflowField
          label="Search notes, folders, metadata"
          onChangeText={(search) => setFilters((current) => ({ ...current, search }))}
          value={filters.search}
        />
        <View style={styles.filterRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              const options: Array<LocalNoteCategory | "All"> = ["All", ...noteCategories];
              const next = options[(options.indexOf(filters.category) + 1) % options.length] ?? "All";
              setFilters((current) => ({ ...current, category: next }));
            }}
            style={styles.promptChip}
          >
            <MaterialCommunityIcons name="tag-outline" size={17} color={colors.ptsdGreen} />
            <Text numberOfLines={1} style={styles.promptChipText}>{filters.category}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              const options = ["All", ...localData.noteFolders.map((folder) => folder.id)];
              const next = options[(options.indexOf(filters.folderId) + 1) % options.length] ?? "All";
              setFilters((current) => ({ ...current, folderId: next }));
            }}
            style={styles.promptChip}
          >
            <MaterialCommunityIcons name="folder-outline" size={17} color={colors.primaryBlue} />
            <Text numberOfLines={1} style={styles.promptChipText}>
              {filters.folderId === "All" ? "All folders" : notesService.getFolderName(localData, filters.folderId)}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              const options: Array<LocalLinkedItemType | "All"> = ["All", ...linkedTypeOptions];
              const next = options[(options.indexOf(filters.linkedType) + 1) % options.length] ?? "All";
              setFilters((current) => ({ ...current, linkedType: next }));
            }}
            style={styles.promptChip}
          >
            <MaterialCommunityIcons name="link-variant" size={17} color={colors.primaryBlue} />
            <Text numberOfLines={1} style={styles.promptChipText}>{linkedTypeLabel(filters.linkedType)}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: filters.pinnedOnly }}
            onPress={() => setFilters((current) => ({ ...current, pinnedOnly: !current.pinnedOnly }))}
            style={[styles.promptChip, filters.pinnedOnly ? styles.categoryChipActive : null]}
          >
            <MaterialCommunityIcons name="pin-outline" size={17} color={colors.ptsdGreen} />
            <Text style={styles.promptChipText}>Pinned</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: filters.showArchived }}
            onPress={() => setFilters((current) => ({ ...current, showArchived: !current.showArchived }))}
            style={[styles.promptChip, filters.showArchived ? styles.categoryChipActive : null]}
          >
            <MaterialCommunityIcons name="archive-outline" size={17} color={colors.textSecondary} />
            <Text style={styles.promptChipText}>Archived</Text>
          </Pressable>
        </View>
      </WorkflowFormPanel>

      {activeTab === "Notes" ? (
        <>
          <WorkflowFormPanel icon="note-plus-outline" title={noteEditingId ? "Edit Local Note" : "Create Note"}>
            <View style={styles.formRow}>
              <WorkflowField label="Title" onChangeText={(title) => setNoteField("title", title)} value={noteDraft.title} />
              <WorkflowField
                label="Tags"
                onChangeText={(tags) => setNoteField("tags", notesService.parseTags(tags))}
                value={notesService.formatTags(noteDraft.tags)}
              />
            </View>
            <WorkflowField label="Body" multiline onChangeText={(body) => setNoteField("body", body)} value={noteDraft.body} />
            <View style={styles.filterRow}>
              {noteCategories.map((category) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: noteDraft.category === category }}
                  key={category}
                  onPress={() => setNoteField("category", category)}
                  style={[styles.categoryChip, noteDraft.category === category ? styles.categoryChipActive : null]}
                >
                  <Text style={styles.categoryChipText}>{category}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.actionRow}>
              <SecondaryButton label={`Folder: ${notesService.getFolderName(localData, noteDraft.folderId)}`} onPress={cycleFolder} />
              <SecondaryButton
                label={noteDraft.pinned ? "Pinned" : "Pin"}
                onPress={() => setNoteField("pinned", !noteDraft.pinned)}
              />
              <SecondaryButton
                label={noteDraft.archived ? "Archived" : "Archive"}
                onPress={() => setNoteField("archived", !noteDraft.archived)}
              />
              <PrimaryButton label={noteEditingId ? "Save Changes" : "Create Note"} onPress={saveNote} />
              <SecondaryButton label="New Note" onPress={startNewNote} />
            </View>
          </WorkflowFormPanel>

          <SectionHeader icon="note-text-outline" title="Local Notes" />
          <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
            {filteredNotes.length === 0 ? (
              <EmptyState
                actionLabel="New Note"
                icon="note-text-outline"
                message="Create a local prototype note or adjust filters. Do not enter real police records or sensitive information."
                onAction={startNewNote}
                title="No notes found"
              />
            ) : (
              filteredNotes.map((note) => {
                const linkedCount = notesService.getLinkedSummaries(localData, note).length;

                return (
                  <WorkflowItemCard
                    accent={note.pinned ? colors.ptsdGreen : colors.primaryBlue}
                    active={selectedItem === note.title}
                    icon={note.pinned ? "pin" : "note-text-outline"}
                    key={note.id}
                    meta={`${note.category} - ${notesService.getFolderName(localData, note.folderId)}`}
                    onDelete={() =>
                      confirmLocalAction("Delete Note", "Remove this local prototype note from the device?", "Delete", () =>
                        onUpdateLocalData((current) => notesService.deleteNote(current, note.id))
                      )
                    }
                    onEdit={() => editNote(note)}
                    onPress={() => onSelectItem(note.title)}
                    onPrimary={() => onUpdateLocalData((current) => notesService.togglePinned(current, note.id))}
                    primaryLabel={note.pinned ? "Unpin" : "Pin"}
                    reminderEnabled={linkedCount > 0}
                    status={note.archived ? "Archived" : linkedCount ? `${linkedCount} links` : "Local"}
                    subtitle={note.body}
                    title={note.title}
                  />
                );
              })
            )}
          </View>
        </>
      ) : null}

      {activeTab === "Folders" ? (
        <>
          <WorkflowFormPanel icon="folder-plus-outline" title={folderEditingId ? "Rename Folder" : "Create Folder"}>
            <View style={styles.formRow}>
              <WorkflowField label="Folder name" onChangeText={(name) => setFolderField("name", name)} value={folderDraft.name} />
              <WorkflowField
                label="Description"
                onChangeText={(description) => setFolderField("description", description)}
                value={folderDraft.description ?? ""}
              />
            </View>
            <View style={styles.actionRow}>
              <PrimaryButton label={folderEditingId ? "Save Folder" : "Create Folder"} onPress={saveFolder} />
              <SecondaryButton label="New Folder" onPress={startNewFolder} />
            </View>
          </WorkflowFormPanel>

          <SectionHeader icon="folder-multiple-outline" title="Folders" />
          <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
            {filteredFolders.length === 0 ? (
              <EmptyState
                actionLabel="New Folder"
                icon="folder-outline"
                message="Create a local prototype folder or adjust filters. Folders stay on this device only."
                onAction={startNewFolder}
                title="No folders found"
              />
            ) : (
              filteredFolders.map((folder) => {
                const noteCount = localData.structuredNotes.filter((note) => note.folderId === folder.id).length;

                return (
                  <WorkflowItemCard
                    accent={folder.color ?? colors.ptsdGreen}
                    active={selectedItem === folder.name}
                    icon={folder.icon ?? "folder-outline"}
                    key={folder.id}
                    meta={`${noteCount} local notes`}
                    onDelete={() =>
                      confirmLocalAction("Delete Folder", "Remove this local prototype folder and its local references?", "Delete", () =>
                        onUpdateLocalData((current) => notesService.deleteFolder(current, folder.id))
                      )
                    }
                    onEdit={() => editFolder(folder)}
                    onPress={() => onSelectItem(folder.name)}
                    onPrimary={() =>
                      folder.archived
                        ? onUpdateLocalData((current) => notesService.archiveFolder(current, folder.id))
                        : confirmLocalAction("Archive Folder", "Archive this local prototype folder?", "Archive", () =>
                            onUpdateLocalData((current) => notesService.archiveFolder(current, folder.id))
                          )
                    }
                    primaryLabel={folder.archived ? "Restore" : "Archive"}
                    reminderEnabled={!folder.archived}
                    status={folder.archived ? "Archived" : "Local"}
                    subtitle={folder.description ?? "Local folder"}
                    title={folder.name}
                  />
                );
              })
            )}
          </View>
        </>
      ) : null}

      {activeTab === "File Metadata" ? (
        <>
          <WorkflowFormPanel icon="file-plus-outline" title={metadataEditingId ? "Edit Metadata Placeholder" : "Add File Metadata"}>
            <View style={styles.formRow}>
              <WorkflowField
                label="File name placeholder"
                onChangeText={(fileName) => setMetadataField("fileName", fileName)}
                value={metadataDraft.fileName}
              />
              <WorkflowField
                label="Description"
                onChangeText={(description) => setMetadataField("description", description)}
                value={metadataDraft.description}
              />
            </View>
            <View style={styles.actionRow}>
              <SecondaryButton label={`Category: ${metadataDraft.category}`} onPress={cycleMetadataCategory} />
              <SecondaryButton
                label={`Linked note: ${notesService.getFolderName(localData, localData.structuredNotes.find((note) => note.id === metadataDraft.linkedNoteId)?.folderId)}`}
                onPress={() => {
                  const notes = localData.structuredNotes;
                  const currentIndex = notes.findIndex((note) => note.id === metadataDraft.linkedNoteId);
                  setMetadataField("linkedNoteId", notes[(currentIndex + 1) % Math.max(notes.length, 1)]?.id);
                }}
              />
              <PrimaryButton label={metadataEditingId ? "Save Metadata" : "Add Metadata"} onPress={saveMetadata} />
              <SecondaryButton label="New Metadata" onPress={startNewMetadata} />
            </View>
            <DisclaimerBanner message="Metadata placeholders do not open camera, microphone, photo library, document picker, file upload, file sync, or cloud storage." />
          </WorkflowFormPanel>

          <SectionHeader icon="file-cabinet" title="File Metadata Placeholders" />
          <View style={[styles.workflowGrid, isTablet ? styles.workflowGridTablet : null]}>
            {filteredMetadata.length === 0 ? (
              <EmptyState
                actionLabel="New Metadata"
                icon="file-document-outline"
                message="Add a local metadata placeholder. This prototype does not upload, open, or process real files."
                onAction={startNewMetadata}
                title="No file metadata"
              />
            ) : (
              filteredMetadata.map((item) => (
                <WorkflowItemCard
                  accent={colors.ptsdGreen}
                  active={selectedItem === item.fileName}
                  icon="file-document-outline"
                  key={item.id}
                  meta={`${item.category} - ${item.fileType}`}
                  onDelete={() =>
                    confirmLocalAction("Delete Metadata", "Remove this local file metadata placeholder?", "Delete", () =>
                      onUpdateLocalData((current) => notesService.deleteFileMetadata(current, item.id))
                    )
                  }
                  onEdit={() => editMetadata(item)}
                  onPress={() => onSelectItem(item.fileName)}
                  onPrimary={() => editMetadata(item)}
                  primaryLabel="Edit"
                  reminderEnabled={item.metadataOnly}
                  status="Metadata only"
                  subtitle={item.description}
                  title={item.fileName}
                />
              ))
            )}
          </View>
        </>
      ) : null}

      {activeTab === "Linked Items" ? (
        <>
          <WorkflowFormPanel icon="link-variant" title="Save Workflow Output As Notes">
            <View style={styles.actionRow}>
              <PrimaryButton label="Save Latest AI Response" onPress={() => onUpdateLocalData((current) => notesService.saveAIResponseAsNote(current))} />
              <SecondaryButton label="Save Latest Translation" onPress={() => onUpdateLocalData((current) => notesService.saveTranslationRecordAsNote(current))} />
            </View>
            <DisclaimerBanner message="Linked items are local references only. They do not sync to police systems, cloud storage, RMS, disclosure systems, or case management tools." />
          </WorkflowFormPanel>

          <SectionHeader icon="link" title="Linked Local Items" />
          <View style={styles.stack}>
            {linkedNotes.length === 0 ? (
              <EmptyState icon="link-off" title="No links yet" message="Create or save a local note with a workflow link." />
            ) : (
              linkedNotes.map((note) => (
                <View key={note.id} style={styles.reviewPanel}>
                  <Text style={styles.profileName}>{note.title}</Text>
                  <Text style={styles.profileMeta}>{note.category}</Text>
                  <View style={styles.stack}>
                    {notesService.getLinkedSummaries(localData, note).map((summary) => (
                      <WorkflowSummaryCard
                        item={{
                          accent: colors.primaryBlue,
                          icon: summary.icon,
                          id: summary.id,
                          meta: summary.type,
                          status: summary.type,
                          subtitle: summary.subtitle,
                          title: summary.title
                        }}
                        key={`${note.id}-${summary.type}-${summary.id}`}
                        onPress={() => onSelectItem(summary.title)}
                        selected={selectedItem === summary.title}
                      />
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      ) : null}

      <View style={styles.localDataPanel}>
        <View style={styles.localDataHeader}>
          <MaterialCommunityIcons name="shield-lock-outline" size={24} color={colors.ptsdGreen} />
          <Text style={styles.profileName}>Local Prototype Limits</Text>
        </View>
        <Text style={styles.profileMeta}>
          Notes, folders, metadata, and links are stored locally through the existing offline prototype storage. Reset Demo Data restores
          default samples. Clear Local Data removes them from this device.
        </Text>
      </View>

      <PrototypeSelection label={selectedItem} />
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

      await notificationService.cancelAll();

      for (const reminder of candidates) {
        scheduled.push(await notificationService.scheduleReminder(reminder));
      }

      onUpdateLocalData((current) => ({
        ...current,
        scheduledReminders: scheduled,
        updatedAt: new Date().toISOString()
      }));
      Alert.alert("Local Reminders Scheduled", `${scheduled.length} prototype reminders were scheduled locally. Previous prototype notifications were replaced.`);
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

  const confirmCancelAllNotifications = () => {
    Alert.alert(
      "Cancel Local Notifications",
      "This will cancel all scheduled local prototype notifications on this device.",
      [
        { style: "cancel", text: "Keep" },
        { onPress: cancelAllNotifications, style: "destructive", text: "Cancel All" }
      ]
    );
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

  const confirmSignOut = () => {
    Alert.alert(
      "Mock Sign Out",
      "This signs out the local mock user. No production account is affected.",
      [
        { style: "cancel", text: "Stay Signed In" },
        { onPress: onSignOut, text: "Sign Out" }
      ]
    );
  };

  const activeLegalDocument = legalDocuments.find((document) => document.id === selectedItem);
  const activeSettingsView = activeLegalDocument ? activeLegalDocument.id : (selectedItem as SettingsViewId);

  return (
    <ScreenFrame activeModule="settings" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Settings" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Settings & compliance.</Text>
          <Text style={styles.heroSub}>Local privacy, legal, consent, support, and prototype controls.</Text>
        </View>
        <MaterialCommunityIcons name="cog-outline" size={48} color={colors.primaryBlue} />
      </View>

      <View style={styles.profilePanel}>
        <MaterialCommunityIcons name="account-circle-outline" size={42} color={colors.primaryBlue} />
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>
            {profile ? `${profile.firstName} ${profile.lastName}` : "Mock User"}
          </Text>
          <Text style={styles.profileMeta}>
            {profile?.role ?? "Canadian Police Officer"} - Testing / Pre-Launch - iOS-first
          </Text>
        </View>
        <View style={styles.mockBadge}>
          <Text style={styles.mockBadgeText}>Local</Text>
        </View>
      </View>
      <LocalPrototypeWarning />

      <SettingsMenu selectedItem={selectedItem} onSelectItem={onSelectItem} />

      {activeSettingsView === "overview" || selectedItem === "Home" ? (
        <SettingsPanel icon="shield-check-outline" title="Mock Account Status">
          <SettingsFact label="Current status" value={localData.auth.status} />
          <SettingsFact label="Testing stage" value={releaseInfo.status} />
          <SettingsFact label="App version" value={releaseInfo.appVersion} />
          <SettingsFact label="Build" value={releaseInfo.buildNumber} />
          <SettingsFact label="Release channel" value={releaseInfo.releaseChannel} />
          <SettingsFact label="Launch priority" value="iOS active; Android paused pending D-U-N-S Number" />
          <SettingsFact label="Production systems" value="Not connected" />
          <DisclaimerBanner message="This Settings area is local and static for App Store review readiness. It does not connect to account, support, legal, backend, OpenAI, database, payment, or police-service systems." />
        </SettingsPanel>
      ) : null}

      {activeSettingsView === "profile" ? (
        <SettingsPanel icon="account-circle-outline" title="Account">
          <SettingsFact label="Name" value={profile ? `${profile.firstName} ${profile.lastName}` : "Mock User"} />
          <SettingsFact label="Email" value={profile?.email ?? "officer@example.ca"} />
          <SettingsFact label="Role" value={profile?.role ?? "Canadian Police Officer"} />
          <SettingsFact label="Language" value={profile?.preferredLanguage ?? "English"} />
          <SettingsFact label="Mock account status" value={localData.auth.status} />
          <SettingsFact label="Biometric placeholder" value={localData.preferences.biometricEnabled ? "Enabled locally" : "Disabled locally"} />
          <DisclaimerBanner message="This profile is local mock data only. No production account, identity verification, police-service account, or backend authentication is connected." />
        </SettingsPanel>
      ) : null}

      {activeSettingsView === "consent" ? (
        <SettingsPanel icon="file-check-outline" title="Consent Status">
          {Object.entries(localData.auth.consent).map(([key, accepted]) => (
            <View key={key} style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: accepted ? "rgba(127,255,212,0.14)" : "rgba(255,255,255,0.06)" }]}>
                <MaterialCommunityIcons name={accepted ? "check-circle-outline" : "alert-circle-outline"} size={23} color={accepted ? colors.ptsdGreen : colors.warning} />
              </View>
              <View style={styles.profileCopy}>
                <Text style={styles.summaryTitle}>{consentLabel(key)}</Text>
                <Text style={styles.summaryMeta}>
                  {accepted ? `Accepted${localData.auth.consentAcceptedAt?.[key as keyof typeof localData.auth.consent] ? ` - ${new Date(localData.auth.consentAcceptedAt[key as keyof typeof localData.auth.consent]!).toLocaleDateString()}` : ""}` : "Not accepted"}
                </Text>
              </View>
              <Text style={[styles.statusBadge, { color: accepted ? colors.ptsdGreen : colors.warning }]}>
                {accepted ? "Accepted" : "Review"}
              </Text>
            </View>
          ))}
          <View style={styles.actionRow}>
            <SecondaryButton label="Review Terms" onPress={() => onSelectItem("terms")} />
            <SecondaryButton label="Review Privacy" onPress={() => onSelectItem("privacy")} />
            <SecondaryButton
              label="Re-Accept Locally"
              onPress={() => {
                const acceptedAt = new Date().toISOString();
                onUpdateLocalData((current) => ({
                  ...current,
                  auth: {
                    ...current.auth,
                    consent: {
                      aiDisclaimer: true,
                      aiProcessing: true,
                      privacy: true,
                      prototypeDisclaimer: true,
                      ptsdDisclaimer: true,
                      terms: true,
                      translationDisclaimer: true
                    },
                    consentAcceptedAt: {
                      aiDisclaimer: acceptedAt,
                      aiProcessing: acceptedAt,
                      privacy: acceptedAt,
                      prototypeDisclaimer: acceptedAt,
                      ptsdDisclaimer: acceptedAt,
                      terms: acceptedAt,
                      translationDisclaimer: acceptedAt
                    }
                  },
                  preferences: {
                    ...current.preferences,
                    consentStatus: {
                      aiDisclaimer: true,
                      aiProcessing: true,
                      privacy: true,
                      prototypeDisclaimer: true,
                      ptsdDisclaimer: true,
                      terms: true,
                      translationDisclaimer: true
                    }
                  },
                  updatedAt: acceptedAt
                }));
              }}
            />
          </View>
          <DisclaimerBanner message="Consent status is local prototype consent only. OPAi does not connect to backend consent records in this testing version." />
        </SettingsPanel>
      ) : null}

      {activeLegalDocument ? <LegalDocumentPanel document={activeLegalDocument} /> : null}

      {activeSettingsView === "data" ? (
        <SettingsPanel icon="database-outline" title="Data & Storage">
          <SettingsFact label="Storage mode" value="Device-local prototype storage" />
          <SettingsFact label="Last updated" value={new Date(localData.updatedAt).toLocaleString()} />
          <SettingsFact label="Storage version" value={`v${localData.version}`} />
          <View style={styles.stack}>
            {storageCategoryRows.map((row) => (
              <WorkflowSummaryCard
                item={{
                  accent: colors.primaryBlue,
                  icon: row.icon,
                  id: row.title,
                  meta: "local",
                  status: String(row.getCount(localData)),
                  subtitle: "Stored locally for prototype review",
                  title: row.title
                }}
                key={row.title}
                onPress={() => onSelectItem(row.title)}
                selected={selectedItem === row.title}
              />
            ))}
          </View>
          <View style={styles.actionRow}>
            <SecondaryButton label="Reset Demo Data" onPress={confirmResetDemoData}>
              <MaterialCommunityIcons name="backup-restore" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
            <SecondaryButton label="Clear Local Data" onPress={confirmClearLocalData}>
              <MaterialCommunityIcons name="delete-outline" size={20} color={colors.danger} />
            </SecondaryButton>
          </View>
          <DisclaimerBanner message="Clear Local Data removes local prototype data, signs out the mock user, and returns to the Welcome screen. Reset Demo Data restores sample data and keeps the current mock sign-in." />
        </SettingsPanel>
      ) : null}

      {activeSettingsView === "dataSources" ? (
        <SettingsPanel icon="weather-partly-cloudy" title="Data Sources">
          <SettingsFact label="Weather provider" value="Apple WeatherKit on supported iPhone builds" />
          <SettingsFact label="Location handling" value="Optional foreground request; coordinates are not saved or sent to OPAi" />
          <SettingsFact label="Manual cities" value="Bundled Canadian city catalogue stored in the app" />
          <SettingsFact label="Backend weather services" value="None" />
          <View style={styles.actionRow}>
            <SecondaryButton
              label="Apple Weather Data Sources"
              onPress={() => void openExternalUrl(externalLinks.appleWeatherDataSources)}
            >
              <MaterialCommunityIcons name="open-in-new" size={20} color={colors.primaryBlue} />
            </SecondaryButton>
          </View>
          <DisclaimerBanner message="Apple Weather data is informational only and is not an emergency, dispatch, tactical, road-safety, or operational weather source. Time and date continue to work when weather is declined or unavailable." />
        </SettingsPanel>
      ) : null}

      {activeSettingsView === "preferences" ? (
        <SettingsPanel icon="tune-variant" title="App Preferences">
          <SettingsFact label="Language preference" value={localData.preferences.preferredLanguage} />
          <SettingsFact label="Theme" value="Dark OPAi theme" />
          <SettingsFact label="PTSD awareness accent" value="#7FFFD4" />
          <View style={styles.actionRow}>
            <SecondaryButton label={`Notifications ${localData.preferences.notificationsEnabled ? "On" : "Off"}`} onPress={() => togglePreference("notificationsEnabled")} />
            <SecondaryButton label={`Biometrics ${localData.preferences.biometricEnabled ? "On" : "Off"}`} onPress={() => togglePreference("biometricEnabled")} />
            <SecondaryButton label={`PTSD Reminders ${localData.preferences.ptsdRemindersEnabled ? "On" : "Off"}`} onPress={() => togglePreference("ptsdRemindersEnabled")} />
          </View>
          <DisclaimerBanner message="Preferences are local placeholders only. Production settings will require secure backend account and consent handling." />
        </SettingsPanel>
      ) : null}

      {activeSettingsView === "notifications" ? (
        <SettingsPanel icon="bell-ring-outline" title="Notifications">
          <SettingsFact label="Permission status" value={notificationPreference.permissionStatus} />
          <SettingsFact label="Scheduled locally" value={String(localData.scheduledReminders.length)} />
          <DisclaimerBanner message="Notification reminders in this testing version are scheduled locally on this device. OPAi does not send remote push notifications in this prototype." />
          <View style={styles.actionRow}>
            <SecondaryButton label="Enable Notifications" onPress={handleRequestNotificationPermission} />
            <SecondaryButton label="Maybe Later" onPress={handleMaybeLater} />
            <SecondaryButton
              label={`Enable All ${notificationPreference.enabled ? "On" : "Off"}`}
              onPress={() =>
                updateNotificationPreference((current) => ({
                  ...current,
                  enabled: !current.enabled,
                  lastUpdatedAt: new Date().toISOString()
                }))
              }
            />
          </View>
          {notificationPreferenceRows.map((row) => (
            <View key={row.key} style={styles.notificationPreferenceRow}>
              <SecondaryButton label={`${row.label} ${notificationPreference[row.key] ? "On" : "Off"}`} onPress={() => toggleNotificationCategory(row.key)} />
              <SecondaryButton label={leadTimeLabels[notificationPreference.reminderLeadTimes[row.type]]} onPress={() => cycleLeadTime(row.type)} />
            </View>
          ))}
          <View style={styles.actionRow}>
            <SecondaryButton label="Test in 10 sec" onPress={() => scheduleDemo("test")} />
            <SecondaryButton label="Demo Court" onPress={() => scheduleDemo("court")} />
            <SecondaryButton label="Demo Training" onPress={() => scheduleDemo("training")} />
            <SecondaryButton label="Schedule Local Reminders" onPress={scheduleStoredReminders} />
            <SecondaryButton label="Cancel All Local Notifications" onPress={confirmCancelAllNotifications} />
          </View>
          <DisclaimerBanner message={courtTrainingDisclaimer} />
        </SettingsPanel>
      ) : null}

      {activeSettingsView === "support" ? (
        <SettingsPanel icon="lifebuoy" title="Support">
          <SettingsFact label="Support" value="support@opaiapp.com" />
          <SettingsFact label="Privacy" value="privacy@opaiapp.com" />
          <SettingsFact label="Security" value="security@opaiapp.com" />
          <SettingsFact label="Legal" value="legal@opaiapp.com" />
          <SettingsFact label="Website" value="https://opaiapp.com" />
          <SettingsFact label="Contact URL" value={externalLinks.contact} />
          <SettingsFact label="Support URL" value={externalLinks.support} />
          <SettingsFact label="WhatsApp Channel" value={externalLinks.whatsappChannel} />
          <SettingsFact label="Instagram" value="@opaiapp" />
          <SettingsFact label="Facebook" value={externalLinks.facebook} />
          <SettingsFact label="App status" value={releaseInfo.status} />
          <SettingsFact label="Version" value={releaseInfo.appVersion} />
          <SettingsFact label="Build" value={releaseInfo.buildNumber} />
          <SettingsFact label="Release channel" value={releaseInfo.releaseChannel} />
          <CommunityLinksCard />
          <DisclaimerBanner message="No live email sending or support ticket submission is connected in this prototype." />
          <DisclaimerBanner message="Community links open outside the app. OPAi does not add tracking scripts or analytics in this prototype." />
        </SettingsPanel>
      ) : null}

      {activeSettingsView === "about" ? (
        <SettingsPanel icon="information-outline" title="About OPAi">
          <Text style={styles.profileMeta}>
            OPAi Police is an AI assistant built for Canadian policing. This iOS-first testing version supports productivity,
            organization, shift readiness, report drafting, translation, court/training reminders, notes, file metadata
            placeholders, and PTSD awareness.
          </Text>
          <SettingsFact label="Status" value={releaseInfo.status} />
          <SettingsFact label="Version" value={releaseInfo.appVersion} />
          <SettingsFact label="Build" value={releaseInfo.buildNumber} />
          <SettingsFact label="Platform priority" value={releaseInfo.platformPriority} />
          <SettingsFact label="Website" value="https://opaiapp.com" />
          <DisclaimerBanner message="OPAi Police is not official police software and is not affiliated with government or police services unless explicitly authorized in future agreements." />
          <DisclaimerBanner message={ptsdDisclaimer} />
        </SettingsPanel>
      ) : null}

      <SecondaryButton label="Mock Sign Out" onPress={confirmSignOut}>
        <Ionicons name="log-out-outline" size={20} color={colors.primaryBlue} />
      </SecondaryButton>
      <PrototypeSelection label={selectedItem} />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function consentLabel(key: string) {
  const labels: Record<string, string> = {
    aiDisclaimer: "AI Disclaimer",
    privacy: "Privacy Policy",
    prototypeDisclaimer: "Prototype / Testing Disclaimer",
    ptsdDisclaimer: "PTSD Awareness Disclaimer",
    terms: "Terms of Use",
    translationDisclaimer: "Translation Disclaimer"
  };

  return labels[key] ?? key;
}

function SettingsMenu({
  onSelectItem,
  selectedItem
}: {
  onSelectItem: (label: string) => void;
  selectedItem: string;
}) {
  return (
    <View style={styles.stack}>
      {settingsMenuSections.map((section) => (
        <View key={section.title} style={styles.localDataPanel}>
          <View style={styles.localDataHeader}>
            <MaterialCommunityIcons name="view-list-outline" size={23} color={colors.primaryBlue} />
            <Text style={styles.profileName}>{section.title}</Text>
          </View>
          <View style={styles.stack}>
            {section.items.map((item) => (
              <Pressable
                accessibilityLabel={`${item.title}. ${item.subtitle}`}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedItem === item.id || selectedItem === item.title }}
                key={`${section.title}-${item.id}-${item.title}`}
                onPress={() => onSelectItem(item.id)}
                style={({ pressed }) => [
                  styles.summaryCard,
                  selectedItem === item.id || selectedItem === item.title ? styles.workflowCardActive : null,
                  pressed ? styles.pressed : null
                ]}
              >
                <View style={[styles.summaryIcon, { backgroundColor: "rgba(10,132,255,0.12)" }]}>
                  <MaterialCommunityIcons name={item.icon} size={23} color={colors.primaryBlue} />
                </View>
                <View style={styles.profileCopy}>
                  <Text numberOfLines={1} style={styles.summaryTitle}>{item.title}</Text>
                  <Text numberOfLines={2} style={styles.summaryMeta}>{item.subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={23} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function SettingsPanel({ children, icon, title }: { children: ReactNode; icon: MciIcon; title: string }) {
  return (
    <View style={styles.localDataPanel}>
      <View style={styles.localDataHeader}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.ptsdGreen} />
        <Text style={styles.profileName}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function SettingsFact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.selectionBanner}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text numberOfLines={2} style={styles.selectionText}>{value}</Text>
    </View>
  );
}

function LegalDocumentPanel({ document }: { document: LegalDocument }) {
  return (
    <SettingsPanel icon={document.icon} title={document.title}>
      <Text style={styles.profileMeta}>{document.subtitle}</Text>
      <View style={styles.stack}>
        {document.body.map((paragraph) => (
          <View key={paragraph} style={styles.reviewPanel}>
            <Text style={styles.profileMeta}>{paragraph}</Text>
          </View>
        ))}
      </View>
      {document.productionUrl ? (
        <SettingsFact label="Future production URL" value={document.productionUrl} />
      ) : null}
      <DisclaimerBanner message="This is local static legal text for the testing/pre-launch prototype. Final production legal text and URLs must be verified before App Store submission." />
    </SettingsPanel>
  );
}

function LocalPrototypeWarning() {
  return (
    <DisclaimerBanner message="OPAi is currently in testing/pre-launch. Data in this prototype may be stored locally on this device for demonstration purposes. Do not enter real police records, real evidence, confidential information, or sensitive personal information. Future production versions will use secure backend storage, encryption, access controls, and privacy-by-design protections." />
  );
}

function AIPrototypeBanner() {
  return (
    <View style={styles.prototypeBanner}>
      <MaterialCommunityIcons name="shield-lock-outline" size={20} color={colors.ptsdGreen} />
      <Text style={styles.prototypeBannerText}>
        Secure staging AI. Prompts are processed by OPAi&apos;s backend and are not stored by the AI provider.
      </Text>
    </View>
  );
}

function AISafetyNotice() {
  return (
    <View style={styles.disclaimerStack}>
      <DisclaimerBanner message="This prototype does not provide legal advice, medical advice, operational direction, or emergency support. Follow service policy, law, training, and supervisor direction." />
      <DisclaimerBanner message="OPAi Police is a productivity and AI assistance tool. AI-generated responses may be incomplete, inaccurate, or inappropriate for a specific situation and must be verified by the user." />
      <DisclaimerBanner message="OPAi Police does not replace official police systems, service policy, supervision, training, legal advice, court requirements, or professional judgment." />
      <DisclaimerBanner message="PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, crisis intervention, or emergency support." />
      <DisclaimerBanner message="Do not submit operational police records, evidence, confidential information, or sensitive personal information during testing." />
    </View>
  );
}

function WellnessDisclaimer() {
  return (
    <DisclaimerBanner message="PTSD awareness content is educational and supportive only. It is not medical diagnosis, treatment, therapy, crisis intervention, or emergency support. If you are in immediate danger or crisis, contact local emergency services or a qualified crisis support service." />
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
            accessibilityLabel={`Open ${module.title}`}
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

function CommunityLinksCard({ compact = false }: { compact?: boolean }) {
  const links = [
    { icon: "whatsapp" as MciIcon, label: "WhatsApp", url: externalLinks.whatsappChannel },
    { icon: "instagram" as MciIcon, label: "@opaiapp", url: externalLinks.instagram },
    { icon: "facebook" as MciIcon, label: "Facebook", url: externalLinks.facebook }
  ];

  return (
    <View style={[styles.communityCard, compact ? styles.communityCardCompact : null]}>
      <View style={styles.localDataHeader}>
        <MaterialCommunityIcons name="bullhorn-outline" size={22} color={colors.ptsdGreen} />
        <View style={styles.profileCopy}>
          <Text style={styles.communityTitle}>Updates</Text>
          <Text numberOfLines={1} style={styles.communityMeta}>Follow OPAi - opens external services</Text>
        </View>
      </View>
      <View style={styles.communityActions}>
        {links.map((link) => (
          <Pressable
            accessibilityLabel={`Open ${link.label}`}
            accessibilityRole="link"
            key={link.label}
            onPress={() => openExternalUrl(link.url)}
            style={({ pressed }) => [styles.communityLink, pressed ? styles.pressed : null]}
          >
            <MaterialCommunityIcons name={link.icon} size={18} color={colors.primaryBlue} />
            <Text numberOfLines={1} style={styles.communityLinkText}>{link.label}</Text>
          </Pressable>
        ))}
      </View>
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
      accessibilityLabel={`${item.title}. ${item.subtitle}. ${item.status}`}
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
      accessibilityLabel={`${title}. ${subtitle}. ${status}`}
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
          <Text numberOfLines={2} style={styles.workflowTitle}>{title}</Text>
          <Text numberOfLines={1} style={styles.workflowMeta}>{meta}</Text>
        </View>
        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.statusBadge, { color: accent }]}>{status}</Text>
      </View>
      <Text numberOfLines={2} style={styles.workflowSubtitle}>{subtitle}</Text>
      <View style={styles.workflowCardFooter}>
        <View style={styles.reminderStatus}>
          <MaterialCommunityIcons name={reminderEnabled ? "bell-check-outline" : "bell-off-outline"} size={16} color={reminderEnabled ? colors.ptsdGreen : colors.textMuted} />
          <Text style={styles.reminderStatusText}>{reminderEnabled ? "Reminder on" : "Reminder off"}</Text>
        </View>
        <View style={styles.workflowActions}>
          <Pressable accessibilityLabel={`Edit ${title}`} accessibilityRole="button" onPress={onEdit} style={styles.iconAction}>
            <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primaryBlue} />
          </Pressable>
          <Pressable accessibilityLabel={`${primaryLabel} ${title}`} accessibilityRole="button" onPress={onPrimary} style={styles.iconAction}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.ptsdGreen} />
            <Text style={styles.iconActionLabel}>{primaryLabel}</Text>
          </Pressable>
          <Pressable accessibilityLabel={`Delete ${title}`} accessibilityRole="button" onPress={onDelete} style={styles.iconAction}>
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
    flexShrink: 0,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  aiHeroCopy: {
    flex: 1,
    minWidth: 0
  },
  aiHeroSub: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "800",
    marginTop: spacing.xs
  },
  aiHeroTitle: {
    color: colors.textPrimary,
    flexShrink: 1,
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 33
  },
  aiPanel: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.72)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.xxl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  blueText: {
    color: colors.primaryBlue
  },
  categoryChip: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.62)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs
  },
  categoryChipActive: {
    backgroundColor: "rgba(10,132,255,0.24)",
    borderColor: colors.primaryBlue
  },
  categoryChipText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: "900"
  },
  centerHero: {
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md
  },
  chatBubbleAssistant: {
    backgroundColor: "rgba(127,255,212,0.08)",
    borderColor: "rgba(127,255,212,0.24)",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(10,132,255,0.18)",
    borderColor: "rgba(77,163,255,0.3)",
    borderRadius: radius.lg,
    borderWidth: 1,
    maxWidth: "92%",
    padding: spacing.md
  },
  chatCard: {
    gap: spacing.sm
  },
  chatLabel: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  chatText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 21
  },
  content: {
    gap: spacing.lg,
    minWidth: 0,
    width: "100%"
  },
  communityActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  communityCard: {
    backgroundColor: "rgba(3,18,30,0.88)",
    borderColor: "rgba(127,255,212,0.34)",
    borderRadius: radius.xxl,
    borderWidth: 1,
    gap: spacing.base,
    padding: spacing.md
  },
  communityCardCompact: {
    padding: spacing.md
  },
  communityLink: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: "rgba(77,163,255,0.30)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    flexGrow: 1,
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 42,
    minWidth: 96,
    paddingHorizontal: spacing.sm
  },
  communityLinkText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "900"
  },
  communityMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "800"
  },
  communityTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: "900"
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
  homeActionCard: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.78)",
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: radius.xl,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 104,
    minWidth: 142,
    padding: spacing.base
  },
  homeActionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  homeActionGridTablet: {
    justifyContent: "flex-start"
  },
  homeActionIcon: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.13)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  homeActionTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: "900",
    maxWidth: "100%",
    textAlign: "center"
  },
  homeHero: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.56)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.xxl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    overflow: "hidden",
    padding: spacing.md
  },
  homeHeroChip: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 30,
    paddingHorizontal: spacing.sm
  },
  homeHeroChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.base
  },
  homeHeroChipText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "900"
  },
  homeHeroCopy: {
    flex: 1,
    minWidth: 0
  },
  homeHeroMark: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.14)",
    borderColor: "rgba(77,163,255,0.32)",
    borderRadius: radius.xxl,
    borderWidth: 1,
    height: 82,
    justifyContent: "center",
    width: 82
  },
  homeHeroTitle: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 40
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
    flex: 1,
    minWidth: 0
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
  mockBadge: {
    backgroundColor: "rgba(127,255,212,0.12)",
    borderColor: "rgba(127,255,212,0.35)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexShrink: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  mockBadgeText: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  notificationPreferenceRow: {
    gap: spacing.sm
  },
  heroSub: {
    color: colors.textMuted,
    fontSize: typography.body,
    flexShrink: 1,
    lineHeight: 22,
    marginTop: spacing.xs
  },
  heroTablet: {
    minHeight: 160
  },
  heroTitle: {
    color: colors.textPrimary,
    flexShrink: 1,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 35
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
    minHeight: 44,
    minWidth: 44,
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
    flex: 1,
    minWidth: 0
  },
  profileMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    flexShrink: 1,
    lineHeight: 20
  },
  profileName: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    flexShrink: 1,
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
  promptChip: {
    alignItems: "center",
    backgroundColor: "rgba(127,255,212,0.08)",
    borderColor: "rgba(127,255,212,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs
  },
  promptChipText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: "900",
    maxWidth: 170
  },
  prototypeBanner: {
    alignItems: "center",
    backgroundColor: "rgba(127,255,212,0.10)",
    borderColor: "rgba(127,255,212,0.28)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.base
  },
  prototypeBannerText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: typography.small,
    fontWeight: "800",
    lineHeight: 20
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
    flexGrow: 1,
    gap: spacing.sm,
    minWidth: 150,
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
    fontWeight: "900",
    minWidth: 0
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
    minHeight: 44,
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
    flexShrink: 0,
    fontSize: typography.caption,
    fontWeight: "900",
    maxWidth: 96,
    minWidth: 58,
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
    minWidth: 0,
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
    flexShrink: 0,
    width: 42
  },
  summaryMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    flexShrink: 1
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "900",
    flexShrink: 1
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
    fontWeight: "800",
    flexShrink: 1
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
    flexShrink: 1,
    lineHeight: 20
  },
  workflowTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: "900",
    flexShrink: 1
  }
});
