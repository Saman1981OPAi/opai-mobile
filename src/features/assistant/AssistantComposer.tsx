import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type AssistantComposerProps = {
  disabled?: boolean;
  isRecording: boolean;
  isSending: boolean;
  isTranscribing: boolean;
  onChangeText: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onVoicePress: () => void;
  value: string;
};

export function AssistantComposer({
  disabled = false,
  isRecording,
  isSending,
  isTranscribing,
  onChangeText,
  onSend,
  onStop,
  onVoicePress,
  value
}: AssistantComposerProps) {
  const voiceBusy = isRecording || isTranscribing;
  const canSend = value.trim().length > 0 && !disabled && !isSending && !voiceBusy;
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityLabel={
          isRecording
            ? "Stop voice prompt recording"
            : isTranscribing
              ? "Transcribing voice prompt"
              : "Record voice prompt"
        }
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || isSending || isTranscribing }}
        disabled={disabled || isSending || isTranscribing}
        onPress={onVoicePress}
        style={({ pressed }) => [
          styles.voiceAction,
          isRecording ? styles.voiceActionRecording : null,
          disabled || isSending || isTranscribing ? styles.disabled : null,
          pressed ? styles.pressed : null
        ]}
      >
        {isTranscribing ? (
          <ActivityIndicator color={colors.primaryBlue} size="small" />
        ) : (
          <Ionicons
            color={isRecording ? colors.textPrimary : colors.primaryBlue}
            name={isRecording ? "stop" : "mic-outline"}
            size={21}
          />
        )}
      </Pressable>
      <TextInput
        accessibilityLabel="Message OPAi"
        editable={!disabled && !voiceBusy}
        maxLength={20_000}
        multiline
        onChangeText={onChangeText}
        placeholder="Message OPAi"
        placeholderTextColor={colors.textMuted}
        returnKeyType="default"
        scrollEnabled
        style={styles.input}
        textAlignVertical="top"
        value={value}
      />
      <Pressable
        accessibilityLabel={isSending ? "Stop response" : "Send message"}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSending ? false : !canSend }}
        disabled={isSending ? false : !canSend}
        onPress={isSending ? onStop : onSend}
        style={({ pressed }) => [
          styles.action,
          isSending ? styles.stop : null,
          !isSending && !canSend ? styles.disabled : null,
          pressed ? styles.pressed : null
        ]}
      >
        <Ionicons
          color={colors.textPrimary}
          name={isSending ? "stop" : "arrow-up"}
          size={21}
        />
        <Text style={styles.actionText}>{isSending ? "Stop" : "Send"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: colors.primaryBlue,
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 46,
    minWidth: 82,
    paddingHorizontal: spacing.base
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "700"
  },
  disabled: {
    opacity: 0.45
  },
  input: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: typography.body,
    lineHeight: 22,
    maxHeight: 132,
    minHeight: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm
  },
  pressed: {
    opacity: 0.72
  },
  stop: {
    backgroundColor: colors.danger
  },
  voiceAction: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: colors.glassBlue,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  voiceActionRecording: {
    backgroundColor: colors.danger,
    borderColor: colors.danger
  },
  wrap: {
    alignItems: "flex-end",
    backgroundColor: colors.panel,
    borderColor: colors.borderStrong,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.sm
  }
});
