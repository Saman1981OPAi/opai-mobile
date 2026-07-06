import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppShell } from "@/components/AppShell";
import { modules } from "@/data/modules";
import type { ModuleId } from "@/types/navigation";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const active = useMemo(
    () => modules.find((module) => module.id === activeModule) ?? modules[0]!,
    [activeModule]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#05070B" }}>
        <StatusBar style="light" />
        <AppShell activeModule={active} onSelectModule={setActiveModule} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
