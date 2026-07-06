import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActionButton, Card, Pill, SectionTitle } from "@/components/Primitives";
import { aiActions, calendarItems, incidentFields, privacySettings, shiftReminders, translationModes } from "@/data/workflows";
import { modules } from "@/data/modules";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import type { AppModule, ModuleId, ReminderItem } from "@/types/navigation";

type ModuleScreenProps = {
  module: AppModule;
  onSelectModule: (module: ModuleId) => void;
};

export function ModuleScreen({ module, onSelectModule }: ModuleScreenProps) {
  switch (module.id) {
    case "dashboard":
      return <DashboardScreen onSelectModule={onSelectModule} />;
    case "shift":
      return <ShiftScreen />;
    case "incident":
      return <IncidentScreen />;
    case "translation":
      return <TranslationScreen />;
    case "calendar":
      return <CalendarScreen />;
    case "ai":
      return <AiScreen />;
    case "court":
      return <CourtScreen />;
    case "training":
      return <TrainingScreen />;
    case "notes":
      return <NotesScreen />;
    case "notifications":
      return <NotificationsScreen />;
    case "settings":
      return <SettingsScreen />;
    default:
      return null;
  }
}

function DashboardScreen({ onSelectModule }: { onSelectModule: (module: ModuleId) => void }) {
  const topModules = modules.filter((module) => ["shift", "incident", "translation", "calendar"].includes(module.id));
  const secondaryModules = modules.filter((module) => ["court", "training", "notes", "notifications", "settings"].includes(module.id));

  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Dashboard" title="Good morning. Your operational view is ready." />
      <View style={styles.grid}>
        {topModules.map((module) => (
          <Pressable
            accessibilityRole="button"
            key={module.id}
            onPress={() => onSelectModule(module.id)}
            style={({ pressed }) => [styles.moduleTile, pressed ? styles.pressed : null]}
          >
            <Text style={styles.moduleIcon}>{module.icon}</Text>
            <Text style={styles.moduleTitle}>{module.shortLabel}</Text>
            <Text style={styles.moduleSummary} numberOfLines={3}>{module.summary}</Text>
          </Pressable>
        ))}
      </View>
      <Card eyebrow="More tools" title="Officer support modules">
        <View style={styles.compactGrid}>
          {secondaryModules.map((module) => (
            <Pressable
              accessibilityRole="button"
              key={module.id}
              onPress={() => onSelectModule(module.id)}
              style={({ pressed }) => [styles.compactTile, pressed ? styles.pressed : null]}
            >
              <Text style={styles.compactIcon}>{module.icon}</Text>
              <Text style={styles.compactTitle}>{module.shortLabel}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card eyebrow="Readiness summary" title="Today needs attention">
        <SummaryRow label="Court" value="1 date" tone="danger" />
        <SummaryRow label="Training" value="2 deadlines" tone="warning" />
        <SummaryRow label="Follow-ups" value="4 open" tone="blue" />
      </Card>
    </View>
  );
}

function ShiftScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Reminder screen" title="Start My Shift" />
      <Text style={styles.lead}>
        These reminders are optional support prompts. They do not force answers, create reports, or add administrative burden.
      </Text>
      {shiftReminders.map((item) => (
        <ReminderRow key={item.id} item={item} />
      ))}
    </View>
  );
}

function IncidentScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Guided workflow" title="New Incident" />
      <Card title="Incident capture">
        <Text style={styles.body}>Organize incident material first. Draft reports only after officer review.</Text>
        <View style={styles.listGrid}>
          {incidentFields.map((field) => (
            <View key={field} style={styles.listItem}>
              <Text style={styles.listBullet}>+</Text>
              <Text style={styles.listText}>{field}</Text>
            </View>
          ))}
        </View>
        <ActionButton label="Start guided incident" />
      </Card>
    </View>
  );
}

function TranslationScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Police-context tools" title="Translation" />
      {translationModes.map((mode) => (
        <Card key={mode} title={mode}>
          <Text style={styles.body}>Prepared for secure translation workflows with clear consent for voice, camera, files, and OCR.</Text>
        </Card>
      ))}
    </View>
  );
}

function CalendarScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="AI-assisted scheduling" title="Calendar" />
      <ScheduleList />
    </View>
  );
}

function AiScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Active assistant" title="Police-focused AI actions" />
      <Card title="Suggested actions">
        <View style={styles.actionGrid}>
          {aiActions.map((action) => (
            <View key={action} style={styles.aiAction}>
              <Text style={styles.aiActionText}>{action}</Text>
            </View>
          ))}
        </View>
      </Card>
      <Card eyebrow="Review required" title="AI assists. Officers decide.">
        <Text style={styles.body}>Drafting, legal research, summaries, and translations must remain reviewable before operational use.</Text>
      </Card>
    </View>
  );
}

function CourtScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Critical reminders" title="Court" />
      <Card title="Next appearance">
        <SummaryRow label="Date" value="Today" tone="danger" />
        <SummaryRow label="Time" value="13:30" tone="danger" />
        <SummaryRow label="Preparation" value="Review notes and report" tone="blue" />
        <ActionButton label="Open court assistant" variant="secondary" />
      </Card>
    </View>
  );
}

function TrainingScreen() {
  const items = ["Annual firearms", "Use of Force", "CEW", "CPR / First Aid", "Policy review"];

  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Training & Requalification" title="Stay ahead of deadlines" />
      {items.map((item, index) => (
        <Card key={item} title={item}>
          <SummaryRow label="Status" value={index < 2 ? "Due soon" : "Tracked"} tone={index < 2 ? "warning" : "blue"} />
        </Card>
      ))}
    </View>
  );
}

function NotesScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Case material" title="Notes & Files" />
      <Card title="Secure file organization">
        <Text style={styles.body}>Prepare for notes, photos, documents, audio, and evidence references with minimal unnecessary storage.</Text>
        <ActionButton label="Attach file" variant="secondary" />
      </Card>
      <Card title="AI note summary">
        <Text style={styles.body}>Summaries should clearly state which notes or files were used.</Text>
      </Card>
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Reminders" title="Notifications" />
      <Card title="Reminder types">
        <SummaryRow label="Standard" value="Shift and follow-up reminders" tone="blue" />
        <SummaryRow label="Persistent" value="Court, training, qualification" tone="warning" />
        <SummaryRow label="Call-style" value="Optional critical alerts" tone="danger" />
      </Card>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.stack}>
      <SectionTitle eyebrow="Security & Privacy" title="Consent-led settings" />
      {privacySettings.map((setting) => (
        <Card key={setting} title={setting}>
          <Text style={styles.body}>Make access clear, reversible, and easy to review.</Text>
        </Card>
      ))}
    </View>
  );
}

function ScheduleList() {
  return (
    <View style={styles.stack}>
      {calendarItems.map((item) => (
        <Card key={`${item.title}-${item.time}`} title={item.title}>
          <SummaryRow label="When" value={item.time} tone={toneForStatus(item.tone)} />
        </Card>
      ))}
    </View>
  );
}

function ReminderRow({ item }: { item: ReminderItem }) {
  return (
    <Card title={item.title}>
      <Text style={styles.body}>{item.detail}</Text>
      <Pill tone={toneForStatus(item.status)}>{labelForStatus(item.status)}</Pill>
    </Card>
  );
}

function SummaryRow({ label, tone, value }: { label: string; value: string; tone: "blue" | "danger" | "neutral" | "warning" }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Pill tone={tone}>{value}</Pill>
    </View>
  );
}

function toneForStatus(status: ReminderItem["status"]) {
  if (status === "urgent") return "danger";
  if (status === "important") return "warning";
  return "neutral";
}

function labelForStatus(status: ReminderItem["status"]) {
  if (status === "urgent") return "Important";
  if (status === "important") return "Review";
  return "Optional";
}

const styles = StyleSheet.create({
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  aiAction: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: "rgba(10,132,255,0.10)",
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  aiActionText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "800"
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22
  },
  compactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  compactIcon: {
    color: colors.primaryBlue,
    fontSize: typography.caption,
    fontWeight: "900"
  },
  compactTile: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  compactTitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "800"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  lead: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 25
  },
  listBullet: {
    color: colors.ptsdGreen,
    fontWeight: "900"
  },
  listGrid: {
    gap: spacing.sm
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  listText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: typography.small,
    lineHeight: 21
  },
  moduleIcon: {
    color: colors.accentBlue,
    fontSize: typography.h2,
    fontWeight: "900"
  },
  moduleSummary: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 17
  },
  moduleTile: {
    width: "48%",
    minHeight: 150,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    gap: spacing.sm,
    padding: spacing.md
  },
  moduleTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "800"
  },
  pressed: {
    opacity: 0.76
  },
  stack: {
    gap: spacing.md
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "700"
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  }
});
