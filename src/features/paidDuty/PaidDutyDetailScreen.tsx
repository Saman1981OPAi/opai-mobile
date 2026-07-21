import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PaidDuty } from "@/features/paidDuty/paidDutyTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function PaidDutyDetailScreen({ duty, onBack, onDelete, onDuplicate, onEdit, onToggleComplete }: { duty: PaidDuty; onBack: () => void; onDelete: () => Promise<void>; onDuplicate: () => Promise<void>; onEdit: () => void; onToggleComplete: () => Promise<void> }) {
  const confirmDelete = () => Alert.alert("Delete paid duty?", "Related local notifications will also be cancelled.", [
    { style: "cancel", text: "Cancel" },
    { style: "destructive", text: "Delete", onPress: () => void onDelete() }
  ]);
  return (
    <View style={styles.wrap}>
      <SecondaryButton label="Back" onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={19} color={colors.primaryBlue} /></SecondaryButton>
      <View style={styles.panel}>
        <SectionHeader icon="briefcase-clock-outline" title={duty.title} />
        <Fact icon="calendar" label="Date" value={`${duty.date} at ${duty.startTime}${duty.endTime ? ` - ${duty.endTime}` : ""}`} />
        <Fact icon="map-marker-outline" label="Location" value={duty.location} />
        {duty.organization ? <Fact icon="domain" label="Organization" value={duty.organization} /> : null}
        {duty.referenceNumber ? <Fact icon="identifier" label="Reference" value={duty.referenceNumber} /> : null}
        {duty.notes ? <Fact icon="note-text-outline" label="Notes" value={duty.notes} /> : null}
        <Fact icon="bell-outline" label="Reminders" value={duty.notificationIds.length ? `${duty.notificationIds.length} scheduled` : "None scheduled"} />
      </View>
      <View style={styles.actions}>
        <PrimaryButton label={duty.status === "completed" ? "Reopen" : "Mark complete"} onPress={() => void onToggleComplete()}><MaterialCommunityIcons name={duty.status === "completed" ? "backup-restore" : "check-circle-outline"} size={20} color={colors.textPrimary} /></PrimaryButton>
        <SecondaryButton label="Edit" onPress={onEdit}><MaterialCommunityIcons name="pencil-outline" size={19} color={colors.primaryBlue} /></SecondaryButton>
        <SecondaryButton label="Duplicate" onPress={() => void onDuplicate()}><MaterialCommunityIcons name="content-copy" size={19} color={colors.primaryBlue} /></SecondaryButton>
        <SecondaryButton label="Delete" onPress={confirmDelete}><MaterialCommunityIcons name="delete-outline" size={19} color={colors.danger} /></SecondaryButton>
      </View>
      <DisclaimerBanner message="Paid Duty reminders are optional productivity aids. Confirm official details and obligations through authorized systems and service policy." />
    </View>
  );
}

function Fact({ icon, label, value }: { icon: ComponentProps<typeof MaterialCommunityIcons>["name"]; label: string; value: string }) {
  return <View style={styles.fact}><MaterialCommunityIcons name={icon} size={21} color={colors.accentBlue} /><View style={styles.grow}><Text style={styles.label}>{label}</Text><Text selectable style={styles.value}>{value}</Text></View></View>;
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  fact: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  grow: { flex: 1, minWidth: 0 },
  label: { color: colors.textMuted, fontSize: typography.caption, fontWeight: "700", textTransform: "uppercase" },
  panel: { backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.md },
  value: { color: colors.textPrimary, fontSize: typography.body, lineHeight: 22, marginTop: spacing.xs },
  wrap: { gap: spacing.md }
});
