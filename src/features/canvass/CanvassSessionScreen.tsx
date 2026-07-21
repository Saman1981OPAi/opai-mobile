import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CanvassEntryDetailScreen } from "@/features/canvass/CanvassEntryDetailScreen";
import { CanvassEntryFormScreen, canvassResults } from "@/features/canvass/CanvassEntryFormScreen";
import { canvassRepository } from "@/features/canvass/canvassRepository";
import type { CanvassContactResult, CanvassEntry, CanvassEntryDraft, CanvassSession } from "@/features/canvass/canvassTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type EntryMode = "list" | "form" | "detail";

export function CanvassSessionScreen({ entries, onBack, onChangeEntries, onChangeSession, onDeleteSession, session }: { entries: CanvassEntry[]; onBack: () => void; onChangeEntries: (entries: CanvassEntry[]) => void; onChangeSession: (session: CanvassSession) => void; onDeleteSession: () => void; session: CanvassSession }) {
  const [entryMode, setEntryMode] = useState<EntryMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [resultFilter, setResultFilter] = useState<CanvassContactResult | "All">("All");
  const selected = entries.find((entry) => entry.id === selectedId);
  const filtered = useMemo(() => entries.filter((entry) => {
    const matchesQuery = `${entry.address} ${entry.unit ?? ""} ${entry.name ?? ""} ${entry.notes}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (resultFilter === "All" || entry.contactResult === resultFilter);
  }).sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`)), [entries, query, resultFilter]);

  const saveEntry = (draft: CanvassEntryDraft) => {
    const saved = selected ? canvassRepository.updateEntry(selected, draft) : canvassRepository.createEntry(draft);
    onChangeEntries(selected ? entries.map((entry) => entry.id === selected.id ? saved : entry) : [saved, ...entries]);
    setSelectedId(saved.id);
    setEntryMode("detail");
  };

  if (entryMode === "form") return <CanvassEntryFormScreen {...(selected ? { entry: selected } : {})} onCancel={() => setEntryMode(selected ? "detail" : "list")} onSave={saveEntry} sessionId={session.id} />;
  if (entryMode === "detail" && selected) return <CanvassEntryDetailScreen entry={selected} onBack={() => setEntryMode("list")} onDelete={() => { onChangeEntries(entries.filter((entry) => entry.id !== selected.id)); setSelectedId(null); setEntryMode("list"); }} onEdit={() => setEntryMode("form")} />;

  const confirmDelete = () => Alert.alert("Delete canvass?", "This removes the session and all of its local entries.", [{ style: "cancel", text: "Cancel" }, { style: "destructive", text: "Delete", onPress: onDeleteSession }]);
  return <View style={styles.wrap}>
    <View style={styles.topActions}><SecondaryButton label="Back" onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={19} color={colors.primaryBlue} /></SecondaryButton><SecondaryButton label={session.completedAt ? "Reopen" : "Complete"} onPress={() => onChangeSession(canvassRepository.setSessionCompleted(session, !session.completedAt))}><MaterialCommunityIcons name={session.completedAt ? "backup-restore" : "check-circle-outline"} size={19} color={colors.primaryBlue} /></SecondaryButton></View>
    <View style={styles.hero}><View style={styles.grow}><Text style={styles.title}>{session.title}</Text><Text style={styles.subtitle}>{session.generalArea || "Local reference session"}</Text></View><Text style={styles.status}>{session.completedAt ? "Completed" : "Active"}</Text></View>
    <PrimaryButton label="Add entry" onPress={() => { setSelectedId(null); setEntryMode("form"); }}><MaterialCommunityIcons name="home-plus-outline" size={21} color={colors.textPrimary} /></PrimaryButton>
    <TextInput accessibilityLabel="Search canvass entries" onChangeText={setQuery} placeholder="Search entries" placeholderTextColor={colors.textMuted} style={styles.search} value={query} />
    <View style={styles.filters}>{(["All", ...canvassResults] as const).map((result) => <Pressable key={result} onPress={() => setResultFilter(result)} style={[styles.filter, resultFilter === result ? styles.filterActive : null]}><Text style={styles.filterText}>{result}</Text></Pressable>)}</View>
    <SectionHeader action={`${filtered.length}`} icon="format-list-bulleted" title="Entries" />
    {filtered.length === 0 ? <EmptyState icon="home-search-outline" title="No matching entries" message="Add a local reference entry or adjust the filters." /> : <View style={styles.list}>{filtered.map((entry) => <Pressable accessibilityRole="button" key={entry.id} onPress={() => { setSelectedId(entry.id); setEntryMode("detail"); }} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}><MaterialCommunityIcons name="home-outline" size={24} color={colors.primaryBlue} /><View style={styles.grow}><Text numberOfLines={1} style={styles.cardTitle}>{entry.address}{entry.unit ? `, Unit ${entry.unit}` : ""}</Text><Text numberOfLines={1} style={styles.cardMeta}>{entry.date} | {entry.time} | {entry.contactResult || "No result"}</Text></View><MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} /></Pressable>)}</View>}
    <SecondaryButton label="Delete canvass" onPress={confirmDelete}><MaterialCommunityIcons name="delete-outline" size={19} color={colors.danger} /></SecondaryButton>
    <DisclaimerBanner message="Canvass records are personal reference notes only. They are not an official occurrence, evidence record, notebook entry, records-management system, or disclosure platform." />
  </View>;
}

const styles = StyleSheet.create({
  card: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.sm, minHeight: 72, padding: spacing.md },
  cardMeta: { color: colors.textMuted, fontSize: typography.caption, marginTop: spacing.xs },
  cardTitle: { color: colors.textPrimary, fontSize: typography.body, fontWeight: "700" },
  filter: { borderColor: "rgba(77,163,255,0.22)", borderRadius: radius.full, borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  filterActive: { backgroundColor: "rgba(10,132,255,0.18)", borderColor: colors.primaryBlue },
  filterText: { color: colors.textSecondary, fontSize: typography.caption, fontWeight: "700" },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  grow: { flex: 1, minWidth: 0 },
  hero: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.25)", borderRadius: radius.xl, borderWidth: 1, flexDirection: "row", gap: spacing.md, padding: spacing.md },
  list: { gap: spacing.sm },
  pressed: { opacity: 0.74 },
  search: { backgroundColor: "rgba(0,0,0,0.24)", borderColor: "rgba(77,163,255,0.28)", borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, fontSize: typography.body, minHeight: 48, paddingHorizontal: spacing.md },
  status: { color: colors.ptsdGreen, fontSize: typography.caption, fontWeight: "700", textTransform: "uppercase" },
  subtitle: { color: colors.textMuted, fontSize: typography.small, marginTop: spacing.xs },
  title: { color: colors.textPrimary, fontSize: typography.h2, fontWeight: "700" },
  topActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "space-between" },
  wrap: { gap: spacing.md }
});
