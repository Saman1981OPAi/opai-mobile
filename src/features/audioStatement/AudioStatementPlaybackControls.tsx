import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme/tokens";

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  return `${Math.floor(safe / 60)}:${Math.floor(safe % 60).toString().padStart(2, "0")}`;
}

export function AudioStatementPlaybackControls({ localUri }: { localUri: string }) {
  const player = useAudioPlayer(localUri, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  const toggle = async () => {
    if (status.didJustFinish) await player.seekTo(0);
    if (status.playing) player.pause();
    else player.play();
  };

  const seek = (delta: number) => {
    void player.seekTo(Math.min(status.duration || 0, Math.max(0, status.currentTime + delta)));
  };

  return (
    <View style={styles.panel}>
      <Pressable accessibilityLabel="Rewind 15 seconds" accessibilityRole="button" onPress={() => seek(-15)} style={styles.iconButton}>
        <MaterialCommunityIcons name="rewind-15" size={24} color={colors.accentBlue} />
      </Pressable>
      <Pressable
        accessibilityLabel={status.playing ? "Pause Audio Statement" : "Play Audio Statement"}
        accessibilityRole="button"
        onPress={() => void toggle()}
        style={styles.playButton}
      >
        <MaterialCommunityIcons name={status.playing ? "pause" : "play"} size={30} color={colors.textPrimary} />
      </Pressable>
      <Pressable accessibilityLabel="Forward 15 seconds" accessibilityRole="button" onPress={() => seek(15)} style={styles.iconButton}>
        <MaterialCommunityIcons name="fast-forward-15" size={24} color={colors.accentBlue} />
      </Pressable>
      <View style={styles.timeWrap}>
        <Text style={styles.time}>{formatTime(status.currentTime)}</Text>
        <View style={styles.track}>
          <View style={[styles.progress, { width: `${status.duration ? Math.min(100, (status.currentTime / status.duration) * 100) : 0}%` }]} />
        </View>
        <Text style={styles.time}>{formatTime(status.duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    alignItems: "center",
    borderColor: "rgba(77,163,255,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  panel: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.72)",
    borderColor: "rgba(77,163,255,0.25)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    padding: spacing.md
  },
  playButton: {
    alignItems: "center",
    backgroundColor: colors.primaryBlue,
    borderRadius: radius.full,
    height: 54,
    justifyContent: "center",
    width: 54
  },
  progress: {
    backgroundColor: colors.primaryBlue,
    borderRadius: radius.full,
    height: 4
  },
  time: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontVariant: ["tabular-nums"],
    fontWeight: "800"
  },
  timeWrap: {
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 1,
    gap: spacing.sm,
    minWidth: 160
  },
  track: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: radius.full,
    flex: 1,
    height: 4,
    overflow: "hidden"
  }
});
