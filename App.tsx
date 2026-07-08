import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppShell } from "@/components/AppShell";
import { modules } from "@/data/modules";
import { AuthFlow } from "@/screens/AuthFlow";
import type { AuthStatus, MockUserProfile } from "@/types/auth";
import type { ModuleId } from "@/types/navigation";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [authStatus, setAuthStatus] = useState<AuthStatus>("signedOut");
  const [profile, setProfile] = useState<MockUserProfile | null>(null);
  const active = useMemo(
    () => modules.find((module) => module.id === activeModule) ?? modules[0]!,
    [activeModule]
  );

  const handleAuthenticated = (nextProfile: MockUserProfile) => {
    setProfile(nextProfile);
    setAuthStatus("signedIn");
    setActiveModule("dashboard");
  };

  const handleSignOut = () => {
    setProfile(null);
    setAuthStatus("signedOut");
    setActiveModule("dashboard");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#05070B" }}>
        <StatusBar style="light" />
        {authStatus === "signedIn" ? (
          <AppShell
            activeModule={active}
            onSelectModule={setActiveModule}
            onSignOut={handleSignOut}
            profile={profile}
          />
        ) : (
          <AuthFlow
            authStatus={authStatus}
            onAuthenticated={handleAuthenticated}
            onAuthStatusChange={setAuthStatus}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
