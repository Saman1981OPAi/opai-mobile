import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { colors, layout } from "@/theme/tokens";
import type { ModuleId } from "@/types/navigation";

type NavItem = {
  id: ModuleId;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
};

const items: NavItem[] = [
  { id: "ai", label: "OPAi", icon: "sparkles-outline" },
  { id: "incident", label: "Report", icon: "document-text-outline" },
  { id: "translation", label: "Translate", icon: "language-outline" },
  { id: "calendar", label: "Calendar", icon: "calendar-outline" },
  { id: "settings", label: "Settings", icon: "settings-outline" }
];

type BottomNavigationProps = {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
};

export function BottomNavigation({ activeModule, onSelectModule }: BottomNavigationProps) {
  return (
    <View style={styles.wrap}>
      {items.map((item) => {
        const active = activeModule === item.id;
        return (
          <Pressable
            accessibilityLabel={`${item.label} tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={item.id}
            onPress={() => onSelectModule(item.id)}
            style={({ pressed }) => [styles.item, active ? styles.itemActive : null, pressed ? styles.pressed : null]}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={active ? colors.primaryBlue : "rgba(255,255,255,0.68)"}
            />
            <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.label, active ? styles.labelActive : null]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flex: 1,
    gap: 3,
    justifyContent: "center",
    maxWidth: 84,
    minWidth: 44,
    minHeight: 58
  },
  itemActive: {
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: 18,
    borderWidth: 1
  },
  label: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center"
  },
  labelActive: {
    color: colors.primaryBlue
  },
  pressed: {
    opacity: 0.72
  },
  wrap: {
    alignItems: "center",
    backgroundColor: "rgba(2,12,24,0.98)",
    borderTopColor: "rgba(77,163,255,0.16)",
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    height: layout.bottomNavHeight,
    justifyContent: "space-between",
    left: 0,
    paddingBottom: 14,
    paddingHorizontal: 10,
    paddingTop: 7,
    position: "absolute",
    right: 0
  }
});
