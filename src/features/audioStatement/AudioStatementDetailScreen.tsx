import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AudioStatementPlaybackControls } from "@/features/audioStatement/AudioStatementPlaybackControls";
import { AudioStatementTranscriptPanel } from "@/features/audioStatement/AudioStatementTranscriptPanel";
import {
  AudioStatementTranslationPanel,
  transcriptLanguages
} from "@/features/audioStatement/AudioStatementTranslationPanel";
import { audioStatementRepository } from "@/features/audioStatement/audioStatementRepository";
import { audioStatementService } from "@/features/audioStatement/audioStatementService";
import type { AudioStatement } from "@/features/audioStatement/audioStatementTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}

export function AudioStatementDetailScreen({
  onBack,
  onChange,
  onDelete,
  statement
}: {
  onBack: () => void;
  onChange: (statement: AudioStatement) => void;
  onDelete: () => Promise<void>;
  statement: AudioStatement;
}) {
  const [busy, setBusy] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(statement.editedTranscript ?? statement.originalAiTranscript ?? "");
  const [notes, setNotes] = useState(statement.notes ?? "");
  const [targetLanguage, setTargetLanguage] = useState(statement.targetLanguage ?? "fr");
  const [title, setTitle] = useState(statement.title);

  const apply = (changes: Partial<AudioStatement>) => {
    const updated = { ...statement, ...changes, updatedAt: new Date().toISOString() };
    onChange(updated);
    return updated;
  };

  const clearTranscriptFields = () => {
    const {
      detectedLanguage: _detectedLanguage,
      editedTranscript: _editedTranscript,
      originalAiTranscript: _originalAiTranscript,
      targetLanguage: _targetLanguage,
      translatedText: _translatedText,
      ...retained
    } = statement;
    const updated: AudioStatement = {
      ...retained,
      transcriptionRequestKey: `${statement.id}-${Date.now()}`,
      transcriptionStatus: "notRequested",
      updatedAt: new Date().toISOString()
    };
    onChange(updated);
  };

  const saveTitle = () => {
    try {
      onChange(audioStatementRepository.rename(statement, title));
    } catch (error) {
      Alert.alert("Title", error instanceof Error ? error.message : "The title could not be saved.");
    }
  };

  const transcribe = async () => {
    setBusy(true);
    apply({ transcriptionStatus: "transcribing" });
    try {
      const result = await audioStatementService.transcribe(statement);
      const updated = apply({
        ...(result.detectedLanguage ? { detectedLanguage: result.detectedLanguage } : {}),
        editedTranscript: result.transcript,
        originalAiTranscript: result.transcript,
        transcriptionStatus: "completed"
      });
      setEditedTranscript(result.transcript);
      onChange(updated);
    } catch (error) {
      apply({ transcriptionStatus: "failed" });
      Alert.alert("Transcription unavailable", error instanceof Error ? error.message : "Try again later. Your local recording remains available.");
    } finally {
      setBusy(false);
    }
  };

  const saveTranscript = () => {
    const normalized = editedTranscript.trim();
    if (!normalized) {
      Alert.alert("Transcript", "Add transcript text before saving.");
      return;
    }
    apply({ editedTranscript: normalized, transcriptionStatus: "completed" });
    setEditedTranscript(normalized);
  };

  const deleteTranscript = () => {
    Alert.alert("Delete transcript?", "The local recording will remain on this device.", [
      { style: "cancel", text: "Cancel" },
      {
        style: "destructive",
        text: "Delete text",
        onPress: () => {
          setEditedTranscript("");
          clearTranscriptFields();
        }
      }
    ]);
  };

  const translate = async () => {
    const reviewedText = editedTranscript.trim();
    if (!reviewedText) return;
    setBusy(true);
    try {
      const result = await audioStatementService.translateTranscript(reviewedText, targetLanguage, statement.detectedLanguage);
      apply({ targetLanguage, translatedText: result.translated_text });
    } catch (error) {
      Alert.alert("Translation unavailable", error instanceof Error ? error.message : "Try again later. Your transcript remains on this device.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert("Delete Audio Statement?", "This removes the recording and its local text from this device.", [
      { style: "cancel", text: "Cancel" },
      { style: "destructive", text: "Delete", onPress: () => void onDelete() }
    ]);
  };

  const targetLabel = transcriptLanguages.find((language) => language.code === targetLanguage)?.label ?? targetLanguage;

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <SecondaryButton label="Back" onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={19} color={colors.primaryBlue} />
        </SecondaryButton>
        <Text numberOfLines={1} style={styles.meta}>{formatDuration(statement.durationSeconds)} | {(statement.fileSizeBytes / 1024 / 1024).toFixed(2)} MB</Text>
      </View>

      <View style={styles.panel}>
        <SectionHeader icon="microphone-outline" title="Audio Statement" />
        <TextInput accessibilityLabel="Audio Statement title" maxLength={80} onChangeText={setTitle} style={styles.input} value={title} />
        <SecondaryButton label="Save title" onPress={saveTitle}>
          <MaterialCommunityIcons name="content-save-outline" size={19} color={colors.primaryBlue} />
        </SecondaryButton>
      </View>

      <AudioStatementPlaybackControls localUri={statement.localUri} />

      {!statement.originalAiTranscript ? (
        <View style={styles.panel}>
          <SectionHeader icon="text-recognition" title="Transcription" />
          <Text style={styles.body}>Nothing is uploaded until you select Transcribe. A temporary copy is sent to the secure OPAi backend and removed after processing.</Text>
          <PrimaryButton label={busy ? "Transcribing..." : statement.transcriptionStatus === "failed" ? "Retry transcription" : "Transcribe"} loading={busy} onPress={() => void transcribe()}>
            <MaterialCommunityIcons name="text-recognition" size={20} color={colors.textPrimary} />
          </PrimaryButton>
        </View>
      ) : (
        <>
          <AudioStatementTranscriptPanel
            editedTranscript={editedTranscript}
            onChangeText={setEditedTranscript}
            onDelete={deleteTranscript}
            onReset={() => setEditedTranscript(statement.originalAiTranscript ?? "")}
            onSave={saveTranscript}
            onTranslate={() => void translate()}
            originalTranscript={statement.originalAiTranscript}
          />
          <AudioStatementTranslationPanel
            busy={busy}
            onSelectLanguage={setTargetLanguage}
            onTranslate={() => void translate()}
            selectedLanguage={targetLanguage}
            {...(statement.translatedText ? { translatedText: statement.translatedText } : {})}
          />
          {statement.translatedText ? <Text style={styles.meta}>Target: {targetLabel}</Text> : null}
        </>
      )}

      <View style={styles.panel}>
        <SectionHeader icon="note-text-outline" title="Local notes" />
        <TextInput accessibilityLabel="Audio Statement notes" multiline onChangeText={setNotes} placeholder="Optional personal reference notes" placeholderTextColor={colors.textMuted} style={[styles.input, styles.notes]} value={notes} />
        <SecondaryButton
          label="Save notes"
          onPress={() => {
            const normalized = notes.trim();
            if (normalized) {
              apply({ notes: normalized });
              return;
            }
            const { notes: _notes, ...retained } = statement;
            onChange({ ...retained, updatedAt: new Date().toISOString() });
          }}
        >
          <MaterialCommunityIcons name="content-save-outline" size={19} color={colors.primaryBlue} />
        </SecondaryButton>
      </View>

      <SecondaryButton label="Delete Audio Statement" onPress={confirmDelete}>
        <MaterialCommunityIcons name="delete-outline" size={19} color={colors.danger} />
      </SecondaryButton>
      <DisclaimerBanner message="Audio Statement is a personal recording and transcription aid. It is not an official evidence-recording system, records-management system, certified transcript service, or replacement for service-approved equipment and procedures." />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { color: colors.textMuted, fontSize: typography.small, lineHeight: 21 },
  headerRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "space-between" },
  input: { backgroundColor: "rgba(0,0,0,0.24)", borderColor: "rgba(77,163,255,0.28)", borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, fontSize: typography.body, minHeight: 48, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  meta: { color: colors.textMuted, flexShrink: 1, fontSize: typography.caption, fontWeight: "700" },
  notes: { minHeight: 96, textAlignVertical: "top" },
  panel: { backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.md },
  wrap: { gap: spacing.md }
});
