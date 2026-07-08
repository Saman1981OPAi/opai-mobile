import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, layout } from "@/theme/tokens";
import type { ModuleId } from "@/types/navigation";

type NavItem = {
  id: ModuleId;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
};

const items: NavItem[] = [
  { id: "dashboard", label: "Home", icon: "home" },
  { id: "incident", label: "Report", icon: "document-text-outline" },
  { id: "ai", label: "Chat", icon: "chatbubble-ellipses-outline" },
  { id: "translation", label: "Translate", icon: "language-outline" },
  { id: "calendar", label: "Calendar", icon: "calendar-outline" }
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
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={item.id}
            onPress={() => onSelectModule(item.id)}
            style={({ pressed }) => [styles.item, pressed ? styles.pressed : null]}
          >
            <Ionicons
              name={item.icon}
              size={27}
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
    gap: 4,
    justifyContent: "center",
    minHeight: 64
  },
  label: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 11,
    fontWeight: "800",
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
    left: 0,
    paddingBottom: 14,
    paddingHorizontal: 8,
    paddingTop: 7,
    position: "absolute",
    right: 0
  }
});
