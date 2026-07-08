import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppShell } from "@/components/AppShell";
import { emptyConsentState } from "@/data/authMock";
import { modules } from "@/data/modules";
import { AuthFlow } from "@/screens/AuthFlow";
import { persistenceService } from "@/storage/persistenceService";
import { createDefaultLocalAppData } from "@/storage/seedDataService";
import type { LocalAppData } from "@/storage/storageTypes";
import { colors, spacing, typography } from "@/theme/tokens";
import type { AuthStatus, MockUserProfile } from "@/types/auth";
import type { ModuleId } from "@/types/navigation";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [authStatus, setAuthStatus] = useState<AuthStatus>("signedOut");
  const [localData, setLocalData] = useState<LocalAppData | null>(null);
  const [profile, setProfile] = useState<MockUserProfile | null>(null);

  const active = useMemo(
    () => modules.find((module) => module.id === activeModule) ?? modules[0]!,
    [activeModule]
  );

  useEffect(() => {
    let mounted = true;

    persistenceService.loadOrSeed().then((data) => {
      if (!mounted) {
        return;
      }

      setLocalData(data);
      if (data.auth.status === "signedIn" && data.auth.profile) {
        setProfile(data.auth.profile);
        setAuthStatus("signedIn");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const updateLocalData = (updater: (current: LocalAppData) => LocalAppData) => {
    setLocalData((current) => {
      const base = current ?? createDefaultLocalAppData();
      const next = updater(base);
      persistenceService.save(next);
      return next;
    });
  };

  const handleAuthenticated = (nextProfile: MockUserProfile) => {
    setProfile(nextProfile);
    setAuthStatus("signedIn");
    setActiveModule("dashboard");
    updateLocalData((current) => ({
      ...current,
      auth: {
        ...current.auth,
        biometricPreference: nextProfile.biometricEnabled ? "deviceBiometrics" : current.auth.biometricPreference,
        consent: {
          aiDisclaimer: true,
          privacy: true,
          ptsdDisclaimer: true,
          terms: true
        },
        lastSignedInAt: new Date().toISOString(),
        notificationPreferences: nextProfile.notificationPreferences,
        profile: nextProfile,
        status: "signedIn"
      },
      preferences: {
        ...current.preferences,
        biometricEnabled: nextProfile.biometricEnabled,
        consentStatus: {
          aiDisclaimer: true,
          privacy: true,
          ptsdDisclaimer: true,
          terms: true
        },
        preferredLanguage: nextProfile.preferredLanguage
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSignOut = () => {
    setProfile(null);
    setAuthStatus("signedOut");
    setActiveModule("dashboard");
    updateLocalData((current) => ({
      ...current,
      auth: {
        ...current.auth,
        profile: null,
        status: "signedOut"
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleResetDemoData = async () => {
    const seeded = await persistenceService.resetDemoData(localData?.auth);
    setLocalData(seeded);
    if (seeded.auth.status === "signedIn" && seeded.auth.profile) {
      setAuthStatus("signedIn");
      setProfile(seeded.auth.profile);
    }
  };

  const handleClearLocalData = async () => {
    await persistenceService.clearAll();
    const seeded = createDefaultLocalAppData({
      biometricPreference: "disabled",
      consent: emptyConsentState,
      lastSignedInAt: null,
      notificationPreferences: {
        courtReminders: true,
        shiftReminders: true,
        trainingReminders: true,
        wellnessReminders: true
      },
      profile: null,
      status: "signedOut"
    });
    await persistenceService.save(seeded);
    setLocalData(seeded);
    setProfile(null);
    setAuthStatus("signedOut");
    setActiveModule("dashboard");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#05070B" }}>
        <StatusBar style="light" />
        {!localData ? (
          <View style={{ alignItems: "center", flex: 1, gap: spacing.md, justifyContent: "center" }}>
            <ActivityIndicator color={colors.primaryBlue} />
            <Text style={{ color: colors.textMuted, fontSize: typography.small, fontWeight: "800" }}>
              Loading local prototype data
            </Text>
          </View>
        ) : authStatus === "signedIn" ? (
          <AppShell
            activeModule={active}
            localData={localData}
            onClearLocalData={handleClearLocalData}
            onResetDemoData={handleResetDemoData}
            onSelectModule={setActiveModule}
            onSignOut={handleSignOut}
            onUpdateLocalData={updateLocalData}
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
