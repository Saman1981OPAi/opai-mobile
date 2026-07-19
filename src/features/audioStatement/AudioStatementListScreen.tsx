import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AudioStatementDetailScreen } from "@/features/audioStatement/AudioStatementDetailScreen";
import { AudioStatementRecorderScreen } from "@/features/audioStatement/AudioStatementRecorderScreen";
import { audioStatementRepository } from "@/features/audioStatement/audioStatementRepository";
import type { AudioStatement } from "@/features/audioStatement/audioStatementTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type ViewMode = "list" | "record" | "detail";

function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}

export function AudioStatementListScreen({
  onChange,
  statements
}: {
  onChange: (statements: AudioStatement[]) => void;
  statements: AudioStatement[];
}) {
  const [mode, setMode] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = statements.find((statement) => statement.id === selectedId);

  const saveRecording = async (recording: Parameters<typeof audioStatementRepository.create>[0]) => {
    const statement = await audioStatementRepository.create(recording);
    onChange([statement, ...statements]);
    setSelectedId(statement.id);
    setMode("detail");
  };

  const updateSelected = (statement: AudioStatement) => {
    onChange(statements.map((item) => (item.id === statement.id ? statement : item)));
  };

  const deleteSelected = async () => {
    if (!selected) return;
    await audioStatementRepository.delete(selected);
    onChange(statements.filter((item) => item.id !== selected.id));
    setSelectedId(null);
    setMode("list");
  };

  if (mode === "record") {
    return <AudioStatementRecorderScreen onCancel={() => setMode("list")} onSave={saveRecording} />;
  }

  if (mode === "detail" && selected) {
    return <AudioStatementDetailScreen key={selected.id} onBack={() => setMode("list")} onChange={updateSelected} onDelete={deleteSelected} statement={selected} />;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}><MaterialCommunityIcons name="microphone-outline" size={34} color={colors.primaryBlue} /></View>
        <View style={styles.grow}>
          <Text style={styles.title}>Audio Statement</Text>
          <Text style={styles.subtitle}>Record and review locally</Text>
        </View>
        <View style={styles.localBadge}><MaterialCommunityIcons name="cellphone-lock" size={15} color={colors.ptsdGreen} /><Text style={styles.localBadgeText}>Local</Text></View>
      </View>
      <PrimaryButton label="New recording" onPress={() => setMode("record")}>
        <MaterialCommunityIcons name="microphone-plus" size={22} color={colors.textPrimary} />
      </PrimaryButton>

      <SectionHeader action={`${statements.length}`} icon="playlist-music-outline" title="Recordings" />
      {statements.length === 0 ? (
        <EmptyState
          actionLabel="Record Audio Statement"
          icon="microphone-outline"
          message="Recordings you save remain on this device until you delete them or clear local data."
          onAction={() => setMode("record")}
          title="No audio statements saved"
        />
      ) : (
        <View style={styles.list}>
          {statements.map((statement) => (
            <Pressable
              accessibilityLabel={`Open ${statement.title}`}
              accessibilityRole="button"
              key={statement.id}
              onPress={() => { setSelectedId(statement.id); setMode("detail"); }}
              style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
            >
              <View style={styles.cardIcon}><MaterialCommunityIcons name="waveform" size={26} color={colors.primaryBlue} /></View>
              <View style={styles.grow}>
                <Text numberOfLines={2} style={styles.cardTitle}>{statement.title}</Text>
                <Text numberOfLines={1} style={styles.cardMeta}>{new Date(statement.createdAt).toLocaleString("en-CA")} | {formatDuration(statement.durationSeconds)}</Text>
                <Text style={[styles.status, statement.transcriptionStatus === "completed" ? styles.statusComplete : null]}>{statement.transcriptionStatus === "completed" ? "Transcript saved" : statement.transcriptionStatus === "failed" ? "Transcription retry available" : "Recording saved"}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={25} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      )}

      <DisclaimerBanner message="Record only when legally authorized and in accordance with applicable law, consent requirements, training, and police-service policy." />
      <DisclaimerBanner message="Recordings stay on this device by default. Nothing is uploaded unless you choose Transcribe or Translate." />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.sm, minHeight: 88, padding: spacing.md },
  cardIcon: { alignItems: "center", backgroundColor: "rgba(10,132,255,0.13)", borderRadius: radius.md, height: 48, justifyContent: "center", width: 48 },
  cardMeta: { color: colors.textMuted, fontSize: typography.caption, marginTop: spacing.xs },
  cardTitle: { color: colors.textPrimary, fontSize: typography.h3, fontWeight: "900" },
  grow: { flex: 1, minWidth: 0 },
  hero: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.25)", borderRadius: radius.xl, borderWidth: 1, flexDirection: "row", flexWrap: "wrap", gap: spacing.md, padding: spacing.md },
  heroIcon: { alignItems: "center", borderColor: colors.primaryBlue, borderRadius: radius.lg, borderWidth: 1, height: 60, justifyContent: "center", width: 60 },
  list: { gap: spacing.sm },
  localBadge: { alignItems: "center", backgroundColor: "rgba(127,255,212,0.08)", borderColor: "rgba(127,255,212,0.28)", borderRadius: radius.full, borderWidth: 1, flexDirection: "row", gap: spacing.xs, minHeight: 34, paddingHorizontal: spacing.sm },
  localBadgeText: { color: colors.ptsdGreen, fontSize: typography.caption, fontWeight: "900" },
  pressed: { opacity: 0.74 },
  status: { color: colors.accentBlue, fontSize: typography.caption, fontWeight: "800", marginTop: spacing.xs },
  statusComplete: { color: colors.ptsdGreen },
  subtitle: { color: colors.textMuted, fontSize: typography.small, marginTop: spacing.xs },
  title: { color: colors.textPrimary, fontSize: typography.h1, fontWeight: "900" },
  wrap: { gap: spacing.md }
});
