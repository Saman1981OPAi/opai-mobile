import { useEffect, useMemo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { AppInputText as TextInput, AppText as Text } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { ToolScreenFrame } from "@/features/tools/ToolScreenFrame";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import { duplicateTimelineTimes, sortTimelineEvents, timelineToText } from "./timelineCore";
import { timelineRepository } from "./timelineRepository";
import type { OperationalTimeline, TimelineEvent, TimelineTimeKind } from "./timelineTypes";

function today() { return new Date().toISOString().slice(0, 10); }
function currentTime() { return new Date().toLocaleTimeString("en-CA", { hour: "2-digit", hour12: false, minute: "2-digit" }); }
function newTimeline(): OperationalTimeline { const now = new Date().toISOString(); return { archivedAt: null, createdAt: now, events: [], id: `timeline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: "", updatedAt: now }; }
function newEvent(order: number): TimelineEvent { return { date: today(), description: "", id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, order, time: currentTime(), timeKind: "exact" }; }

export function TimelineBuilderScreen({ hasReport, onAppendReport, onBack, onCreateReport, userId }: { hasReport: boolean; onAppendReport: (text: string) => void; onBack: () => void; onCreateReport: (text: string, source: string) => void; userId: string }) {
  const [timelines, setTimelines] = useState<OperationalTimeline[]>([]);
  const [editing, setEditing] = useState<OperationalTimeline | null>(null);
  const [eventDraft, setEventDraft] = useState<TimelineEvent>(() => newEvent(0));
  const [query, setQuery] = useState("");

  useEffect(() => { let active = true; void timelineRepository.list(userId).then((items) => { if (active) setTimelines(items); }); return () => { active = false; }; }, [userId]);
  const duplicates = useMemo(() => duplicateTimelineTimes(editing?.events ?? []), [editing?.events]);
  const visible = useMemo(() => timelines.filter((item) => `${item.title} ${item.events.map((event) => event.description).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [query, timelines]);

  const save = async (timeline: OperationalTimeline) => {
    const next = { ...timeline, events: sortTimelineEvents(timeline.events), updatedAt: new Date().toISOString() };
    await timelineRepository.upsert(userId, next);
    setTimelines((current) => [next, ...current.filter((item) => item.id !== next.id)]);
    setEditing(next);
  };

  const addEvent = () => {
    if (!editing || !eventDraft.description.trim()) return;
    const next = { ...editing, events: [...editing.events, { ...eventDraft, description: eventDraft.description.trim(), order: editing.events.length }] };
    void save(next);
    setEventDraft(newEvent(next.events.length));
  };

  if (editing) {
    const output = timelineToText(editing.title || "Timeline", editing.events);
    return (
      <ToolScreenFrame onBack={() => setEditing(null)} subtitle="Protected and ordered locally" title="Timeline">
        <View style={styles.editorHeader}>
          <TextInput accessibilityLabel="Timeline title" onChangeText={(title) => setEditing({ ...editing, title })} onEndEditing={() => void save(editing)} placeholder="Timeline title" placeholderTextColor={colors.textSubtle} style={styles.input} value={editing.title} />
          <View style={styles.row}>
            <SecondaryButton label="Copy" onPress={() => void Clipboard.setStringAsync(output)}><MaterialCommunityIcons color={colors.primaryBlue} name="content-copy" size={20} /></SecondaryButton>
            <PrimaryButton disabled={editing.events.length === 0} label="Create Report" onPress={() => { onCreateReport(output, "Timeline"); Alert.alert("Report created", "The timeline was copied into a new protected draft. Original events were preserved."); }} />
            <SecondaryButton disabled={editing.events.length === 0 || !hasReport} label="Append Latest" onPress={() => { onAppendReport(output); Alert.alert("Report updated", "The timeline was appended to the latest protected report. Original events were preserved."); }} />
          </View>
          <View style={styles.eventEditor}>
            <View style={styles.row}>
              <TextInput accessibilityLabel="Event date" onChangeText={(date) => setEventDraft({ ...eventDraft, date })} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textSubtle} style={styles.compactInput} value={eventDraft.date} />
              <TextInput accessibilityLabel="Event time" editable={eventDraft.timeKind !== "unknown"} onChangeText={(time) => setEventDraft({ ...eventDraft, time })} placeholder="HH:MM" placeholderTextColor={colors.textSubtle} style={styles.compactInput} value={eventDraft.time} />
              <SecondaryButton label="Now" onPress={() => setEventDraft({ ...eventDraft, date: today(), time: currentTime(), timeKind: "exact" })} />
            </View>
            <View style={styles.row}>{(["exact", "approximate", "unknown"] as TimelineTimeKind[]).map((kind) => <SecondaryButton key={kind} label={kind === "approximate" ? "Approx." : kind[0]!.toUpperCase() + kind.slice(1)} onPress={() => setEventDraft({ ...eventDraft, timeKind: kind })} />)}</View>
            <TextInput accessibilityLabel="Timeline event description" multiline onChangeText={(description) => setEventDraft({ ...eventDraft, description })} placeholder="What happened?" placeholderTextColor={colors.textSubtle} style={[styles.input, styles.eventInput]} value={eventDraft.description} />
            <PrimaryButton disabled={!eventDraft.description.trim()} label="Add Event" onPress={addEvent}><MaterialCommunityIcons color={colors.textPrimary} name="plus" size={21} /></PrimaryButton>
          </View>
        </View>
        <FlatList contentContainerStyle={styles.list} data={sortTimelineEvents(editing.events)} keyExtractor={(item) => item.id} renderItem={({ item }) => {
          const duplicate = item.timeKind !== "unknown" && duplicates.has(`${item.date}:${item.time}`);
          return <View style={styles.card}><View style={{ flex: 1 }}><Text style={styles.time}>{item.timeKind === "unknown" ? "Time unknown" : `${item.timeKind === "approximate" ? "Approx. " : ""}${item.date} ${item.time}`}</Text><Text selectable style={styles.body}>{item.description}</Text>{duplicate ? <Text style={styles.warning}>Another event has this timestamp.</Text> : null}</View><Pressable accessibilityLabel="Delete timeline event" accessibilityRole="button" hitSlop={8} onPress={() => void save({ ...editing, events: editing.events.filter((event) => event.id !== item.id) })}><MaterialCommunityIcons color={colors.danger} name="delete-outline" size={24} /></Pressable></View>;
        }} ListEmptyComponent={<Text style={styles.empty}>Add the first event above.</Text>} />
      </ToolScreenFrame>
    );
  }

  return <ToolScreenFrame onBack={onBack} subtitle="Build a clear local sequence" title="Timeline">
    <View style={styles.listControls}><TextInput accessibilityLabel="Search timelines" onChangeText={setQuery} placeholder="Search timelines" placeholderTextColor={colors.textSubtle} style={styles.input} value={query} /><PrimaryButton label="New Timeline" onPress={() => setEditing(newTimeline())}><MaterialCommunityIcons color={colors.textPrimary} name="plus" size={21} /></PrimaryButton></View>
    <FlatList contentContainerStyle={styles.list} data={visible} keyExtractor={(item) => item.id} renderItem={({ item }) => <Pressable accessibilityLabel={`Open ${item.title || "untitled timeline"}`} accessibilityRole="button" onPress={() => setEditing(item)} style={styles.card}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{item.title || "Untitled timeline"}</Text><Text style={styles.body}>{item.events.length} event(s)</Text></View><MaterialCommunityIcons color={colors.primaryBlue} name="chevron-right" size={24} /></Pressable>} ListEmptyComponent={<Text style={styles.empty}>No timelines yet.</Text>} />
  </ToolScreenFrame>;
}

const styles = StyleSheet.create({
  body: { color: colors.textSecondary, fontSize: typography.small, lineHeight: 21 },
  card: { alignItems: "flex-start", backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.base, padding: spacing.md },
  cardTitle: { color: colors.textPrimary, fontSize: typography.body, fontWeight: "700" },
  compactInput: { backgroundColor: colors.backgroundBlue, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, flexGrow: 1, minHeight: 50, minWidth: 110, paddingHorizontal: spacing.base },
  editorHeader: { gap: spacing.base, padding: spacing.md },
  empty: { color: colors.textMuted, padding: spacing.xl, textAlign: "center" },
  eventEditor: { backgroundColor: colors.panel, borderColor: colors.borderStrong, borderRadius: radius.lg, borderWidth: 1, gap: spacing.base, padding: spacing.md },
  eventInput: { minHeight: 82, paddingTop: spacing.base, textAlignVertical: "top" },
  input: { backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, color: colors.textPrimary, flexGrow: 1, fontSize: typography.body, minHeight: 52, minWidth: 190, paddingHorizontal: spacing.md },
  list: { gap: spacing.sm, padding: spacing.md },
  listControls: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, padding: spacing.md },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  time: { color: colors.primaryBlue, fontSize: typography.small, fontWeight: "700", marginBottom: spacing.xs },
  warning: { color: colors.warning, fontSize: typography.caption, marginTop: spacing.xs }
});
