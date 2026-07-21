import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { getModelOptions } from "@/features/deviceTesting/deviceTestingAssistantService";
import type { DeviceModelOption, DeviceTestCategory } from "@/features/deviceTesting/deviceTestingTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type DeviceModelSelectorProps = {
  category: DeviceTestCategory;
  onSelectModel: (option: DeviceModelOption) => void;
};

export function DeviceModelSelector({ category, onSelectModel }: DeviceModelSelectorProps) {
  const options = getModelOptions(category);

  return (
    <View style={styles.wrap}>
      {options.map((option) => (
        <Pressable
          accessibilityHint="Opens a model-specific local guide when available"
          accessibilityLabel={`${option.manufacturer} ${option.model}`}
          accessibilityRole="button"
          key={option.id}
          onPress={() => onSelectModel(option)}
          style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name={option.supported ? "check-decagram-outline" : "alert-circle-outline"}
              size={24}
              color={option.supported ? colors.ptsdGreen : colors.warning}
            />
          </View>
          <View style={styles.copy}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.manufacturer}>{option.manufacturer}</Text>
            <Text numberOfLines={2} style={styles.model}>{option.model}</Text>
            <Text numberOfLines={2} style={styles.meta}>{option.configuration} / {option.jurisdiction}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primaryBlue} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.72)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 74,
    padding: spacing.base
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  manufacturer: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "700"
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 17
  },
  model: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 19
  },
  pressed: {
    opacity: 0.76
  },
  wrap: {
    gap: spacing.sm
  }
});
