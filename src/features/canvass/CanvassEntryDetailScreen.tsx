import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SecondaryButton } from "@/components/ui/Buttons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CanvassEntry } from "@/features/canvass/canvassTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function CanvassEntryDetailScreen({ entry, onBack, onDelete, onEdit }: { entry: CanvassEntry; onBack: () => void; onDelete: () => void; onEdit: () => void }) {
  const confirmDelete = () => Alert.alert("Delete canvass entry?", "This local reference note cannot be recovered.", [{ style: "cancel", text: "Cancel" }, { style: "destructive", text: "Delete", onPress: onDelete }]);
  return <View style={styles.wrap}><SecondaryButton label="Back" onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={19} color={colors.primaryBlue} /></SecondaryButton><View style={styles.panel}><SectionHeader icon="home-search-outline" title={entry.address} /><Fact label="Date and time" value={`${entry.date} at ${entry.time}`} />{entry.name ? <Fact label="Name" value={entry.name} /> : null}{entry.unit ? <Fact label="Unit" value={entry.unit} /> : null}{entry.contactResult ? <Fact label="Result" value={entry.contactResult} /> : null}<Fact label="Notes" value={entry.notes || "No notes"} /></View><View style={styles.actions}><SecondaryButton label="Edit" onPress={onEdit}><MaterialCommunityIcons name="pencil-outline" size={19} color={colors.primaryBlue} /></SecondaryButton><SecondaryButton label="Delete" onPress={confirmDelete}><MaterialCommunityIcons name="delete-outline" size={19} color={colors.danger} /></SecondaryButton></View></View>;
}

function Fact({ label, value }: { label: string; value: string }) { return <View><Text style={styles.label}>{label}</Text><Text selectable style={styles.value}>{value}</Text></View>; }

const styles = StyleSheet.create({ actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, label: { color: colors.textMuted, fontSize: typography.caption, fontWeight: "900", textTransform: "uppercase" }, panel: { backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.md }, value: { color: colors.textPrimary, fontSize: typography.body, lineHeight: 22, marginTop: spacing.xs }, wrap: { gap: spacing.md } });
