import { ScrollView, StyleSheet, View } from "react-native";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { ModuleScreen } from "@/screens/ModuleScreen";
import { colors } from "@/theme/tokens";
import type { MockUserProfile } from "@/types/auth";
import type { AppModule, ModuleId } from "@/types/navigation";

type AppShellProps = {
  activeModule: AppModule;
  onSelectModule: (module: ModuleId) => void;
  onSignOut: () => void;
  profile: MockUserProfile | null;
};

export function AppShell({ activeModule, onSelectModule, onSignOut, profile }: AppShellProps) {
  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ModuleScreen
          module={activeModule}
          onSelectModule={onSelectModule}
          onSignOut={onSignOut}
          profile={profile}
        />
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
