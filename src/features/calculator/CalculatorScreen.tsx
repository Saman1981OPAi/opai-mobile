import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppInputText as TextInput, AppText as Text } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { ToolScreenFrame } from "@/features/tools/ToolScreenFrame";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import { ageOnDate, basicArithmetic, cleanNumber, convertUnit, decimalToDms, dmsToDecimal, elapsedMinutes, parseFiniteNumber, type ConversionKind } from "./calculatorCore";

const conversions: { kind: ConversionKind; label: string }[] = [
  { kind: "distance-short", label: "m / ft" }, { kind: "distance-long", label: "km / mi" }, { kind: "weight", label: "kg / lb" }, { kind: "temperature", label: "C / F" }, { kind: "speed", label: "km/h / mph" }, { kind: "velocity", label: "m/s / km/h" }
];

export function CalculatorScreen({ onBack }: { onBack: () => void }) {
  const [kind, setKind] = useState<ConversionKind>("distance-short");
  const [value, setValue] = useState("");
  const [reverse, setReverse] = useState(false);
  const [result, setResult] = useState("");
  const [start, setStart] = useState("23:30");
  const [end, setEnd] = useState("00:15");
  const [dob, setDob] = useState("");
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [decimalDegrees, setDecimalDegrees] = useState("");
  const [degrees, setDegrees] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [operator, setOperator] = useState<"+" | "-" | "x" | "/" | "%">("+");
  const run = (operation: () => string) => { try { setResult(operation()); } catch (error) { setResult(error instanceof Error ? error.message : "Calculation unavailable."); } };
  return <ToolScreenFrame onBack={onBack} subtitle="Offline approximate utility" title="Calculator">
    <ScrollView automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}><Text style={styles.heading}>Unit Converter</Text><View style={styles.row}>{conversions.map((item) => <SecondaryButton key={item.kind} label={item.label} onPress={() => { setKind(item.kind); setResult(""); }} />)}</View><View style={styles.row}><TextInput accessibilityLabel="Conversion value" keyboardType="decimal-pad" onChangeText={setValue} placeholder="Value" placeholderTextColor={colors.textSubtle} style={styles.input} value={value} /><SecondaryButton label={reverse ? "Reverse On" : "Reverse"} onPress={() => setReverse((current) => !current)} /><PrimaryButton label="Convert" onPress={() => run(() => cleanNumber(convertUnit(kind, parseFiniteNumber(value), reverse)))} /></View></View>
      <View style={styles.card}><Text style={styles.heading}>Elapsed Time</Text><View style={styles.row}><TextInput accessibilityLabel="Start time" onChangeText={setStart} placeholder="HH:MM" placeholderTextColor={colors.textSubtle} style={styles.input} value={start} /><TextInput accessibilityLabel="End time" onChangeText={setEnd} placeholder="HH:MM" placeholderTextColor={colors.textSubtle} style={styles.input} value={end} /><PrimaryButton label="Calculate" onPress={() => run(() => { const minutes = elapsedMinutes(start, end); return `${Math.floor(minutes / 60)} h ${minutes % 60} min`; })} /></View></View>
      <View style={styles.card}><Text style={styles.heading}>Age</Text><View style={styles.row}><TextInput accessibilityLabel="Date of birth" onChangeText={setDob} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textSubtle} style={styles.input} value={dob} /><PrimaryButton label="Calculate" onPress={() => run(() => `${ageOnDate(dob)} years`)} /></View></View>
      <View style={styles.card}>
        <Text style={styles.heading}>Coordinates</Text>
        <View style={styles.row}>
          <TextInput accessibilityLabel="Decimal degrees" keyboardType="numbers-and-punctuation" onChangeText={setDecimalDegrees} placeholder="Decimal degrees" placeholderTextColor={colors.textSubtle} style={styles.input} value={decimalDegrees} />
          <PrimaryButton label="To DMS" onPress={() => run(() => { const dms = decimalToDms(parseFiniteNumber(decimalDegrees)); return `${dms.degrees} deg ${dms.minutes} min ${cleanNumber(dms.seconds, 2)} sec`; })} />
        </View>
        <View style={styles.row}>
          <TextInput accessibilityLabel="Coordinate degrees" keyboardType="numbers-and-punctuation" onChangeText={setDegrees} placeholder="Degrees" placeholderTextColor={colors.textSubtle} style={styles.input} value={degrees} />
          <TextInput accessibilityLabel="Coordinate minutes" keyboardType="decimal-pad" onChangeText={setMinutes} placeholder="Minutes" placeholderTextColor={colors.textSubtle} style={styles.input} value={minutes} />
          <TextInput accessibilityLabel="Coordinate seconds" keyboardType="decimal-pad" onChangeText={setSeconds} placeholder="Seconds" placeholderTextColor={colors.textSubtle} style={styles.input} value={seconds} />
          <PrimaryButton label="To Decimal" onPress={() => run(() => cleanNumber(dmsToDecimal(parseFiniteNumber(degrees), parseFiniteNumber(minutes), parseFiniteNumber(seconds)), 6))} />
        </View>
      </View>
      <View style={styles.card}><Text style={styles.heading}>Arithmetic / Percentage</Text><View style={styles.row}><TextInput accessibilityLabel="First number" keyboardType="decimal-pad" onChangeText={setLeft} placeholder="First" placeholderTextColor={colors.textSubtle} style={styles.input} value={left} />{(["+", "-", "x", "/", "%"] as const).map((item) => <SecondaryButton key={item} label={item} onPress={() => setOperator(item)} />)}<TextInput accessibilityLabel="Second number" keyboardType="decimal-pad" onChangeText={setRight} placeholder="Second" placeholderTextColor={colors.textSubtle} style={styles.input} value={right} /><PrimaryButton label="Calculate" onPress={() => run(() => cleanNumber(basicArithmetic(parseFiniteNumber(left), operator, parseFiniteNumber(right))))} /></View></View>
      <View accessibilityLiveRegion="polite" style={styles.result}><Text selectable style={styles.resultText}>{result || "Result"}</Text></View>
      <Text style={styles.notice}>Results are approximate unless verified with an approved measuring instrument or official system.</Text>
    </ScrollView>
  </ToolScreenFrame>;
}

const styles = StyleSheet.create({ card: { backgroundColor: colors.panel, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.base, padding: spacing.md }, content: { gap: spacing.md, padding: spacing.md }, heading: { color: colors.textPrimary, fontSize: typography.h3, fontWeight: "700" }, input: { backgroundColor: colors.backgroundBlue, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, minHeight: 50, minWidth: 110, paddingHorizontal: spacing.md }, notice: { color: colors.textMuted, fontSize: typography.small, lineHeight: 21 }, result: { backgroundColor: "rgba(10,132,255,0.12)", borderColor: colors.primaryBlue, borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg }, resultText: { color: colors.textPrimary, fontSize: 28, fontWeight: "700" }, row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.sm } });
