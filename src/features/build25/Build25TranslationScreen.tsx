import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { translationApi } from "@/services/api/translationApi";
import type { TranslationResponse, UploadAsset } from "@/services/api/apiTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import type { TranslationRecord } from "@/types/translation";

type Mode = "text" | "voice" | "image" | "document";
const languages = [
  { label: "English", code: "en" }, { label: "French", code: "fr" },
  { label: "Persian", code: "fa" }, { label: "Arabic", code: "ar" },
  { label: "Urdu", code: "ur" }, { label: "Spanish", code: "es" }
] as const;

export function Build25TranslationScreen({ history = [] }: { history?: TranslationRecord[] }) {
  const [mode, setMode] = useState<Mode>("text");
  const [sourceIndex, setSourceIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(1);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [asset, setAsset] = useState<UploadAsset | null>(null);
  const [busy, setBusy] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 500);
  const source = languages[sourceIndex] ?? languages[0];
  const target = languages[targetIndex] ?? languages[1];
  const isRtl = ["fa", "ar", "ur"].includes(target.code);

  const cycle = (kind: "source" | "target") => {
    if (kind === "source") setSourceIndex((value) => (value + 1) % languages.length);
    else setTargetIndex((value) => (value + 1) % languages.length);
  };

  const run = async (request: () => Promise<TranslationResponse>) => {
    setBusy(true);
    try { setResult(await request()); }
    catch (error) { Alert.alert("Translation unavailable", error instanceof Error ? error.message : "Try again later."); }
    finally { setBusy(false); }
  };

  const startRecording = async () => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) { Alert.alert("Microphone not enabled", "Voice translation remains available after microphone permission is enabled in Settings."); return; }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record({ forDuration: 120 });
  };

  const stopRecording = async () => {
    await recorder.stop();
    if (recorder.uri) setAsset({ uri: recorder.uri, name: "opai-translation.m4a", mimeType: "audio/mp4", temporary: true });
  };

  const clearAsset = async () => {
    const uri = asset?.uri;
    setAsset(null); setResult(null);
    if (asset?.temporary && uri?.startsWith("file:")) await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => undefined);
  };

  const pickImage = async (camera: boolean) => {
    const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Permission not enabled", `You can enable ${camera ? "camera" : "photo"} access in Settings.`); return; }
    const selection = camera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.85 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.85 });
    const item = selection.assets?.[0];
    if (!selection.canceled && item) setAsset({ uri: item.uri, name: item.fileName ?? "translation-image.jpg", mimeType: item.mimeType ?? "image/jpeg", temporary: camera, ...(item.fileSize ? { size: item.fileSize } : {}) });
  };

  const pickDocument = async () => {
    const selection = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "text/plain", "image/jpeg", "image/png"], copyToCacheDirectory: true });
    const item = selection.assets?.[0];
    if (!selection.canceled && item) setAsset({ uri: item.uri, name: item.name, mimeType: item.mimeType ?? "application/octet-stream", temporary: true, ...(item.size ? { size: item.size } : {}) });
  };

  const upload = () => {
    if (!asset) return;
    if (mode === "voice") void run(async () => { try { return await translationApi.audio(asset, target.code, recorderState.durationMillis / 1000, source.code); } finally { await clearAsset(); } });
    if (mode === "image") void run(async () => { try { return await translationApi.image(asset, target.code); } finally { await clearAsset(); } });
    if (mode === "document") void run(async () => { try { return await translationApi.document(asset, target.code); } finally { await clearAsset(); } });
  };

  return <View style={styles.wrap}>
    <View style={styles.hero}><MaterialCommunityIcons name="translate" size={34} color={colors.primaryBlue} /><View style={styles.grow}><Text style={styles.title}>Translation</Text><Text style={styles.sub}>Text, voice, image, document</Text></View></View>
    <View style={styles.row}>{(["text", "voice", "image", "document"] as Mode[]).map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: mode === item }} key={item} onPress={() => { setMode(item); setResult(null); setAsset(null); }} style={[styles.chip, mode === item && styles.active]}><Text style={styles.chipText}>{item}</Text></Pressable>)}</View>
    <View style={styles.row}><SecondaryButton label={`From: ${source.label}`} onPress={() => cycle("source")}><MaterialCommunityIcons name="translate" size={18} color={colors.primaryBlue} /></SecondaryButton><SecondaryButton label={`To: ${target.label}`} onPress={() => cycle("target")}><MaterialCommunityIcons name="swap-horizontal" size={18} color={colors.primaryBlue} /></SecondaryButton></View>
    {mode === "text" ? <View style={styles.panel}><SectionHeader icon="text-box-edit-outline" title="Text" /><TextInput accessibilityLabel="Text to translate" multiline onChangeText={setInput} placeholder="Enter text" placeholderTextColor={colors.textMuted} style={styles.input} value={input} /><View style={styles.row}><PrimaryButton label={busy ? "Translating..." : "Translate"} loading={busy} onPress={() => input.trim() ? void run(() => translationApi.text({ text: input.trim(), sourceLanguage: source.code, targetLanguage: target.code })) : Alert.alert("Translation", "Enter text first.")}><MaterialCommunityIcons name="translate" size={20} color={colors.textPrimary} /></PrimaryButton><SecondaryButton label="Swap" onPress={() => { setSourceIndex(targetIndex); setTargetIndex(sourceIndex); }}><MaterialCommunityIcons name="swap-horizontal" size={18} color={colors.primaryBlue} /></SecondaryButton><SecondaryButton label="Clear" onPress={() => { setInput(""); setResult(null); }}><MaterialCommunityIcons name="close" size={18} color={colors.primaryBlue} /></SecondaryButton></View></View> : null}
    {mode === "voice" ? <View style={styles.panel}><SectionHeader icon="microphone-outline" title="Turn-based voice" /><Text style={styles.sub}>OPAi uses your microphone only when you choose to record speech for transcription and translation.</Text><Text style={styles.status}>{recorderState.isRecording ? `Recording ${Math.floor(recorderState.durationMillis / 1000)}s` : asset ? "Recording ready. Confirm to translate." : "Ready"}</Text><View style={styles.row}>{!recorderState.isRecording ? <PrimaryButton label="Tap to Record" onPress={() => void startRecording()}><MaterialCommunityIcons name="microphone" size={20} color={colors.textPrimary} /></PrimaryButton> : <PrimaryButton label="Stop" onPress={() => void stopRecording()}><MaterialCommunityIcons name="stop" size={20} color={colors.textPrimary} /></PrimaryButton>}{asset ? <SecondaryButton label="Translate" onPress={upload}><MaterialCommunityIcons name="translate" size={18} color={colors.primaryBlue} /></SecondaryButton> : null}<SecondaryButton label="Cancel" onPress={() => void clearAsset()}><MaterialCommunityIcons name="close" size={18} color={colors.primaryBlue} /></SecondaryButton></View></View> : null}
    {mode === "image" ? <View style={styles.panel}><SectionHeader icon="camera-outline" title="Image" /><View style={styles.row}><SecondaryButton label="Camera" onPress={() => void pickImage(true)}><MaterialCommunityIcons name="camera" size={18} color={colors.primaryBlue} /></SecondaryButton><SecondaryButton label="Photos" onPress={() => void pickImage(false)}><MaterialCommunityIcons name="image" size={18} color={colors.primaryBlue} /></SecondaryButton></View>{asset ? <AssetConfirm asset={asset} busy={busy} onCancel={() => void clearAsset()} onUpload={upload} /> : null}</View> : null}
    {mode === "document" ? <View style={styles.panel}><SectionHeader icon="file-document-outline" title="Document" /><SecondaryButton label="Choose PDF or TXT" onPress={() => void pickDocument()}><MaterialCommunityIcons name="file-plus-outline" size={18} color={colors.primaryBlue} /></SecondaryButton>{asset ? <AssetConfirm asset={asset} busy={busy} onCancel={() => void clearAsset()} onUpload={upload} /> : null}</View> : null}
    {result ? <View style={styles.result}><Text style={styles.resultTitle}>AI-generated translation</Text>{result.original_transcript ? <Text style={styles.original}>Transcript: {result.original_transcript}</Text> : null}{result.extracted_text ? <Text style={styles.original}>Extracted: {result.extracted_text}</Text> : null}<Text selectable style={[styles.output, { writingDirection: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }]}>{result.translated_text}</Text><Text style={styles.meta}>Detected: {result.detected_source_language}</Text>{result.uncertainty_notes.map(note => <Text key={note} style={styles.warn}>- {note}</Text>)}{result.unreadable_regions?.map(note => <Text key={note} style={styles.warn}>Unreadable: {note}</Text>)}{result.unsupported_elements?.map(note => <Text key={note} style={styles.warn}>Unsupported: {note}</Text>)}</View> : null}
    <SectionHeader action={`${history.length}`} icon="history" title="History" />
    {history.length === 0 ? (
      <EmptyState
        actionLabel="Translate Text"
        icon="translate"
        message="Translations saved on this device will appear here."
        onAction={() => setMode("text")}
        title="No translation history"
      />
    ) : (
      <View style={styles.panel}>
        {history.slice(0, 10).map((item) => (
          <View key={item.id} style={styles.asset}>
            <Text numberOfLines={1} style={styles.output}>{item.sourceText}</Text>
            <Text numberOfLines={2} style={styles.sub}>{item.translatedText}</Text>
            <Text style={styles.meta}>{item.sourceLanguage} to {item.targetLanguage}</Text>
          </View>
        ))}
      </View>
    )}
    <DisclaimerBanner message="AI translation may be incomplete or inaccurate. Verify important content and use an authorized interpreter or certified translator where required." />
  </View>;
}

