import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CanvassSessionScreen } from "@/features/canvass/CanvassSessionScreen";
import { canvassRepository } from "@/features/canvass/canvassRepository";
import type { CanvassEntry, CanvassSession } from "@/features/canvass/canvassTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function CanvassListScreen({ entries, onChangeEntries, onChangeSessions, sessions }: { entries: CanvassEntry[]; onChangeEntries: (entries: CanvassEntry[]) => void; onChangeSessions: (sessions: CanvassSession[]) => void; sessions: CanvassSession[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const selected = sessions.find((session) => session.id === selectedId);

  if (selected) return <CanvassSessionScreen entries={entries.filter((entry) => entry.sessionId === selected.id)} onBack={() => setSelectedId(null)} onChangeEntries={(sessionEntries) => onChangeEntries([...entries.filter((entry) => entry.sessionId !== selected.id), ...sessionEntries])} onChangeSession={(session) => onChangeSessions(sessions.map((item) => item.id === session.id ? session : item))} onDeleteSession={() => { onChangeEntries(entries.filter((entry) => entry.sessionId !== selected.id)); onChangeSessions(sessions.filter((item) => item.id !== selected.id)); setSelectedId(null); }} session={selected} />;

  const create = () => {
    try {
      const session = canvassRepository.createSession({ title, ...(area.trim() ? { generalArea: area.trim() } : {}) });
      onChangeSessions([session, ...sessions]);
      setCreating(false); setTitle(""); setArea(""); setSelectedId(session.id);
    } catch (error) { Alert.alert("Canvass", error instanceof Error ? error.message : "The canvass could not be started."); }
  };

  return <View style={styles.wrap}>
    <View style={styles.hero}><View style={styles.heroIcon}><MaterialCommunityIcons name="home-search-outline" size={34} color={colors.primaryBlue} /></View><View style={styles.grow}><Text style={styles.title}>Canvass</Text><Text style={styles.subtitle}>Local reference notes</Text></View></View>
    {!creating ? <PrimaryButton label="Start canvass" onPress={() => setCreating(true)}><MaterialCommunityIcons name="plus" size={22} color={colors.textPrimary} /></PrimaryButton> : <View style={styles.panel}><SectionHeader icon="map-search-outline" title="Start Canvass" /><TextInput accessibilityLabel="Canvass title" onChangeText={setTitle} placeholder="Title" placeholderTextColor={colors.textMuted} style={styles.input} value={title} /><TextInput accessibilityLabel="General area" onChangeText={setArea} placeholder="General area (optional)" placeholderTextColor={colors.textMuted} style={styles.input} value={area} /><View style={styles.actions}><PrimaryButton label="Start" onPress={create}><MaterialCommunityIcons name="play" size={20} color={colors.textPrimary} /></PrimaryButton><SecondaryButton label="Cancel" onPress={() => setCreating(false)}><MaterialCommunityIcons name="close" size={20} color={colors.primaryBlue} /></SecondaryButton></View></View>}
    <SectionHeader action={`${sessions.length}`} icon="clipboard-list-outline" title="Sessions" />
    {sessions.length === 0 ? <EmptyState actionLabel="Start Canvass" icon="home-search-outline" onAction={() => setCreating(true)} title="No canvass sessions" message="Start a session to keep local reference notes." /> : <View style={styles.list}>{[...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).map((session) => { const count = entries.filter((entry) => entry.sessionId === session.id).length; return <Pressable accessibilityRole="button" key={session.id} onPress={() => setSelectedId(session.id)} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}><MaterialCommunityIcons name="map-search-outline" size={25} color={colors.primaryBlue} /><View style={styles.grow}><Text numberOfLines={1} style={styles.cardTitle}>{session.title}</Text><Text style={styles.cardMeta}>{count} entr{count === 1 ? "y" : "ies"} | {session.completedAt ? "Completed" : "Active"}</Text></View><MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} /></Pressable>; })}</View>}
    <DisclaimerBanner message="Canvass data stays on this device. OPAi does not request location permission, track movement, geocode addresses, or send Canvass content to AI or the backend." />
  </View>;
}

const styles = StyleSheet.create({ actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, card: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.sm, minHeight: 76, padding: spacing.md }, cardMeta: { color: colors.textMuted, fontSize: typography.caption, marginTop: spacing.xs }, cardTitle: { color: colors.textPrimary, fontSize: typography.h3, fontWeight: "700" }, grow: { flex: 1, minWidth: 0 }, hero: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.25)", borderRadius: radius.xl, borderWidth: 1, flexDirection: "row", gap: spacing.md, padding: spacing.md }, heroIcon: { alignItems: "center", borderColor: colors.primaryBlue, borderRadius: radius.lg, borderWidth: 1, height: 60, justifyContent: "center", width: 60 }, input: { backgroundColor: "rgba(0,0,0,0.24)", borderColor: "rgba(77,163,255,0.28)", borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, fontSize: typography.body, minHeight: 48, paddingHorizontal: spacing.md }, list: { gap: spacing.sm }, panel: { backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.md }, pressed: { opacity: 0.74 }, subtitle: { color: colors.textMuted, fontSize: typography.small, marginTop: spacing.xs }, title: { color: colors.textPrimary, fontSize: typography.h1, fontWeight: "700" }, wrap: { gap: spacing.md } });
