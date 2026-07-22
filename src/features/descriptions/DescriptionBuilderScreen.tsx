import { useEffect, useMemo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Alert, FlatList, Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import { AppInputText as TextInput, AppText as Text } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { ToolScreenFrame } from "@/features/tools/ToolScreenFrame";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import { buildPersonDescription, buildVehicleDescription } from "./descriptionBuilder";
import { descriptionRepository } from "./descriptionRepository";
import type { PersonDescriptionInput, SavedDescription, VehicleDescriptionInput } from "./descriptionTypes";

const emptyVehicle: VehicleDescriptionInput = { makeModelCertainty: "possible" };

function Field({ label, onChangeText, value }: { label: string; onChangeText: (value: string) => void; value: string | undefined }) {
  return <TextInput accessibilityLabel={label} onChangeText={onChangeText} placeholder={label} placeholderTextColor={colors.textSubtle} style={styles.input} value={value ?? ""} />;
}

export function DescriptionBuilderScreen({ hasReport, onAppendReport, onBack, onCreateReport, onInsertNotebook, userId }: { hasReport: boolean; onAppendReport: (text: string) => void; onBack: () => void; onCreateReport: (text: string, source: string) => void; onInsertNotebook: (text: string) => void; userId: string }) {
  const [kind, setKind] = useState<"person" | "vehicle">("person");
  const [person, setPerson] = useState<PersonDescriptionInput>({});
  const [vehicle, setVehicle] = useState<VehicleDescriptionInput>(emptyVehicle);
  const [saved, setSaved] = useState<SavedDescription[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [preview, setPreview] = useState<SavedDescription | null>(null);
  const [query, setQuery] = useState("");
  const output = useMemo(() => kind === "person" ? buildPersonDescription(person) : buildVehicleDescription(vehicle), [kind, person, vehicle]);
  const hasDetails = output !== "No description details entered.";
  const visibleSaved = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? saved.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(needle)) : saved;
  }, [query, saved]);

  useEffect(() => {
    let active = true;
    void descriptionRepository.list(userId).then((items) => { if (active) setSaved(items); });
    return () => { active = false; };
  }, [userId]);

  const clear = () => kind === "person" ? setPerson({}) : setVehicle(emptyVehicle);
  const share = async () => { if (hasDetails) await Share.share({ message: output }); };
  const save = async () => {
    if (!hasDetails) return;
    const now = new Date().toISOString();
    const description: SavedDescription = {
      createdAt: now,
      id: `description-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind,
      text: output,
      title: `${kind === "person" ? "Person" : "Vehicle"} description`,
      updatedAt: now
    };
    await descriptionRepository.upsert(userId, description);
    setSaved((current) => [description, ...current]);
    Alert.alert("Description saved", "The description is stored locally in protected storage.");
  };
  const removeSaved = (item: SavedDescription) => {
    Alert.alert("Delete saved description?", "This removes the protected local copy.", [
      { style: "cancel", text: "Cancel" },
      { style: "destructive", text: "Delete", onPress: () => void (async () => {
        const next = saved.filter((savedItem) => savedItem.id !== item.id);
        await descriptionRepository.save(userId, next);
        setSaved(next);
        setPreview(null);
      })() }
    ]);
  };

  if (preview) {
    return <ToolScreenFrame onBack={() => setPreview(null)} subtitle="Protected local description" title={preview.title}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.output}><Text selectable style={styles.outputText}>{preview.text}</Text></View>
        <View style={styles.row}>
          <SecondaryButton label="Copy" onPress={() => void Clipboard.setStringAsync(preview.text)} />
          <SecondaryButton label="Share" onPress={() => void Share.share({ message: preview.text })} />
          <SecondaryButton label="Notebook" onPress={() => onInsertNotebook(preview.text)} />
          <PrimaryButton label="Create Report" onPress={() => onCreateReport(preview.text, preview.title)} />
          <SecondaryButton disabled={!hasReport} label="Append Latest" onPress={() => onAppendReport(preview.text)} />
          <SecondaryButton label="Delete" onPress={() => removeSaved(preview)} />
        </View>
      </ScrollView>
    </ToolScreenFrame>;
  }

  if (showSaved) {
    return <ToolScreenFrame onBack={() => setShowSaved(false)} subtitle="Protected and searchable" title="Saved Descriptions">
      <View style={styles.libraryControls}>
        <TextInput accessibilityLabel="Search saved descriptions" onChangeText={setQuery} placeholder="Search descriptions" placeholderTextColor={colors.textSubtle} style={styles.search} value={query} />
        <PrimaryButton label="New" onPress={() => setShowSaved(false)} />
      </View>
      <FlatList contentContainerStyle={styles.list} data={visibleSaved} keyExtractor={(item) => item.id} ListEmptyComponent={<Text style={styles.empty}>No saved descriptions.</Text>} renderItem={({ item }) => <Pressable accessibilityLabel={`Open ${item.title}`} accessibilityRole="button" onPress={() => setPreview(item)} style={styles.savedCard}><MaterialCommunityIcons color={colors.primaryBlue} name={item.kind === "person" ? "account-details-outline" : "car-info"} size={28} /><View style={{ flex: 1 }}><Text style={styles.savedTitle}>{item.title}</Text><Text numberOfLines={2} style={styles.savedText}>{item.text}</Text></View><MaterialCommunityIcons color={colors.primaryBlue} name="chevron-right" size={24} /></Pressable>} />
    </ToolScreenFrame>;
  }

  return <ToolScreenFrame onBack={onBack} subtitle="Deterministic formatting - no AI" title="Description Builder">
    <ScrollView automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.row}><PrimaryButton label="Person" onPress={() => setKind("person")} /><SecondaryButton label="Vehicle" onPress={() => setKind("vehicle")} /><SecondaryButton label={`Saved (${saved.length})`} onPress={() => setShowSaved(true)} /></View>
      <View style={styles.form}>
        {kind === "person" ? <>
          <Field label="Presentation" onChangeText={(presentation) => setPerson({ ...person, presentation })} value={person.presentation} />
          <Field label="Approximate age" onChangeText={(age) => setPerson({ ...person, age })} value={person.age} />
          <Field label="Approximate height" onChangeText={(height) => setPerson({ ...person, height })} value={person.height} />
          <Field label="Build" onChangeText={(build) => setPerson({ ...person, build })} value={person.build} />
          <Field label="Hair" onChangeText={(hair) => setPerson({ ...person, hair })} value={person.hair} />
          <Field label="Clothing" onChangeText={(clothing) => setPerson({ ...person, clothing })} value={person.clothing} />
          <Field label="Distinguishing features" onChangeText={(distinguishingFeatures) => setPerson({ ...person, distinguishingFeatures })} value={person.distinguishingFeatures} />
          <Field label="Last-seen direction" onChangeText={(direction) => setPerson({ ...person, direction })} value={person.direction} />
          <Field label="Last-seen time" onChangeText={(lastSeenAt) => setPerson({ ...person, lastSeenAt })} value={person.lastSeenAt} />
        </> : <>
          <Field label="Colour" onChangeText={(colour) => setVehicle({ ...vehicle, colour })} value={vehicle.colour} />
          <Field label="Body style" onChangeText={(bodyStyle) => setVehicle({ ...vehicle, bodyStyle })} value={vehicle.bodyStyle} />
          <Field label="Make / model" onChangeText={(makeModel) => setVehicle({ ...vehicle, makeModel })} value={vehicle.makeModel} />
          <View style={styles.row}><SecondaryButton label="Confirmed" onPress={() => setVehicle({ ...vehicle, makeModelCertainty: "confirmed" })} /><SecondaryButton label="Possibly" onPress={() => setVehicle({ ...vehicle, makeModelCertainty: "possible" })} /><SecondaryButton label="Unconfirmed" onPress={() => setVehicle({ ...vehicle, makeModelCertainty: "unknown" })} /></View>
          <Field label="Partial or full plate" onChangeText={(plate) => setVehicle({ ...vehicle, plate })} value={vehicle.plate} />
          <Field label="Plate jurisdiction" onChangeText={(jurisdiction) => setVehicle({ ...vehicle, jurisdiction })} value={vehicle.jurisdiction} />
          <Field label="Damage" onChangeText={(damage) => setVehicle({ ...vehicle, damage })} value={vehicle.damage} />
          <Field label="Markings" onChangeText={(markings) => setVehicle({ ...vehicle, markings })} value={vehicle.markings} />
          <Field label="Last-seen direction" onChangeText={(direction) => setVehicle({ ...vehicle, direction })} value={vehicle.direction} />
          <Field label="Last-seen location" onChangeText={(lastSeenLocation) => setVehicle({ ...vehicle, lastSeenLocation })} value={vehicle.lastSeenLocation} />
          <Field label="Last-seen time" onChangeText={(lastSeenAt) => setVehicle({ ...vehicle, lastSeenAt })} value={vehicle.lastSeenAt} />
        </>}
      </View>
      <View style={styles.output}><Text selectable style={styles.outputText}>{output}</Text></View>
      <View style={styles.row}>
        <SecondaryButton disabled={!hasDetails} label="Copy" onPress={() => void Clipboard.setStringAsync(output)}><MaterialCommunityIcons color={colors.primaryBlue} name="content-copy" size={20} /></SecondaryButton>
        <SecondaryButton disabled={!hasDetails} label="Share" onPress={() => void share()}><MaterialCommunityIcons color={colors.primaryBlue} name="share-variant-outline" size={20} /></SecondaryButton>
        <SecondaryButton disabled={!hasDetails} label="Save" onPress={() => void save()}><MaterialCommunityIcons color={colors.primaryBlue} name="content-save-outline" size={20} /></SecondaryButton>
        <SecondaryButton disabled={!hasDetails} label="Notebook" onPress={() => { onInsertNotebook(output); Alert.alert("Added to Notebook", "A protected Shift Notebook entry was created."); }} />
        <PrimaryButton disabled={!hasDetails} label="Create Report" onPress={() => { onCreateReport(output, `${kind === "person" ? "Person" : "Vehicle"} Description`); Alert.alert("Report created", "A protected report draft was created."); }} />
        <SecondaryButton disabled={!hasDetails || !hasReport} label="Append Latest" onPress={() => { onAppendReport(output); Alert.alert("Report updated", "The description was appended to the latest protected report."); }} />
        <SecondaryButton label="Clear" onPress={clear} />
      </View>
    </ScrollView>
  </ToolScreenFrame>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, padding: spacing.md },
  empty: { color: colors.textMuted, padding: spacing.xl, textAlign: "center" },
  form: { backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.md },
  input: { backgroundColor: colors.backgroundBlue, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, fontSize: typography.body, minHeight: 50, paddingHorizontal: spacing.md },
  libraryControls: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, padding: spacing.md },
  list: { gap: spacing.sm, padding: spacing.md },
  output: { backgroundColor: "rgba(10,132,255,0.12)", borderColor: colors.primaryBlue, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
  outputText: { color: colors.textPrimary, fontSize: typography.body, lineHeight: 26 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  savedCard: { alignItems: "center", backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.base, minHeight: 84, padding: spacing.md },
  savedText: { color: colors.textMuted, fontSize: typography.small, marginTop: spacing.xs },
  savedTitle: { color: colors.textPrimary, fontSize: typography.body, fontWeight: "700" },
  search: { backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, color: colors.textPrimary, flexGrow: 1, minHeight: 50, minWidth: 190, paddingHorizontal: spacing.md }
});
