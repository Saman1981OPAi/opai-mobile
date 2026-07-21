import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { paidDutyReminderChoices } from "@/features/paidDuty/paidDutyReminderService";
import type { PaidDuty, PaidDutyDraft } from "@/features/paidDuty/paidDutyTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

function tomorrow() {
  const value = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return value.toISOString().slice(0, 10);
}

export function PaidDutyFormScreen({
  duty,
  onCancel,
  onSave
}: {
  duty?: PaidDuty;
  onCancel: () => void;
  onSave: (draft: PaidDutyDraft) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(duty?.title ?? "");
  const [organization, setOrganization] = useState(duty?.organization ?? "");
  const [dutyType, setDutyType] = useState(duty?.dutyType ?? "");
  const [location, setLocation] = useState(duty?.location ?? "");
  const [date, setDate] = useState(duty?.date ?? tomorrow());
  const [startTime, setStartTime] = useState(duty?.startTime ?? "18:00");
  const [endTime, setEndTime] = useState(duty?.endTime ?? "");
  const [contactName, setContactName] = useState(duty?.contactName ?? "");
  const [contactPhone, setContactPhone] = useState(duty?.contactPhone ?? "");
  const [compensationRate, setCompensationRate] = useState(duty?.compensationRate ?? "");
  const [referenceNumber, setReferenceNumber] = useState(duty?.referenceNumber ?? "");
  const [equipmentNotes, setEquipmentNotes] = useState(duty?.equipmentNotes ?? "");
  const [notes, setNotes] = useState(duty?.notes ?? "");
  const [offsets, setOffsets] = useState<number[]>(duty?.reminderOffsets ?? [24 * 60, 2 * 60]);
  const [customMinutes, setCustomMinutes] = useState("");

  const toggleOffset = (minutes: number) => {
    setOffsets((current) => current.includes(minutes) ? current.filter((item) => item !== minutes) : [...current, minutes]);
  };

  const addCustom = () => {
    const minutes = Number(customMinutes);
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 30 * 24 * 60) {
      Alert.alert("Custom reminder", "Enter 1 to 43200 minutes before the duty.");
      return;
    }
    setOffsets((current) => [...new Set([...current, Math.round(minutes)])]);
    setCustomMinutes("");
  };

  const save = async () => {
    setBusy(true);
    try {
      const draft: PaidDutyDraft = {
        date,
        location,
        reminderOffsets: offsets,
        startTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Toronto",
        title,
        ...(organization.trim() ? { organization: organization.trim() } : {}),
        ...(dutyType.trim() ? { dutyType: dutyType.trim() } : {}),
        ...(endTime.trim() ? { endTime: endTime.trim() } : {}),
        ...(contactName.trim() ? { contactName: contactName.trim() } : {}),
        ...(contactPhone.trim() ? { contactPhone: contactPhone.trim() } : {}),
        ...(compensationRate.trim() ? { compensationRate: compensationRate.trim() } : {}),
        ...(referenceNumber.trim() ? { referenceNumber: referenceNumber.trim() } : {}),
        ...(equipmentNotes.trim() ? { equipmentNotes: equipmentNotes.trim() } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {})
      };
      await onSave(draft);
    } catch (error) {
      Alert.alert("Paid Duty", error instanceof Error ? error.message : "The paid duty could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <SectionHeader icon="briefcase-clock-outline" title={duty ? "Edit Paid Duty" : "New Paid Duty"} />
      <Field label="Title" onChangeText={setTitle} value={title} />
      <Field label="Organization (optional)" onChangeText={setOrganization} value={organization} />
      <Field label="Duty type (optional)" onChangeText={setDutyType} value={dutyType} />
      <Field label="Location" onChangeText={setLocation} value={location} />
      <View style={styles.row}>
        <Field label="Date (YYYY-MM-DD)" onChangeText={setDate} value={date} />
        <Field label="Start (HH:MM)" onChangeText={setStartTime} value={startTime} />
        <Field label="End (optional)" onChangeText={setEndTime} value={endTime} />
      </View>
      <View style={styles.row}>
        <Field label="Contact name" onChangeText={setContactName} value={contactName} />
        <Field label="Contact phone" keyboardType="phone-pad" onChangeText={setContactPhone} value={contactPhone} />
      </View>
      <View style={styles.row}>
        <Field label="Rate (optional)" onChangeText={setCompensationRate} value={compensationRate} />
        <Field label="Reference (optional)" onChangeText={setReferenceNumber} value={referenceNumber} />
      </View>
      <Field label="Equipment notes" multiline onChangeText={setEquipmentNotes} value={equipmentNotes} />
      <Field label="Notes" multiline onChangeText={setNotes} value={notes} />

      <View style={styles.panel}>
        <SectionHeader icon="bell-outline" title="Local reminders" />
        <Text style={styles.helper}>Optional notifications show only the start time on the lock screen.</Text>
        <View style={styles.chips}>
          {paidDutyReminderChoices.map((choice) => {
            const selected = offsets.includes(choice.minutes);
            return (
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: selected }} key={choice.minutes} onPress={() => toggleOffset(choice.minutes)} style={[styles.chip, selected ? styles.chipSelected : null]}>
                <MaterialCommunityIcons name={selected ? "check-circle" : "circle-outline"} size={18} color={selected ? colors.ptsdGreen : colors.textMuted} />
                <Text style={styles.chipText}>{choice.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.customRow}>
          <TextInput accessibilityLabel="Custom reminder minutes" keyboardType="number-pad" onChangeText={setCustomMinutes} placeholder="Custom minutes" placeholderTextColor={colors.textMuted} style={styles.input} value={customMinutes} />
          <SecondaryButton label="Add" onPress={addCustom}><MaterialCommunityIcons name="plus" size={19} color={colors.primaryBlue} /></SecondaryButton>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label={busy ? "Saving..." : "Save"} loading={busy} onPress={() => void save()}><MaterialCommunityIcons name="content-save-outline" size={20} color={colors.textPrimary} /></PrimaryButton>
        <SecondaryButton label="Cancel" onPress={onCancel}><MaterialCommunityIcons name="close" size={20} color={colors.primaryBlue} /></SecondaryButton>
      </View>
      <DisclaimerBanner message="Paid Duty is a personal scheduling aid. Verify all duty details, authorization, compensation, equipment, and reporting requirements through approved systems and service policy." />
    </View>
  );
}

function Field({ keyboardType, label, multiline, onChangeText, value }: { keyboardType?: "default" | "number-pad" | "phone-pad"; label: string; multiline?: boolean; onChangeText: (value: string) => void; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} keyboardType={keyboardType} multiline={multiline} onChangeText={onChangeText} style={[styles.input, multiline ? styles.multiline : null]} value={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { alignItems: "center", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.full, borderWidth: 1, flexDirection: "row", gap: spacing.xs, minHeight: 42, paddingHorizontal: spacing.sm },
  chipSelected: { backgroundColor: "rgba(127,255,212,0.08)", borderColor: "rgba(127,255,212,0.45)" },
  chipText: { color: colors.textSecondary, fontSize: typography.caption, fontWeight: "700" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  customRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  field: { flex: 1, gap: spacing.xs, minWidth: 145 },
  helper: { color: colors.textMuted, fontSize: typography.small, lineHeight: 20 },
  input: { backgroundColor: "rgba(0,0,0,0.24)", borderColor: "rgba(77,163,255,0.28)", borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, fontSize: typography.body, minHeight: 48, minWidth: 150, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  label: { color: colors.textMuted, fontSize: typography.caption, fontWeight: "700", textTransform: "uppercase" },
  multiline: { minHeight: 86, textAlignVertical: "top" },
  panel: { backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.md },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  wrap: { gap: spacing.md }
});
