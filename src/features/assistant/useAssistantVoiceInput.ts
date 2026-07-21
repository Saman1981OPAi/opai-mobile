import { useCallback, useEffect, useRef, useState } from "react";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { Alert, Platform } from "react-native";
import { assistantVoiceApi } from "@/features/assistant/assistantVoiceApi";
import { createStableId } from "@/features/assistant/assistantTypes";
import { ApiError } from "@/services/api/apiClient";

const MAX_PROMPT_SECONDS = 60;

export function useAssistantVoiceInput({
  disabled,
  onTranscript
}: {
  disabled: boolean;
  onTranscript: (transcript: string) => void;
}) {
  const [completedUri, setCompletedUri] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const durationRef = useRef(0);
  const processingUri = useRef<string | null>(null);
  const requestController = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY, (status) => {
    if (status.isFinished && status.url) setCompletedUri(status.url);
  });
  const recorderState = useAudioRecorderState(recorder, 250);

  useEffect(() => {
    durationRef.current = recorderState.durationMillis;
  }, [recorderState.durationMillis]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestController.current?.abort();
      void recorder.stop().catch(() => undefined);
      const temporaryUri = recorder.uri;
      if (temporaryUri) {
        void FileSystem.deleteAsync(temporaryUri, { idempotent: true }).catch(() => undefined);
      }
      void setAudioModeAsync({
        allowsBackgroundRecording: false,
        allowsRecording: false
      }).catch(() => undefined);
    };
  }, [recorder]);

  const transcribe = useCallback(
    async (uri: string) => {
      if (processingUri.current === uri) return;
      processingUri.current = uri;
      const controller = new AbortController();
      requestController.current = controller;
      if (mounted.current) setIsTranscribing(true);

      try {
        const response = await assistantVoiceApi.transcribe(
          {
            durationSeconds: Math.max(0.1, durationRef.current / 1000),
            mimeType: Platform.OS === "web" ? "audio/webm" : "audio/mp4",
            uri
          },
          createStableId("assistant-voice"),
          controller.signal
        );
        if (mounted.current) onTranscript(response.transcript);
      } catch (error) {
        if (!(error instanceof ApiError && error.code === "REQUEST_CANCELLED")) {
          Alert.alert(
            "Voice prompt unavailable",
            error instanceof Error
              ? error.message
              : "The recording could not be transcribed. You can keep typing your message."
          );
        }
      } finally {
        requestController.current = null;
        await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => undefined);
        await setAudioModeAsync({
          allowsBackgroundRecording: false,
          allowsRecording: false
        }).catch(() => undefined);
        if (mounted.current) {
          setCompletedUri(null);
          setIsTranscribing(false);
        }
      }
    },
    [onTranscript]
  );

  useEffect(() => {
    if (completedUri) void transcribe(completedUri);
  }, [completedUri, transcribe]);

  const start = async () => {
    if (disabled || isTranscribing) return;
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Microphone not enabled",
          "Enable microphone access in device Settings to dictate an OPAi message."
        );
        return;
      }
      processingUri.current = null;
      setCompletedUri(null);
      await setAudioModeAsync({
        allowsBackgroundRecording: false,
        allowsRecording: true,
        playsInSilentMode: true,
        shouldPlayInBackground: false
      });
      await recorder.prepareToRecordAsync();
      recorder.record({ forDuration: MAX_PROMPT_SECONDS });
    } catch {
      Alert.alert(
        "Recording unavailable",
        "The microphone could not start. Check device permissions and try again."
      );
    }
  };

  const stop = async () => {
    if (!recorderState.isRecording) return;
    try {
      await recorder.stop();
    } catch {
      Alert.alert("Recording unavailable", "The voice prompt could not be completed.");
    }
  };

  return {
    durationMillis: recorderState.durationMillis,
    isRecording: recorderState.isRecording,
    isTranscribing,
    onPress: recorderState.isRecording ? stop : start
  };
}
