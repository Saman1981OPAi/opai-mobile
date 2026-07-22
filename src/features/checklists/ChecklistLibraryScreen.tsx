import { useEffect, useMemo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { AppInputText as TextInput, AppText as Text } from "@/components/ui/Typography";
import { ToolScreenFrame } from "@/features/tools/ToolScreenFrame";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import { ChecklistDetailScreen } from "./ChecklistDetailScreen";
import { demonstrationChecklists } from "./checklistLibrary";
import { checklistRepository } from "./checklistRepository";
import type { ChecklistDefinition, ChecklistInstance } from "./checklistTypes";
import { checklistDisplayStatus } from "./checklistValidation";

function createInstance(definition: ChecklistDefinition): ChecklistInstance { const now = new Date().toISOString(); return { archivedAt: null, checklistDefinitionId: definition.id, completedAt: null, createdAt: now, id: `checklist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, notes: "", revision: 1, selectedItems: [], updatedAt: now }; }

export function ChecklistLibraryScreen({ onBack, onNotebook, userId }: { onBack: () => void; onNotebook: (text: string) => void; userId: string }) {
  const [instances, setInstances] = useState<ChecklistInstance[]>([]);
  const [selected, setSelected] = useState<ChecklistDefinition | null>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => { let active = true; void checklistRepository.list(userId).then((items) => { if (active) setInstances(items); }); return () => { active = false; }; }, [userId]);
  const definitions = useMemo(() => demonstrationChecklists.filter((item) => `${item.title} ${item.jurisdiction}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const instance = selected ? instances.find((item) => item.id === selectedInstanceId) ?? instances.find((item) => item.checklistDefinitionId === selected.id && !item.archivedAt) ?? createInstance(selected) : null;
  const change = (next: ChecklistInstance) => { setInstances((current) => [next, ...current.filter((item) => item.id !== next.id)]); void checklistRepository.upsert(userId, next); };
  const close = () => { setSelected(null); setSelectedInstanceId(null); };
  if (selected && instance) return <ChecklistDetailScreen definition={selected} instance={instance} onArchive={(next) => { change(next); close(); }} onBack={close} onChange={change} onDuplicate={(next) => { change(next); setSelectedInstanceId(next.id); }} onNotebook={onNotebook} />;
  return <ToolScreenFrame onBack={onBack} subtitle="Framework with demonstration content only" title="Checklists"><View style={styles.searchWrap}><TextInput accessibilityLabel="Search checklists" onChangeText={setQuery} placeholder="Search checklists" placeholderTextColor={colors.textSubtle} style={styles.search} value={query} /></View><FlatList contentContainerStyle={styles.list} data={definitions} keyExtractor={(item) => item.id} renderItem={({ item }) => <Pressable accessibilityLabel={`Open ${item.title}`} accessibilityRole="button" onPress={() => { setSelected(item); setSelectedInstanceId(null); }} style={styles.card}><MaterialCommunityIcons color={colors.warning} name="clipboard-text-outline" size={30} /><View style={{ flex: 1 }}><Text style={styles.title}>{item.title}</Text><Text style={styles.status}>{checklistDisplayStatus(item)} | {item.version}</Text><Text style={styles.source}>{item.source}</Text></View><MaterialCommunityIcons color={colors.primaryBlue} name="chevron-right" size={24} /></Pressable>} /></ToolScreenFrame>;
}

const styles = StyleSheet.create({ card: { alignItems: "center", backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.base, padding: spacing.md }, list: { gap: spacing.sm, padding: spacing.md }, search: { backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, color: colors.textPrimary, minHeight: 52, paddingHorizontal: spacing.md }, searchWrap: { padding: spacing.md }, source: { color: colors.warning, fontSize: typography.caption, marginTop: spacing.xs }, status: { color: colors.textMuted, fontSize: typography.small, marginTop: spacing.xs }, title: { color: colors.textPrimary, fontSize: typography.body, fontWeight: "700" } });
