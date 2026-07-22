import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import type { AudioStatementRecording } from "@/features/audioStatement/audioStatementTypes";
import { apiConfig } from "@/services/api/apiConfig";
import { colors, radius, spacing, typography } from "@/theme/tokens";

const recordingOptions = { ...RecordingPresets.HIGH_QUALITY, directory: "document" as const };

function formatDuration(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export function AudioStatementRecorderScreen({
  onCancel,
  onSave
}: {
  onCancel: () => void;
  onSave: (recording: AudioStatementRecording) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [readyToSave, setReadyToSave] = useState(false);
  const recorder = useAudioRecorder(recordingOptions, (status) => {
    if (status.isFinished && status.url) setReadyToSave(true);
  });
  const state = useAudioRecorderState(recorder, 250);

  useEffect(() => {
    return () => {
      void (async () => {
        await recorder.stop().catch(() => undefined);
        const temporaryUri = recorder.uri;
        if (temporaryUri) {
          await FileSystem.deleteAsync(temporaryUri, { idempotent: true }).catch(() => undefined);
        }
        await setAudioModeAsync({ allowsBackgroundRecording: false, allowsRecording: false }).catch(() => undefined);
      })();
    };
  }, [recorder]);

  const start = async () => {
    setBusy(true);
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Microphone not enabled", "Enable microphone access in device Settings to record an Audio Statement.");
        return;
      }
      await setAudioModeAsync({
        allowsBackgroundRecording: false,
        allowsRecording: true,
        playsInSilentMode: true,
        shouldPlayInBackground: false
      });
      await recorder.prepareToRecordAsync();
      setReadyToSave(false);
      setPaused(false);
      recorder.record({ forDuration: apiConfig.maxAudioSeconds });
    } catch {
      Alert.alert("Recording unavailable", "The microphone could not start. Check device permissions and try again.");
    } finally {
      setBusy(false);
    }
  };

  const pause = () => {
    recorder.pause();
    setPaused(true);
  };

  const resume = () => {
    recorder.record({ forDuration: apiConfig.maxAudioSeconds });
    setPaused(false);
  };

  const stop = async () => {
    setBusy(true);
    try {
      await recorder.stop();
      setReadyToSave(Boolean(recorder.uri));
      await setAudioModeAsync({ allowsBackgroundRecording: false, allowsRecording: false });
    } catch {
      Alert.alert("Recording unavailable", "The recording could not be completed.");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!recorder.uri) return;
    setBusy(true);
    try {
      await onSave({
        durationSeconds: Math.max(0.1, state.durationMillis / 1000),
        localUri: recorder.uri,
        mimeType: Platform.OS === "web" ? "audio/webm" : "audio/mp4"
      });
    } catch (error) {
      Alert.alert("Unable to save", error instanceof Error ? error.message : "The recording could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (state.isRecording) await recorder.stop().catch(() => undefined);
    if (recorder.uri) await FileSystem.deleteAsync(recorder.uri, { idempotent: true }).catch(() => undefined);
    await setAudioModeAsync({ allowsBackgroundRecording: false, allowsRecording: false }).catch(() => undefined);
    onCancel();
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <View style={[styles.mic, state.isRecording ? styles.micActive : null]}>
          <MaterialCommunityIcons name={state.isRecording ? "waveform" : "microphone-outline"} size={44} color={state.isRecording ? colors.textPrimary : colors.primaryBlue} />
        </View>
        <Text accessibilityLiveRegion="polite" style={styles.timer}>{formatDuration(state.durationMillis)}</Text>
        <Text style={styles.status}>{state.isRecording ? "Recording" : paused ? "Paused" : readyToSave ? "Ready to save" : "Ready"}</Text>
      </View>

      <View style={styles.actions}>
        {!state.isRecording && !readyToSave ? (
          <PrimaryButton label={busy ? "Starting..." : "Record"} loading={busy} onPress={() => void start()}>
            <MaterialCommunityIcons name="microphone" size={22} color={colors.textPrimary} />
          </PrimaryButton>
        ) : null}
        {state.isRecording ? (
          <>
            <SecondaryButton label="Pause" onPress={pause}>
              <MaterialCommunityIcons name="pause" size={22} color={colors.primaryBlue} />
            </SecondaryButton>
            <PrimaryButton label="Stop" loading={busy} onPress={() => void stop()}>
              <MaterialCommunityIcons name="stop" size={22} color={colors.textPrimary} />
            </PrimaryButton>
          </>
        ) : null}
        {paused ? (
          <>
            <SecondaryButton label="Resume" onPress={resume}>
              <MaterialCommunityIcons name="play" size={22} color={colors.primaryBlue} />
            </SecondaryButton>
            <PrimaryButton label="Stop" loading={busy} onPress={() => void stop()}>
              <MaterialCommunityIcons name="stop" size={22} color={colors.textPrimary} />
            </PrimaryButton>
          </>
        ) : null}
        {readyToSave ? (
          <PrimaryButton label="Save" loading={busy} onPress={() => void save()}>
            <MaterialCommunityIcons name="content-save-outline" size={22} color={colors.textPrimary} />
          </PrimaryButton>
        ) : null}
        <SecondaryButton label="Cancel" onPress={() => void cancel()}>
          <MaterialCommunityIcons name="close" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
      </View>

      <Text style={styles.explanation}>Microphone access is requested only after you tap Record. Recording stops when you tap Stop, leave this recorder, or reach two minutes. Background recording is disabled.</Text>
      <DisclaimerBanner message="Audio Statement is a personal recording and transcription aid. It is not an official evidence-recording system, records-management system, certified transcript service, or replacement for service-approved equipment and procedures." />
      <DisclaimerBanner message="Record only when legally authorized and in accordance with applicable law, consent requirements, training, and police-service policy." />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" },
  explanation: { color: colors.textMuted, fontSize: typography.small, lineHeight: 21 },
  hero: { alignItems: "center", backgroundColor: "rgba(6,29,56,0.72)", borderColor: "rgba(77,163,255,0.25)", borderRadius: radius.xl, borderWidth: 1, gap: spacing.sm, padding: spacing.xl },
  mic: { alignItems: "center", borderColor: colors.primaryBlue, borderRadius: radius.full, borderWidth: 2, height: 92, justifyContent: "center", width: 92 },
  micActive: { backgroundColor: colors.primaryBlue },
  status: { color: colors.textMuted, fontSize: typography.small, fontWeight: "700", textTransform: "uppercase" },
  timer: { color: colors.textPrimary, fontSize: 38, fontVariant: ["tabular-nums"], fontWeight: "700" },
  wrap: { gap: spacing.md }
});
