import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PaidDutyDetailScreen } from "@/features/paidDuty/PaidDutyDetailScreen";
import { PaidDutyFormScreen } from "@/features/paidDuty/PaidDutyFormScreen";
import { paidDutyReminderService } from "@/features/paidDuty/paidDutyReminderService";
import { paidDutyRepository } from "@/features/paidDuty/paidDutyRepository";
import type { PaidDuty, PaidDutyDraft, PaidDutyStatus } from "@/features/paidDuty/paidDutyTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type Mode = "list" | "form" | "detail";

export function PaidDutyListScreen({ duties, onChange }: { duties: PaidDuty[]; onChange: (duties: PaidDuty[]) => void }) {
  const [filter, setFilter] = useState<PaidDutyStatus>("upcoming");
  const [mode, setMode] = useState<Mode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = duties.find((duty) => duty.id === selectedId);
  const filtered = useMemo(() => duties.filter((duty) => duty.status === filter).sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`)), [duties, filter]);

  const save = async (draft: PaidDutyDraft) => {
    const prior = selected;
    const saved = prior ? paidDutyRepository.update(prior, draft) : paidDutyRepository.create(draft);
    let synchronized = saved;
    try {
      synchronized = await paidDutyReminderService.synchronize(saved, prior?.notificationIds ?? []);
    } catch (error) {
      synchronized = { ...saved, notificationIds: [] };
      Alert.alert("Paid Duty saved", error instanceof Error ? error.message : "Reminders were not scheduled.");
    }
    onChange(prior ? duties.map((item) => item.id === prior.id ? synchronized : item) : [synchronized, ...duties]);
    setSelectedId(synchronized.id);
    setMode("detail");
  };

  const deleteSelected = async () => {
    if (!selected) return;
    await paidDutyReminderService.cancel(selected);
    onChange(duties.filter((item) => item.id !== selected.id));
    setMode("list");
    setSelectedId(null);
  };

  const toggleComplete = async () => {
    if (!selected) return;
    let updated = paidDutyRepository.setCompleted(selected, selected.status !== "completed");
    updated = updated.status === "completed" ? await paidDutyReminderService.cancel(updated) : await paidDutyReminderService.synchronize(updated).catch(() => ({ ...updated, notificationIds: [] }));
    onChange(duties.map((item) => item.id === updated.id ? updated : item));
  };

  const duplicate = async () => {
    if (!selected) return;
    const copy = paidDutyRepository.duplicate(selected);
    onChange([copy, ...duties]);
    setSelectedId(copy.id);
  };

  if (mode === "form") return <PaidDutyFormScreen {...(selected ? { duty: selected } : {})} onCancel={() => setMode(selected ? "detail" : "list")} onSave={save} />;
  if (mode === "detail" && selected) return <PaidDutyDetailScreen key={selected.id} duty={selected} onBack={() => setMode("list")} onDelete={deleteSelected} onDuplicate={duplicate} onEdit={() => setMode("form")} onToggleComplete={toggleComplete} />;

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}><MaterialCommunityIcons name="briefcase-clock-outline" size={34} color={colors.primaryBlue} /></View>
        <View style={styles.grow}><Text style={styles.title}>Paid Duty</Text><Text style={styles.subtitle}>Schedule and reminders</Text></View>
      </View>
      <PrimaryButton label="Add paid duty" onPress={() => { setSelectedId(null); setMode("form"); }}><MaterialCommunityIcons name="plus" size={22} color={colors.textPrimary} /></PrimaryButton>
      <View style={styles.filters}>
        {(["upcoming", "completed"] as const).map((status) => <Pressable accessibilityRole="button" key={status} onPress={() => setFilter(status)} style={[styles.filter, filter === status ? styles.filterActive : null]}><Text style={styles.filterText}>{status === "upcoming" ? "Upcoming" : "Completed"}</Text></Pressable>)}
      </View>
      <SectionHeader action={`${filtered.length}`} icon="calendar-clock" title={filter === "upcoming" ? "Upcoming duties" : "Completed duties"} />
      {filtered.length === 0 ? <EmptyState icon="briefcase-outline" title={`No ${filter} duties`} message="Paid Duty details are stored locally on this device." /> : (
        <View style={styles.list}>{filtered.map((duty) => <Pressable accessibilityLabel={`Open ${duty.title}`} accessibilityRole="button" key={duty.id} onPress={() => { setSelectedId(duty.id); setMode("detail"); }} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
          <View style={styles.cardIcon}><MaterialCommunityIcons name="briefcase-clock-outline" size={26} color={colors.primaryBlue} /></View>
          <View style={styles.grow}><Text numberOfLines={2} style={styles.cardTitle}>{duty.title}</Text><Text numberOfLines={1} style={styles.cardMeta}>{duty.date} | {duty.startTime} | {duty.location}</Text><Text style={styles.reminderText}>{duty.notificationIds.length ? `${duty.notificationIds.length} reminder${duty.notificationIds.length === 1 ? "" : "s"}` : "No reminders"}</Text></View>
          <MaterialCommunityIcons name="chevron-right" size={25} color={colors.textMuted} />
        </Pressable>)}</View>
      )}
      <DisclaimerBanner message="Paid Duty information stays on this device and is not sent to OPAi AI or the backend. Reminders are optional and contain no name, rate, notes, or detailed address." />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.sm, minHeight: 86, padding: spacing.md },
  cardIcon: { alignItems: "center", backgroundColor: "rgba(10,132,255,0.13)", borderRadius: radius.md, height: 48, justifyContent: "center", width: 48 },
  cardMeta: { color: colors.textMuted, fontSize: typography.caption, marginTop: spacing.xs },
  cardTitle: { color: colors.textPrimary, fontSize: typography.h3, fontWeight: "900" },
  filter: { borderColor: "rgba(77,163,255,0.25)", borderRadius: radius.full, borderWidth: 1, minHeight: 42, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  filterActive: { backgroundColor: "rgba(10,132,255,0.18)", borderColor: colors.primaryBlue },
  filterText: { color: colors.textPrimary, fontSize: typography.caption, fontWeight: "900" },
  filters: { flexDirection: "row", gap: spacing.sm },
  grow: { flex: 1, minWidth: 0 },
  hero: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.25)", borderRadius: radius.xl, borderWidth: 1, flexDirection: "row", gap: spacing.md, padding: spacing.md },
  heroIcon: { alignItems: "center", borderColor: colors.primaryBlue, borderRadius: radius.lg, borderWidth: 1, height: 60, justifyContent: "center", width: 60 },
  list: { gap: spacing.sm },
  pressed: { opacity: 0.74 },
  reminderText: { color: colors.ptsdGreen, fontSize: typography.caption, fontWeight: "800", marginTop: spacing.xs },
  subtitle: { color: colors.textMuted, fontSize: typography.small, marginTop: spacing.xs },
  title: { color: colors.textPrimary, fontSize: typography.h1, fontWeight: "900" },
  wrap: { gap: spacing.md }
});
