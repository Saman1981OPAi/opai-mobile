import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { ModuleScreen } from "@/screens/ModuleScreen";
import { ToolsScreen } from "@/features/tools/ToolsScreen";
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
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ animated: false, y: 0 });
  }, [activeModule.id]);

  return (
    <View style={styles.shell}>
      {activeModule.id === "tools" ? (
        <ToolsScreen
          localData={localData}
          onSelectModule={onSelectModule}
          onUpdateLocalData={onUpdateLocalData}
          userId={profile?.userId ?? ""}
        />
      ) : activeModule.id === "ai" ? (
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
      ) : (
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={styles.content}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
        >
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
      )}

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
