import type { ReactNode } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
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
import {
  aiTools,
  calendarEvents,
  homeFeatures,
  incidentSteps,
  shiftReminders,
  translationModes
} from "@/data/uiMockups";
import { colors, layout, radius, spacing, typography } from "@/theme/tokens";
import type { AppModule, ModuleId } from "@/types/navigation";

type ModuleScreenProps = {
  module: AppModule;
  onSelectModule: (module: ModuleId) => void;
};

export function ModuleScreen({ module, onSelectModule }: ModuleScreenProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= layout.tabletBreakpoint;

  if (module.id === "dashboard") {
    return <HomeDashboardScreen isTablet={isTablet} onSelectModule={onSelectModule} />;
  }

  if (module.id === "shift") {
    return <StartShiftScreen isTablet={isTablet} />;
  }

  if (module.id === "incident") {
    return <NewIncidentScreen isTablet={isTablet} />;
  }

  if (module.id === "ai") {
    return <AIAssistantScreen isTablet={isTablet} onSelectModule={onSelectModule} />;
  }

  if (module.id === "translation") {
    return <TranslationScreen isTablet={isTablet} />;
  }

  if (module.id === "calendar") {
    return <CalendarScreen isTablet={isTablet} />;
  }

  return (
    <ScreenFrame isTablet={isTablet}>
      <AppHeader title={module.shortLabel} />
      <EmptyState
        icon="progress-wrench"
        title={`${module.shortLabel} preview`}
        message="This module is planned for a later sprint. Sprint 002 keeps it as a static placeholder."
      />
      <DisclaimerBanner />
    </ScreenFrame>
  );
}

function ScreenFrame({ children, isTablet }: { children: ReactNode; isTablet: boolean }) {
  return (
    <View style={styles.screen}>
      <View style={[styles.content, isTablet ? styles.contentTablet : null]}>{children}</View>
    </View>
  );
}

function HomeDashboardScreen({
  isTablet,
  onSelectModule
}: {
  isTablet: boolean;
  onSelectModule: (module: ModuleId) => void;
}) {
  return (
    <ScreenFrame isTablet={isTablet}>
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
          <EventCard key={event.title} {...event} />
        ))}
      </View>

      <PTSDRibbonCard />
      <AIInputBar placeholder="Ask OPAi..." />
      <DisclaimerBanner />
    </ScreenFrame>
  );
}

function StartShiftScreen({ isTablet }: { isTablet: boolean }) {
  return (
    <ScreenFrame isTablet={isTablet}>
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
          <ReminderCard key={reminder.title} {...reminder} />
        ))}
      </View>

      <PrimaryButton label="I'm Ready">
        <MaterialCommunityIcons name="leaf-maple" size={24} color={colors.textPrimary} />
      </PrimaryButton>
      <DisclaimerBanner message="Supportive reminder preview only. This is not a mandatory checklist." />
    </ScreenFrame>
  );
}

function NewIncidentScreen({ isTablet }: { isTablet: boolean }) {
  return (
    <ScreenFrame isTablet={isTablet}>
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
          <FeatureCard compact={isTablet} icon={step.icon} key={step.title} subtitle={step.subtitle} title={step.title} />
        ))}
      </View>

      <SecondaryButton label="Draft Preview">
        <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.primaryBlue} />
      </SecondaryButton>
      <DisclaimerBanner message="No data is saved in Sprint 002. Incident screens use placeholder content only." />
    </ScreenFrame>
  );
}

function AIAssistantScreen({
  isTablet,
  onSelectModule
}: {
  isTablet: boolean;
  onSelectModule: (module: ModuleId) => void;
}) {
  return (
    <ScreenFrame isTablet={isTablet}>
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
          <ReminderCard key={tool.title} {...tool} />
        ))}
      </View>

      <AIInputBar placeholder="Voice or text command..." />
      <DisclaimerBanner message="Static UI only. AI calls and data processing start in a later sprint." />
    </ScreenFrame>
  );
}

function TranslationScreen({ isTablet }: { isTablet: boolean }) {
  return (
    <ScreenFrame isTablet={isTablet}>
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
          <FeatureCard compact={isTablet} icon={mode.icon} key={mode.title} subtitle={mode.subtitle} title={mode.title} />
        ))}
      </View>

      <AIInputBar placeholder="Enter text to translate..." />
      <DisclaimerBanner message="Translation is a static preview. Police-context translation logic is not connected yet." />
    </ScreenFrame>
  );
}

function CalendarScreen({ isTablet }: { isTablet: boolean }) {
  return (
    <ScreenFrame isTablet={isTablet}>
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
          <EventCard key={event.title} {...event} />
        ))}
      </View>

      <SecondaryButton label="Connect Calendar Later">
        <Ionicons name="lock-closed-outline" size={20} color={colors.primaryBlue} />
      </SecondaryButton>
      <DisclaimerBanner message="Calendar sync requires explicit authorization and is not connected in Sprint 002." />
    </ScreenFrame>
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
