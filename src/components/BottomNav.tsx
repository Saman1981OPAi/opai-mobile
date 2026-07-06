import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme/tokens";
import type { AppModule, ModuleId } from "@/types/navigation";

type BottomNavProps = {
  activeModule: ModuleId;
  modules: AppModule[];
  onSelectModule: (module: ModuleId) => void;
};

export function BottomNav({ activeModule, modules, onSelectModule }: BottomNavProps) {
  return (
    <View style={styles.wrap}>
      {modules.map((module) => {
        const active = activeModule === module.id;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={module.id}
            onPress={() => onSelectModule(module.id)}
            style={({ pressed }) => [styles.item, active ? styles.itemActive : null, pressed ? styles.pressed : null]}
          >
            <Text style={[styles.icon, active ? styles.iconActive : null]}>{module.icon}</Text>
            <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
              {module.shortLabel}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: "800"
  },
  iconActive: {
    color: colors.textPrimary
  },
  item: {
    alignItems: "center",
    borderRadius: radius.md,
    flex: 1,
    gap: 4,
    minHeight: 58,
    justifyContent: "center",
    paddingHorizontal: 4
  },
  itemActive: {
    backgroundColor: colors.primaryBlue
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700"
  },
  labelActive: {
    color: colors.textPrimary
  },
  pressed: {
    opacity: 0.75
  },
  wrap: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: "rgba(8,13,22,0.96)",
    flexDirection: "row",
    gap: spacing.xs,
    padding: spacing.xs
  }
});
