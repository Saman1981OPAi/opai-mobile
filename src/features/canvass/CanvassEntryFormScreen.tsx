import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CanvassContactResult, CanvassEntry, CanvassEntryDraft } from "@/features/canvass/canvassTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export const canvassResults: CanvassContactResult[] = ["Contact made", "No answer", "Refused", "Vacant", "Follow-up required", "Other"];

function localDateTime() {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return { date, time };
}

export function CanvassEntryFormScreen({ entry, onCancel, onSave, sessionId }: { entry?: CanvassEntry; onCancel: () => void; onSave: (draft: CanvassEntryDraft) => void; sessionId: string }) {
  const current = localDateTime();
  const [name, setName] = useState(entry?.name ?? "");
  const [address, setAddress] = useState(entry?.address ?? "");
  const [unit, setUnit] = useState(entry?.unit ?? "");
  const [date, setDate] = useState(entry?.date ?? current.date);
  const [time, setTime] = useState(entry?.time ?? current.time);
  const [contactResult, setContactResult] = useState<CanvassContactResult | undefined>(entry?.contactResult);
  const [notes, setNotes] = useState(entry?.notes ?? "");

  const save = () => {
    try {
      onSave({
        address,
        date,
        notes,
        sessionId,
        time,
        ...(name.trim() ? { name: name.trim() } : {}),
        ...(unit.trim() ? { unit: unit.trim() } : {}),
        ...(contactResult ? { contactResult } : {})
      });
    } catch (error) {
      Alert.alert("Canvass entry", error instanceof Error ? error.message : "The entry could not be saved.");
    }
  };

  return (
    <View style={styles.wrap}>
      <SectionHeader icon="home-search-outline" title={entry ? "Edit Entry" : "New Entry"} />
      <View style={styles.row}><Field label="Name (optional)" onChangeText={setName} value={name} /><Field label="Unit (optional)" onChangeText={setUnit} value={unit} /></View>
      <Field label="Address or location reference" onChangeText={setAddress} value={address} />
      <View style={styles.row}><Field label="Date (YYYY-MM-DD)" onChangeText={setDate} value={date} /><Field label="Time (HH:MM)" onChangeText={setTime} value={time} /></View>
      <Text style={styles.label}>Contact result</Text>
      <View style={styles.chips}>{canvassResults.map((result) => <Pressable accessibilityRole="radio" accessibilityState={{ selected: contactResult === result }} key={result} onPress={() => setContactResult(result)} style={[styles.chip, contactResult === result ? styles.chipSelected : null]}><Text style={styles.chipText}>{result}</Text></Pressable>)}</View>
      <Field label="Notes" multiline onChangeText={setNotes} value={notes} />
      <View style={styles.actions}><PrimaryButton label="Save entry" onPress={save}><MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} /></PrimaryButton><SecondaryButton label="Cancel" onPress={onCancel}><MaterialCommunityIcons name="close" size={20} color={colors.primaryBlue} /></SecondaryButton></View>
    </View>
  );
}

function Field({ label, multiline, onChangeText, value }: { label: string; multiline?: boolean; onChangeText: (value: string) => void; value: string }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} multiline={multiline} onChangeText={onChangeText} style={[styles.input, multiline ? styles.multiline : null]} value={value} /></View>;
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderColor: "rgba(77,163,255,0.25)", borderRadius: radius.full, borderWidth: 1, minHeight: 42, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  chipSelected: { backgroundColor: "rgba(10,132,255,0.18)", borderColor: colors.primaryBlue },
  chipText: { color: colors.textSecondary, fontSize: typography.caption, fontWeight: "700" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  field: { flex: 1, gap: spacing.xs, minWidth: 145 },
  input: { backgroundColor: "rgba(0,0,0,0.24)", borderColor: "rgba(77,163,255,0.28)", borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, fontSize: typography.body, minHeight: 48, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  label: { color: colors.textMuted, fontSize: typography.caption, fontWeight: "700", textTransform: "uppercase" },
  multiline: { minHeight: 110, textAlignVertical: "top" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  wrap: { gap: spacing.md }
});
