import { ScrollView, StyleSheet, View } from "react-native";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { ModuleScreen } from "@/screens/ModuleScreen";
import { colors } from "@/theme/tokens";
import type { AppModule, ModuleId } from "@/types/navigation";

type AppShellProps = {
  activeModule: AppModule;
  onSelectModule: (module: ModuleId) => void;
};

export function AppShell({ activeModule, onSelectModule }: AppShellProps) {
  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ModuleScreen module={activeModule} onSelectModule={onSelectModule} />
      </ScrollView>

      <BottomNavigation activeModule={activeModule.id} onSelectModule={onSelectModule} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112
  },
  shell: {
    backgroundColor: colors.background,
    flex: 1
  }
});
