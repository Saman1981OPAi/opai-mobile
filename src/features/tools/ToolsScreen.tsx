import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { CalculatorScreen } from "@/features/calculator/CalculatorScreen";
import { ChecklistLibraryScreen } from "@/features/checklists/ChecklistLibraryScreen";
import { DescriptionBuilderScreen } from "@/features/descriptions/DescriptionBuilderScreen";
import { notebookRepository } from "@/features/notebook/notebookRepository";
import type { ShiftNotebookEntry } from "@/features/notebook/notebookTypes";
import { ShiftNotebookScreen } from "@/features/notebook/ShiftNotebookScreen";
import { PhoneticScreen } from "@/features/phonetic/PhoneticScreen";
import { appendToolTextToReport, createReportFromToolText } from "@/features/reports/reportHandoff";
import { TimelineBuilderScreen } from "@/features/timeline/TimelineBuilderScreen";
import type { LocalAppData } from "@/storage/storageTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import type { ModuleId } from "@/types/navigation";
import { toolsRegistry } from "./toolsRegistry";
import type { ToolId } from "./toolsTypes";

export function ToolsScreen({ localData, onSelectModule, onUpdateLocalData, userId }: {
  localData: LocalAppData;
  onSelectModule: (module: ModuleId) => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  userId: string;
}) {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const back = () => setActiveTool(null);
  const createReport = (text: string, source: string) => onUpdateLocalData((current) => ({ ...current, incidentDrafts: [createReportFromToolText(text, source), ...current.incidentDrafts], updatedAt: new Date().toISOString() }));
  const appendReport = (text: string) => onUpdateLocalData((current) => {
    const latest = current.incidentDrafts[0];
    if (!latest) return current;
    return { ...current, incidentDrafts: [appendToolTextToReport(latest, text), ...current.incidentDrafts.slice(1)], updatedAt: new Date().toISOString() };
  });
  const insertNotebook = (text: string) => {
    const now = new Date().toISOString();
    const entry: ShiftNotebookEntry = { archivedAt: null, attachmentIds: [], body: text, createdAt: now, followUp: false, id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, retention: "30-days", title: "Description", updatedAt: now };
    void notebookRepository.upsert(userId, entry);
  };

  if (activeTool === "notebook") return <ShiftNotebookScreen hasReport={localData.incidentDrafts.length > 0} onAppendReport={appendReport} onBack={back} onCreateReport={createReport} userId={userId} />;
  if (activeTool === "timeline") return <TimelineBuilderScreen hasReport={localData.incidentDrafts.length > 0} onAppendReport={appendReport} onBack={back} onCreateReport={createReport} userId={userId} />;
  if (activeTool === "descriptions") return <DescriptionBuilderScreen hasReport={localData.incidentDrafts.length > 0} onAppendReport={appendReport} onBack={back} onCreateReport={createReport} onInsertNotebook={insertNotebook} userId={userId} />;
  if (activeTool === "phonetic") return <PhoneticScreen onBack={back} />;
  if (activeTool === "calculator") return <CalculatorScreen onBack={back} />;
  if (activeTool === "checklists") return <ChecklistLibraryScreen onBack={back} onNotebook={insertNotebook} userId={userId} />;

  return <View style={styles.page}>
    <View style={styles.header}><Text accessibilityRole="header" style={styles.title}>Tools</Text><Text style={styles.subtitle}>Offline-first daily utilities</Text></View>
    <FlatList contentContainerStyle={styles.list} data={toolsRegistry} keyExtractor={(item) => item.id} numColumns={2} columnWrapperStyle={styles.columns} renderItem={({ item }) => <Pressable accessibilityLabel={`Open ${item.label}`} accessibilityRole="button" onPress={() => item.id === "calendar" ? onSelectModule("calendar") : setActiveTool(item.id)} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}><View style={styles.icon}><MaterialCommunityIcons color={item.id === "checklists" ? colors.warning : colors.primaryBlue} name={item.icon} size={32} /></View><Text numberOfLines={2} style={styles.cardTitle}>{item.label}</Text><Text numberOfLines={2} style={styles.cardSummary}>{item.summary}</Text></Pressable>} ListFooterComponent={<Text style={styles.footer}>Operational content stays local and protected. Nothing is sent unless you explicitly choose an approved server action.</Text>} />
  </View>;
}

const styles = StyleSheet.create({ card: { backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, flex: 1, gap: spacing.sm, minHeight: 156, padding: spacing.md }, cardSummary: { color: colors.textMuted, fontSize: typography.small, lineHeight: 20 }, cardTitle: { color: colors.textPrimary, fontSize: typography.body, fontWeight: "700", minHeight: 46 }, columns: { gap: spacing.sm }, footer: { color: colors.textMuted, fontSize: typography.small, lineHeight: 21, padding: spacing.md, textAlign: "center" }, header: { paddingHorizontal: spacing.md, paddingTop: spacing.lg }, icon: { alignItems: "center", backgroundColor: "rgba(10,132,255,0.10)", borderRadius: radius.md, height: 52, justifyContent: "center", width: 52 }, list: { gap: spacing.sm, padding: spacing.md, paddingBottom: 120 }, page: { backgroundColor: colors.background, flex: 1 }, pressed: { opacity: 0.75 }, subtitle: { color: colors.textMuted, fontSize: typography.body, marginTop: spacing.xs }, title: { color: colors.textPrimary, fontSize: 34, fontWeight: "700" } });