function AssetConfirm({ asset, busy, onCancel, onUpload }: { asset: UploadAsset; busy: boolean; onCancel: () => void; onUpload: () => void }) { return <View style={styles.asset}><Text numberOfLines={2} style={styles.output}>{asset.name}</Text><Text style={styles.meta}>{asset.mimeType}{asset.size ? ` - ${(asset.size / 1024 / 1024).toFixed(2)} MB` : ""}</Text><Text style={styles.sub}>Nothing is uploaded until you confirm.</Text><View style={styles.row}><PrimaryButton label={busy ? "Uploading..." : "Confirm & Translate"} loading={busy} onPress={onUpload}><MaterialCommunityIcons name="cloud-upload-outline" size={18} color={colors.textPrimary} /></PrimaryButton><SecondaryButton label="Cancel" onPress={onCancel}><MaterialCommunityIcons name="close" size={18} color={colors.primaryBlue} /></SecondaryButton></View></View>; }

const styles = StyleSheet.create({ active:{backgroundColor:"rgba(10,132,255,0.3)",borderColor:colors.primaryBlue},asset:{gap:spacing.sm},chip:{borderColor:"rgba(77,163,255,.3)",borderRadius:radius.full,borderWidth:1,minHeight:42,paddingHorizontal:spacing.base,justifyContent:"center"},chipText:{color:colors.textPrimary,fontWeight:"900",textTransform:"capitalize"},grow:{flex:1,minWidth:0},hero:{alignItems:"center",backgroundColor:"rgba(7,23,42,.8)",borderRadius:radius.lg,flexDirection:"row",gap:spacing.md,padding:spacing.md},input:{backgroundColor:"rgba(0,0,0,.25)",borderColor:"rgba(77,163,255,.3)",borderRadius:radius.md,borderWidth:1,color:colors.textPrimary,fontSize:typography.body,minHeight:130,padding:spacing.base,textAlignVertical:"top"},meta:{color:colors.textMuted,fontSize:typography.caption},original:{color:colors.textSecondary,fontSize:typography.small},output:{color:colors.textPrimary,fontSize:typography.body,lineHeight:24},panel:{backgroundColor:"rgba(6,29,56,.65)",borderColor:"rgba(77,163,255,.2)",borderRadius:radius.lg,borderWidth:1,gap:spacing.md,padding:spacing.md},result:{backgroundColor:"rgba(127,255,212,.06)",borderColor:"rgba(127,255,212,.25)",borderRadius:radius.lg,borderWidth:1,gap:spacing.sm,padding:spacing.md},resultTitle:{color:colors.ptsdGreen,fontSize:typography.h3,fontWeight:"900"},row:{alignItems:"center",flexDirection:"row",flexWrap:"wrap",gap:spacing.sm},status:{color:colors.ptsdGreen,fontWeight:"900"},sub:{color:colors.textMuted,fontSize:typography.small,lineHeight:20},title:{color:colors.textPrimary,fontSize:typography.h1,fontWeight:"900"},warn:{color:colors.warning,fontSize:typography.caption},wrap:{gap:spacing.md} });
