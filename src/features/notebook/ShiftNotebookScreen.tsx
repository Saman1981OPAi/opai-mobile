import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";
import { AppInputText as TextInput, AppText as Text } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { ToolScreenFrame } from "@/features/tools/ToolScreenFrame";
import { AudioStatementPlaybackControls } from "@/features/audioStatement/AudioStatementPlaybackControls";
import { AudioStatementRecorderScreen } from "@/features/audioStatement/AudioStatementRecorderScreen";
import { audioStatementService } from "@/features/audioStatement/audioStatementService";
import { attachmentVault } from "@/storage/attachments/attachmentVault";
import { attachmentMetadataRepository } from "@/storage/attachments/attachmentMetadataRepository";
import type { ProtectedAttachmentMetadata } from "@/storage/attachments/attachmentTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import { notebookRepository } from "./notebookRepository";
import { searchNotebook } from "./notebookSearch";
import type { NotebookRetention, ShiftNotebookEntry } from "./notebookTypes";

function newEntry(): ShiftNotebookEntry {
  const now = new Date().toISOString();
  return { archivedAt: null, attachmentIds: [], body: "", createdAt: now, followUp: false, id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, retention: "30-days", title: "", updatedAt: now };
}

export function ShiftNotebookScreen({ hasReport, onAppendReport, onBack, onCreateReport, userId }: {
  hasReport: boolean;
  onAppendReport: (text: string) => void;
  onBack: () => void;
  onCreateReport: (text: string, source: string) => void;
  userId: string;
}) {
  const [entries, setEntries] = useState<ShiftNotebookEntry[]>([]);
  const [editing, setEditing] = useState<ShiftNotebookEntry | null>(null);
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [attachments, setAttachments] = useState<ProtectedAttachmentMetadata[]>([]);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [playbackUri, setPlaybackUri] = useState<string | null>(null);
  const [pendingTranscript, setPendingTranscript] = useState("");
  const [transcribingId, setTranscribingId] = useState<string | null>(null);
  const hydrated = useRef(false);
  const entriesRef = useRef<ShiftNotebookEntry[]>([]);
  const transcriptionController = useRef<AbortController | null>(null);

  useEffect(() => { entriesRef.current = entries; }, [entries]);

  useEffect(() => {
    let active = true;
    void Promise.all([notebookRepository.list(userId), attachmentMetadataRepository.list(userId)]).then(([items, metadata]) => {
      if (active) {
        entriesRef.current = items;
        setEntries(items);
        setAttachments(metadata);
        hydrated.current = true;
        void attachmentVault.cleanupOrphans(userId, items.flatMap((item) => item.attachmentIds)).catch(() => undefined);
      }
    }).catch(() => setSaveState("error"));
    return () => { active = false; };
  }, [userId]);

  useEffect(() => () => { if (playbackUri) void attachmentVault.deleteTemporaryCopy(playbackUri); }, [playbackUri]);
  useEffect(() => () => { transcriptionController.current?.abort(); }, []);

  const persistEntry = useCallback(async (entry: ShiftNotebookEntry) => {
    const next = [entry, ...entriesRef.current.filter((item) => item.id !== entry.id)];
    await notebookRepository.save(userId, next);
    entriesRef.current = next;
    setEntries(next);
    setSaveState("saved");
  }, [userId]);

  useEffect(() => {
    if (!editing || !hydrated.current) return;
    setSaveState("saving");
    const timer = setTimeout(() => {
      void persistEntry(editing).catch(() => setSaveState("error"));
    }, 650);
    return () => clearTimeout(timer);
  }, [editing, persistEntry]);

  const visible = useMemo(() => searchNotebook(entries, query, showArchived), [entries, query, showArchived]);

  const update = (changes: Partial<ShiftNotebookEntry>) => setEditing((current) => current ? { ...current, ...changes, updatedAt: new Date().toISOString() } : current);
  const closeEditor = async () => {
    if (editing && hydrated.current) {
      setSaveState("saving");
      try { await persistEntry(editing); } catch { setSaveState("error"); return; }
    }
    setEditing(null);
  };

  const addPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Photos not enabled", "Enable photo access in device Settings to attach a selected image."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, exif: false, mediaTypes: ["images"], quality: 0.88 });
    const asset = result.assets?.[0];
    if (result.canceled || !asset || !editing) return;
    try {
      const extension = asset.fileName?.split(".").pop();
      const metadata = await attachmentVault.import(userId, { ...(extension ? { extension } : {}), mediaType: "image", mimeType: asset.mimeType ?? "image/jpeg", sourceUri: asset.uri });
      update({ attachmentIds: [...editing.attachmentIds, metadata.id] });
    } catch (error) {
      Alert.alert("Photo not attached", error instanceof Error ? error.message : "The selected photo could not be protected.");
    }
  };

  const remove = () => {
    if (!editing) return;
    Alert.alert("Delete note?", "This removes the protected note and its local attachments.", [
      { style: "cancel", text: "Cancel" },
      { style: "destructive", text: "Delete", onPress: () => void (async () => {
        await Promise.all(editing.attachmentIds.map((id) => attachmentVault.delete(userId, id).catch(() => undefined)));
        await notebookRepository.remove(userId, editing.id);
        setEntries((current) => current.filter((entry) => entry.id !== editing.id));
        setEditing(null);
      })() }
    ]);
  };

  const removeAttachment = async (id: string) => {
    await attachmentVault.delete(userId, id);
    setAttachments((current) => current.filter((item) => item.id !== id));
    if (editing) update({ attachmentIds: editing.attachmentIds.filter((item) => item !== id) });
  };

  const replay = async (metadata: ProtectedAttachmentMetadata) => {
    if (playbackUri) await attachmentVault.deleteTemporaryCopy(playbackUri);
    setPlaybackUri(await attachmentVault.createTemporaryCopy(userId, metadata));
  };

  const transcribe = async (metadata: ProtectedAttachmentMetadata) => {
    transcriptionController.current?.abort();
    const controller = new AbortController();
    transcriptionController.current = controller;
    setTranscribingId(metadata.id);
    const pending = { ...metadata, transcriptionState: "pending" as const, updatedAt: new Date().toISOString() };
    try {
      await attachmentMetadataRepository.upsert(userId, pending);
      setAttachments((current) => [pending, ...current.filter((item) => item.id !== pending.id)]);
      const result = await attachmentVault.withTemporaryCopy(userId, metadata, (localUri) => audioStatementService.transcribe({
        createdAt: metadata.createdAt,
        durationSeconds: metadata.durationSeconds ?? 0.1,
        fileSizeBytes: metadata.sizeBytes,
        id: metadata.id,
        localUri,
        mimeType: metadata.mimeType,
        title: "Shift Notebook audio",
        transcriptionRequestKey: `${metadata.id}-${Date.now()}`,
        transcriptionStatus: "notRequested",
        updatedAt: metadata.updatedAt
      }, undefined, controller.signal));
      setPendingTranscript(result.transcript);
      const updated = { ...metadata, transcriptionState: "completed" as const, updatedAt: new Date().toISOString() };
      await attachmentMetadataRepository.upsert(userId, updated);
      setAttachments((current) => [updated, ...current.filter((item) => item.id !== updated.id)]);
    } catch (error) {
      const updated = { ...metadata, transcriptionState: "failed" as const, updatedAt: new Date().toISOString() };
      await attachmentMetadataRepository.upsert(userId, updated).catch(() => undefined);
      setAttachments((current) => [updated, ...current.filter((item) => item.id !== updated.id)]);
      Alert.alert("Transcription unavailable", error instanceof Error ? error.message : "Try again later. The protected recording remains available.");
    } finally {
      if (transcriptionController.current === controller) transcriptionController.current = null;
      setTranscribingId(null);
    }
  };

  if (recordingAudio && editing) {
    return <ToolScreenFrame onBack={() => setRecordingAudio(false)} subtitle="Saved to the encrypted attachment vault" title="Notebook Audio"><View style={styles.recorder}><AudioStatementRecorderScreen onCancel={() => setRecordingAudio(false)} onSave={async (recording) => {
      const metadata = await attachmentVault.import(userId, { deleteSourceAfterImport: true, durationSeconds: recording.durationSeconds, extension: recording.mimeType === "audio/webm" ? "webm" : "mp4", mediaType: "audio", mimeType: recording.mimeType, sourceUri: recording.localUri });
      setAttachments((current) => [metadata, ...current]);
      update({ attachmentIds: [...editing.attachmentIds, metadata.id] });
      setRecordingAudio(false);
    }} /></View></ToolScreenFrame>;
  }

  if (editing) {
    return (
      <ToolScreenFrame onBack={() => void closeEditor()} subtitle={saveState === "error" ? "Save failed - note remains open" : saveState === "saving" ? "Saving locally..." : "Saved locally and protected"} title="Shift Notebook">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.editor}>
          <TextInput accessibilityLabel="Note title" maxLength={120} onChangeText={(title) => update({ title })} placeholder="Title (optional)" placeholderTextColor={colors.textSubtle} style={styles.titleInput} value={editing.title} />
          <TextInput accessibilityLabel="Shift note" multiline onChangeText={(body) => update({ body })} placeholder="Type or use device dictation..." placeholderTextColor={colors.textSubtle} scrollEnabled style={styles.bodyInput} textAlignVertical="top" value={editing.body} />
          <View style={styles.actions}>
            <SecondaryButton label="Time" onPress={() => update({ body: `${editing.body}${editing.body ? "\n" : ""}[${new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" })}] ` })}><MaterialCommunityIcons color={colors.primaryBlue} name="clock-plus-outline" size={20} /></SecondaryButton>
            <SecondaryButton label="Photo" onPress={() => void addPhoto()}><MaterialCommunityIcons color={colors.primaryBlue} name="image-plus" size={20} /></SecondaryButton>
            <SecondaryButton label="Audio" onPress={() => setRecordingAudio(true)}><MaterialCommunityIcons color={colors.primaryBlue} name="microphone-outline" size={20} /></SecondaryButton>
            <SecondaryButton label={editing.followUp ? "Follow-up On" : "Follow-up"} onPress={() => update({ followUp: !editing.followUp })}><MaterialCommunityIcons color={colors.primaryBlue} name="flag-outline" size={20} /></SecondaryButton>
            <SecondaryButton label="Copy" onPress={() => void Clipboard.setStringAsync(editing.body)}><MaterialCommunityIcons color={colors.primaryBlue} name="content-copy" size={20} /></SecondaryButton>
          </View>
          <View style={styles.actions}>
            {(["7-days", "30-days", "until-deleted"] as NotebookRetention[]).map((retention) => <SecondaryButton key={retention} label={retention === "until-deleted" ? "Keep" : retention.replace("-", " ")} onPress={() => update({ retention })} />)}
          </View>
          <Text style={styles.meta}>{editing.attachmentIds.length} protected attachment(s) | Retention: {editing.retention.replaceAll("-", " ")}</Text>
          {attachments.filter((item) => editing.attachmentIds.includes(item.id)).map((metadata) => <View key={metadata.id} style={styles.attachmentRow}><MaterialCommunityIcons color={colors.primaryBlue} name={metadata.mediaType === "audio" ? "microphone" : "image-outline"} size={22} /><Text style={styles.attachmentLabel}>{metadata.mediaType === "audio" ? "Protected audio" : "Protected photo"}</Text>{metadata.mediaType === "audio" ? <><SecondaryButton label="Replay" onPress={() => void replay(metadata)} /><SecondaryButton label={metadata.transcriptionState === "failed" ? "Retry" : "Transcribe"} loading={transcribingId === metadata.id} onPress={() => void transcribe(metadata)} /></> : null}<Pressable accessibilityLabel="Delete attachment" accessibilityRole="button" hitSlop={8} onPress={() => void removeAttachment(metadata.id)}><MaterialCommunityIcons color={colors.danger} name="delete-outline" size={24} /></Pressable></View>)}
          {playbackUri ? <AudioStatementPlaybackControls localUri={playbackUri} /> : null}
          {pendingTranscript ? <View style={styles.transcriptPanel}><Text style={styles.cardTitle}>Review transcript</Text><Text selectable style={styles.cardBody}>{pendingTranscript}</Text><View style={styles.actions}><PrimaryButton label="Append" onPress={() => { update({ body: `${editing.body}${editing.body ? "\n" : ""}${pendingTranscript}` }); setPendingTranscript(""); }} /><SecondaryButton label="Replace" onPress={() => Alert.alert("Replace note text?", "The current typed text will be replaced. The protected recording remains.", [{ text: "Cancel", style: "cancel" }, { text: "Replace", style: "destructive", onPress: () => { update({ body: pendingTranscript }); setPendingTranscript(""); } }])} /><SecondaryButton label="Cancel" onPress={() => setPendingTranscript("")} /></View></View> : null}
          <PrimaryButton disabled={!editing.body.trim()} label="Create Report" onPress={() => { onCreateReport(editing.body.trim(), "Shift Notebook"); Alert.alert("Report created", "A new protected Report Writing draft was created. The notebook original was preserved."); }}><MaterialCommunityIcons color={colors.textPrimary} name="file-document-plus-outline" size={21} /></PrimaryButton>
          <SecondaryButton disabled={!editing.body.trim() || !hasReport} label="Append Latest Report" onPress={() => { onAppendReport(editing.body.trim()); Alert.alert("Report updated", "The note was appended to the latest protected report. Both originals were preserved."); }} />
          <View style={styles.actions}>
            <SecondaryButton label={editing.archivedAt ? "Restore" : "Archive"} onPress={() => update({ archivedAt: editing.archivedAt ? null : new Date().toISOString() })} />
            <SecondaryButton label="Delete" onPress={remove}><MaterialCommunityIcons color={colors.danger} name="delete-outline" size={20} /></SecondaryButton>
          </View>
        </KeyboardAvoidingView>
      </ToolScreenFrame>
    );
  }

  return (
    <ToolScreenFrame onBack={onBack} subtitle="Protected, local, and offline" title="Shift Notebook">
      <View style={styles.listControls}>
        <TextInput accessibilityLabel="Search Shift Notebook" onChangeText={setQuery} placeholder="Search notes" placeholderTextColor={colors.textSubtle} style={styles.search} value={query} />
        <PrimaryButton label="New Note" onPress={() => setEditing(newEntry())}><MaterialCommunityIcons color={colors.textPrimary} name="plus" size={22} /></PrimaryButton>
        <SecondaryButton label={showArchived ? "Active" : "Archived"} onPress={() => setShowArchived((value) => !value)} />
      </View>
      <FlatList contentContainerStyle={styles.list} data={visible} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled" renderItem={({ item }) => (
        <Pressable accessibilityLabel={`Open ${item.title || "untitled note"}`} accessibilityRole="button" onPress={() => setEditing(item)} style={styles.card}>
          <View style={{ flex: 1 }}><Text numberOfLines={1} style={styles.cardTitle}>{item.title || "Untitled note"}</Text><Text numberOfLines={2} style={styles.cardBody}>{item.body || "Empty note"}</Text></View>
          {item.followUp ? <MaterialCommunityIcons color={colors.warning} name="flag" size={22} /> : null}
          <MaterialCommunityIcons color={colors.primaryBlue} name="chevron-right" size={24} />
        </Pressable>
      )} ListEmptyComponent={<Text style={styles.empty}>No notes in this view.</Text>} />
    </ToolScreenFrame>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  bodyInput: { backgroundColor: colors.panel, borderColor: colors.borderStrong, borderRadius: radius.lg, borderWidth: 1, color: colors.textPrimary, flex: 1, fontSize: typography.body, lineHeight: 26, minHeight: 240, padding: spacing.md },
  card: { alignItems: "center", backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.base, minHeight: 82, padding: spacing.md },
  cardBody: { color: colors.textMuted, fontSize: typography.small, marginTop: spacing.xs },
  cardTitle: { color: colors.textPrimary, fontSize: typography.body, fontWeight: "700" },
  editor: { flex: 1, gap: spacing.base, padding: spacing.md },
  empty: { color: colors.textMuted, padding: spacing.xl, textAlign: "center" },
  list: { gap: spacing.sm, padding: spacing.md },
  listControls: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, padding: spacing.md },
  meta: { color: colors.textMuted, fontSize: typography.small },
  attachmentLabel: { color: colors.textSecondary, flex: 1, fontSize: typography.small, fontWeight: "700" },
  attachmentRow: { alignItems: "center", backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, padding: spacing.sm },
  recorder: { flex: 1, padding: spacing.md },
  search: { backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, color: colors.textPrimary, flexGrow: 1, minHeight: 50, minWidth: 180, paddingHorizontal: spacing.md },
  titleInput: { backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, color: colors.textPrimary, fontSize: typography.h3, fontWeight: "700", minHeight: 54, paddingHorizontal: spacing.md },
  transcriptPanel: { backgroundColor: "rgba(10,132,255,0.12)", borderColor: colors.primaryBlue, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.md }
});
