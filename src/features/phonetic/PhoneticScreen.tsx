import { useMemo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppInputText as TextInput, AppText as Text } from "@/components/ui/Typography";
import { SecondaryButton } from "@/components/ui/Buttons";
import { ToolScreenFrame } from "@/features/tools/ToolScreenFrame";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import { toNatoPhonetic } from "./phoneticAlphabet";

export function PhoneticScreen({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [large, setLarge] = useState(false);
  const output = useMemo(() => toNatoPhonetic(input), [input]);
  return <ToolScreenFrame onBack={onBack} subtitle="Offline - no history retained" title="Phonetic Alphabet">
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput accessibilityLabel="Text to convert to NATO phonetic" autoCapitalize="characters" multiline onChangeText={setInput} placeholder="Plate, name, or serial number" placeholderTextColor={colors.textSubtle} style={styles.input} value={input} />
      <View style={styles.output}><Text selectable style={[styles.outputText, large ? styles.large : null]}>{output || "Phonetic output appears here."}</Text></View>
      <View style={styles.row}><SecondaryButton disabled={!output} label="Copy" onPress={() => void Clipboard.setStringAsync(output)}><MaterialCommunityIcons color={colors.primaryBlue} name="content-copy" size={20} /></SecondaryButton><SecondaryButton label={large ? "Normal Text" : "Large Text"} onPress={() => setLarge((value) => !value)} /><SecondaryButton label="Clear" onPress={() => setInput("")} /></View>
    </ScrollView>
  </ToolScreenFrame>;
}

const styles = StyleSheet.create({ content: { gap: spacing.md, padding: spacing.md }, input: { backgroundColor: colors.panel, borderColor: colors.borderStrong, borderRadius: radius.lg, borderWidth: 1, color: colors.textPrimary, fontSize: typography.h3, minHeight: 120, padding: spacing.md, textAlignVertical: "top" }, large: { fontSize: 30, lineHeight: 42 }, output: { backgroundColor: colors.panel, borderColor: colors.primaryBlue, borderRadius: radius.lg, borderWidth: 1, minHeight: 160, padding: spacing.lg }, outputText: { color: colors.textPrimary, fontSize: typography.h3, lineHeight: 32 }, row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm } });

