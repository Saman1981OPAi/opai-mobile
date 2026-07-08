import type { ReactNode } from "react";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
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
import { legalLinks, requiredDisclaimers } from "@/data/compliance";
import {
  aiTools,
  calendarEvents,
  courtReminders,
  followUpReminders,
  homeFeatures,
  incidentExamples,
  incidentSteps,
  notesFiles,
  secondaryModules,
  settingsItems,
  shiftReminders,
  trainingReminders,
  translationExamples,
  translationModes
} from "@/data/uiMockups";
import { colors, layout, radius, spacing, typography } from "@/theme/tokens";
import type { MockUserProfile } from "@/types/auth";
import type { AppModule, ModuleId } from "@/types/navigation";

type ModuleScreenProps = {
  module: AppModule;
  onSelectModule: (module: ModuleId) => void;
  onSignOut: () => void;
  profile: MockUserProfile | null;
};

export function ModuleScreen({ module, onSelectModule, onSignOut, profile }: ModuleScreenProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= layout.tabletBreakpoint;
  const [selectedItem, setSelectedItem] = useState("Home");
  const selectItem = (label: string) => setSelectedItem(label);

  if (module.id === "dashboard") {
    return (
      <HomeDashboardScreen
        isTablet={isTablet}
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
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        selectedItem={selectedItem}
      />
    );
  }

  if (module.id === "incident") {
    return (
      <NewIncidentScreen
        isTablet={isTablet}
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
        onSelectItem={selectItem}
        onSelectModule={onSelectModule}
        onSignOut={onSignOut}
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
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {homeFeatures.map((feature) => (
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
        {calendarEvents.map((event) => (
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
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {shiftReminders.map((reminder) => (
          <ReminderCard
            active={selectedItem === reminder.title}
            key={reminder.title}
            onPress={() => onSelectItem(reminder.title)}
            {...reminder}
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
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {incidentSteps.map((step) => (
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
        {incidentExamples.map((item) => (
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
      <DisclaimerBanner message="No data is saved in Sprint 003. Incident screens use placeholder content only." />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function AIAssistantScreen({
  isTablet,
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {aiTools.map((tool) => (
          <ReminderCard
            active={selectedItem === tool.title}
            key={tool.title}
            onPress={() => onSelectItem(tool.title)}
            {...tool}
          />
        ))}
      </View>

      <AIInputBar onPress={() => onSelectItem("AI input preview")} placeholder="Voice or text command..." />
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Static UI only. AI calls and data processing start in a later sprint." />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function TranslationScreen({
  isTablet,
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {translationModes.map((mode) => (
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
        {translationExamples.map((item) => (
          <ReminderCard
            active={selectedItem === item.title}
            key={item.title}
            onPress={() => onSelectItem(item.title)}
            {...item}
          />
        ))}
      </View>

      <AIInputBar onPress={() => onSelectItem("Translation input")} placeholder="Enter text to translate..." />
      <PrototypeSelection label={selectedItem} />
      <DisclaimerBanner message="Translation is a static preview. Police-context translation logic is not connected yet." />
      <CoreDisclaimer />
    </ScreenFrame>
  );
}

function CalendarScreen({
  isTablet,
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {calendarEvents.map((event) => (
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
        {followUpReminders.map((item) => (
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
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {courtReminders.map((item) => (
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
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {trainingReminders.map((item) => (
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
  onSelectItem,
  onSelectModule,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  selectedItem: string;
}) {
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
        {notesFiles.map((item) => (
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

function SettingsScreen({
  isTablet,
  onSelectItem,
  onSelectModule,
  onSignOut,
  profile,
  selectedItem
}: {
  isTablet: boolean;
  onSelectItem: (label: string) => void;
  onSelectModule: (module: ModuleId) => void;
  onSignOut: () => void;
  profile: MockUserProfile | null;
  selectedItem: string;
}) {
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
      <View style={styles.legalPanel}>
        <Text style={styles.legalTitle}>Legal and support references</Text>
        {legalLinks.map((link) => (
          <Text key={link.url} numberOfLines={1} style={styles.legalLink}>
            {link.label}: {link.url}
          </Text>
        ))}
      </View>
      <PrototypeSelection label={selectedItem} />
      <CoreDisclaimer />
    </ScreenFrame>
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
      {requiredDisclaimers.map((message) => (
        <DisclaimerBanner key={message} message={message} />
      ))}
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
  legalLink: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  legalPanel: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  legalTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "900"
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
