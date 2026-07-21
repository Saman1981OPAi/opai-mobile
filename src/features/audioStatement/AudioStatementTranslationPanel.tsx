import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { SecondaryButton } from "@/components/ui/Buttons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export const transcriptLanguages = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "fa", label: "Farsi" },
  { code: "ar", label: "Arabic" },
  { code: "es", label: "Spanish" },
  { code: "zh", label: "Mandarin" },
  { code: "pa", label: "Punjabi" },
  { code: "hi", label: "Hindi" },
  { code: "ur", label: "Urdu" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" }
] as const;

export function AudioStatementTranslationPanel({
  busy,
  onSelectLanguage,
  onTranslate,
  selectedLanguage,
  translatedText
}: {
  busy: boolean;
  onSelectLanguage: (language: string) => void;
  onTranslate: () => void;
  selectedLanguage: string;
  translatedText?: string;
}) {
  const rtl = ["fa", "ar", "ur"].includes(selectedLanguage);
  return (
    <View style={styles.panel}>
      <SectionHeader icon="translate" title="Translation" />
      <View style={styles.languageRow}>
        {transcriptLanguages.map((language) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedLanguage === language.code }}
            key={language.code}
            onPress={() => onSelectLanguage(language.code)}
            style={[styles.chip, selectedLanguage === language.code ? styles.chipActive : null]}
          >
            <Text numberOfLines={1} style={styles.chipText}>{language.label}</Text>
          </Pressable>
        ))}
      </View>
      <SecondaryButton label={busy ? "Translating..." : "Translate reviewed text"} loading={busy} onPress={onTranslate}>
        <MaterialCommunityIcons name="translate" size={19} color={colors.primaryBlue} />
      </SecondaryButton>
      {translatedText ? (
        <View style={styles.output}>
          <Text style={styles.outputLabel}>AI-generated translation</Text>
          <Text selectable style={[styles.outputText, { textAlign: rtl ? "right" : "left", writingDirection: rtl ? "rtl" : "ltr" }]}>{translatedText}</Text>
          <SecondaryButton label="Copy translation" onPress={() => void Clipboard.setStringAsync(translatedText)}>
            <MaterialCommunityIcons name="content-copy" size={19} color={colors.primaryBlue} />
          </SecondaryButton>
        </View>
      ) : null}
      <Text style={styles.notice}>AI translation may be incomplete or inaccurate. Verify important content and use an authorized interpreter or certified translator where required.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { borderColor: "rgba(77,163,255,0.25)", borderRadius: radius.full, borderWidth: 1, justifyContent: "center", minHeight: 40, paddingHorizontal: spacing.base },
  chipActive: { backgroundColor: "rgba(10,132,255,0.22)", borderColor: colors.primaryBlue },
  chipText: { color: colors.textPrimary, fontSize: typography.caption, fontWeight: "700" },
  languageRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  notice: { color: colors.warning, fontSize: typography.caption, lineHeight: 18 },
  output: { backgroundColor: "rgba(127,255,212,0.06)", borderColor: "rgba(127,255,212,0.24)", borderRadius: radius.md, borderWidth: 1, gap: spacing.sm, padding: spacing.md },
  outputLabel: { color: colors.ptsdGreen, fontSize: typography.caption, fontWeight: "700", textTransform: "uppercase" },
  outputText: { color: colors.textPrimary, fontSize: typography.body, lineHeight: 24 },
  panel: { backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.24)", borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.md }
});
