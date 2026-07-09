import type { ReactNode } from "react";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
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
import { calendarService } from "@/services/calendarService";
import { courtService } from "@/services/courtService";
import { dashboardService } from "@/services/dashboardService";
import { incidentService } from "@/services/incidentService";
import { notesService } from "@/services/notesService";
import { notificationService } from "@/services/notificationService";
import type { LocalAppData } from "@/storage/storageTypes";
import { trainingService } from "@/services/trainingService";
import { translationService } from "@/services/translationService";
import { colors, layout, radius, spacing, typography } from "@/theme/tokens";
import type { MockUserProfile } from "@/types/auth";
import type { AppModule, ModuleId } from "@/types/navigation";
import type { NotificationCategory, NotificationLeadTime, NotificationPreference, ScheduledReminder } from "@/types/notifications";

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
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
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
        isTablet={isTablet}
        localData={localData}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "court") {
    return (
      <CourtScreen
        isTablet={isTablet}
        localData={localData}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "training") {
    return (
      <TrainingScreen
        isTablet={isTablet}
        localData={localData}
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
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

  return (
    <ScreenFrame activeModule="shift" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="Start My Shift" />
      <View style={styles.centerHero}>
        <Text style={styles.heroTitle}>
          Start Every Shift <Text style={styles.blueText}>Prepared</Text>
        </Text>
        <Text style={styles.heroSub}>Reminders only. Not mandatory.</Text>
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

function NewIncidentScreen({
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
  const steps = incidentService.getWorkflowSteps();
  const examples = incidentService.getExamples(localData);

  return (
    <ScreenFrame activeModule="incident" isTablet={isTablet} onSelectModule={onSelectModule}>
      <AppHeader title="New Incident" />
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Capture key details.</Text>
          <Text style={styles.heroSub}>Static report workflow preview.</Text>
        </View>
        <MaterialCommunityIcons name="file-plus-outline" size={48} color={colors.primaryBlue} />
      </View>

      <SectionHeader icon="clipboard-text-outline" title="Report Sections" />
      <View style={[styles.grid, isTablet ? styles.gridTablet : null]}>
        {steps.map((step) => (
          <FeatureCard
            compact={isTablet}
            icon={step.icon}
            key={step.title}
            onPress={() => onSelectItem(step.title)}
            subtitle={step.subtitle}
            title={step.title}
          />
        ))}
      </View>

      <SectionHeader icon="file-document-outline" title="Examples" />
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

      <SecondaryButton label="Draft Preview">
        <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.primaryBlue} />
      </SecondaryButton>
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Incident drafts are local prototype data only. Do not enter real police records, evidence, confidential information, or sensitive personal information." />
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

function CalendarScreen({
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
  const events = calendarService.getEvents(localData);
  const followUps = calendarService.getFollowUps(localData);

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

      <SectionHeader icon="calendar-month-outline" title="Today" />
      <View style={styles.stack}>
        {events.map((event) => (
          <EventCard
            active={selectedItem === event.title}
            key={event.title}
            onPress={() => onSelectItem(event.title)}
            {...event}
          />
        ))}
      </View>

      <SectionHeader icon="clipboard-check-outline" title="Follow-Ups" />
      <View style={styles.stack}>
        {followUps.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            key={item.title}
            onPress={() => onSelectItem(item.title)}
            {...item}
          />
        ))}
      </View>

      <SecondaryButton label="Connect Calendar Later">
        <Ionicons name="lock-closed-outline" size={20} color={colors.primaryBlue} />
      </SecondaryButton>
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Calendar sync requires explicit authorization and is not connected in Sprint 003." />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function CourtScreen({
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
  const reminders = courtService.getEvents(localData);

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

      <SectionHeader icon="scale-balance" title="Court Reminders" />
      <View style={styles.stack}>
        {reminders.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            key={item.title}
            onPress={() => onSelectItem(item.title)}
            {...item}
          />
        ))}
      </View>
      <PrototypeSelection label={selectedItem} />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function TrainingScreen({
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
  const reminders = trainingService.getRequalification(localData);

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

      <SectionHeader icon="target" title="Requalification" />
      <View style={styles.stack}>
        {reminders.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            key={item.title}
            onPress={() => onSelectItem(item.title)}
            {...item}
          />
        ))}
      </View>
      <PrototypeSelection label={selectedItem} />
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

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
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
  disclaimerStack: {
    gap: spacing.sm
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
  }
});
