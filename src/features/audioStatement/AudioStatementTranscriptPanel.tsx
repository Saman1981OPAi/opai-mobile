import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { StyleSheet, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function AudioStatementTranscriptPanel({
  editedTranscript,
  onChangeText,
  onDelete,
  onReset,
  onSave,
  onTranslate,
  originalTranscript
}: {
  editedTranscript: string;
  onChangeText: (text: string) => void;
  onDelete: () => void;
  onReset: () => void;
  onSave: () => void;
  onTranslate: () => void;
  originalTranscript: string;
}) {
  const changed = editedTranscript !== originalTranscript;

  return (
    <View style={styles.panel}>
      <SectionHeader icon="text-box-check-outline" title="Transcript" />
      <View style={styles.labelRow}>
        <Text style={styles.aiLabel}>AI-generated</Text>
        {changed ? <Text style={styles.editedLabel}>User edited</Text> : null}
      </View>
      <TextInput
        accessibilityLabel="Editable Audio Statement transcript"
        multiline
        onChangeText={onChangeText}
        style={styles.input}
        textAlignVertical="top"
        value={editedTranscript}
      />
      <View style={styles.actions}>
        <PrimaryButton label="Save" onPress={onSave}>
          <MaterialCommunityIcons name="content-save-outline" size={19} color={colors.textPrimary} />
        </PrimaryButton>
        <SecondaryButton label="Reset" disabled={!changed} onPress={onReset}>
          <MaterialCommunityIcons name="restore" size={19} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton label="Copy" onPress={() => void Clipboard.setStringAsync(editedTranscript)}>
          <MaterialCommunityIcons name="content-copy" size={19} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton label="Translate" disabled={!editedTranscript.trim()} onPress={onTranslate}>
          <MaterialCommunityIcons name="translate" size={19} color={colors.primaryBlue} />
        </SecondaryButton>
        <SecondaryButton label="Delete text" onPress={onDelete}>
          <MaterialCommunityIcons name="delete-outline" size={19} color={colors.danger} />
        </SecondaryButton>
      </View>
      <Text style={styles.warning}>AI transcription may contain omissions, substitutions, or inaccurate wording. Listen to the original recording and verify the transcript before relying on it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  aiLabel: { color: colors.primaryBlue, fontSize: typography.caption, fontWeight: "700", textTransform: "uppercase" },
  editedLabel: { color: colors.ptsdGreen, fontSize: typography.caption, fontWeight: "700", textTransform: "uppercase" },
  input: { backgroundColor: "rgba(0,0,0,0.24)", borderColor: "rgba(77,163,255,0.28)", borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, fontSize: typography.body, lineHeight: 24, minHeight: 150, padding: spacing.md },
  labelRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  panel: { backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.md },
  warning: { color: colors.warning, fontSize: typography.caption, lineHeight: 18 }
});
