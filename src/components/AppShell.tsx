import { ScrollView, StyleSheet, View } from "react-native";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { ModuleScreen } from "@/screens/ModuleScreen";
import type { LocalAppData } from "@/storage/storageTypes";
import { colors } from "@/theme/tokens";
import type { MockUserProfile } from "@/types/auth";
import type { AppModule, ModuleId } from "@/types/navigation";

type AppShellProps = {
  activeModule: AppModule;
  localData: LocalAppData;
  onClearLocalData: () => Promise<void>;
  onResetDemoData: () => Promise<void>;
  onSelectModule: (module: ModuleId) => void;
  onSignOut: () => void;
  onUpdateLocalData: (updater: (current: LocalAppData) => LocalAppData) => void;
  profile: MockUserProfile | null;
};

export function AppShell({
  activeModule,
  localData,
  onClearLocalData,
  onResetDemoData,
  onSelectModule,
  onSignOut,
  onUpdateLocalData,
  profile
}: AppShellProps) {
  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ModuleScreen
          localData={localData}
          module={activeModule}
          onClearLocalData={onClearLocalData}
          onResetDemoData={onResetDemoData}
          onSelectModule={onSelectModule}
          onSignOut={onSignOut}
          onUpdateLocalData={onUpdateLocalData}
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
