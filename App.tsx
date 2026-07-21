import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppShell } from "@/components/AppShell";
import { emptyConsentState } from "@/data/authMock";
import { modules } from "@/data/modules";
import { AuthFlow } from "@/screens/AuthFlow";
import { audioStatementRepository } from "@/features/audioStatement/audioStatementRepository";
import { assistantRepository } from "@/features/assistant/assistantRepository";
import { authApi } from "@/services/api/authApi";
import { apiClient } from "@/services/api/apiClient";
import { notificationService } from "@/services/notificationService";
import { secureSession } from "@/services/api/secureSession";
import { weatherService } from "@/services/weather/weatherService";
import type { OfficerProfileResponse } from "@/services/api/apiTypes";
import { persistenceService } from "@/storage/persistenceService";
import { createDefaultLocalAppData } from "@/storage/seedDataService";
import type { LocalAppData } from "@/storage/storageTypes";
import { colors, spacing, typography } from "@/theme/tokens";
import type { AuthStatus, MockUserProfile } from "@/types/auth";
import type { ModuleId } from "@/types/navigation";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>("ai");
  const [authStatus, setAuthStatus] = useState<AuthStatus>("signedOut");
  const [localData, setLocalData] = useState<LocalAppData | null>(null);
  const [profile, setProfile] = useState<MockUserProfile | null>(null);

  const active = useMemo(
    () => modules.find((module) => module.id === activeModule) ?? modules[0]!,
    [activeModule]
  );

  useEffect(() => {
    let mounted = true;

    Promise.all([persistenceService.loadOrSeed(), authApi.restore()]).then(([data, restoredProfile]) => {
      if (!mounted) {
        return;
      }

      setLocalData(data);
      if (restoredProfile && data.auth.consent.aiProcessing) {
        const nextProfile = mapOfficerProfile(restoredProfile, data.auth.profile);
        setProfile(nextProfile);
        setAuthStatus("signedIn");
      } else if (restoredProfile) {
        void secureSession.clear();
        setLocalData({ ...data, auth: { ...data.auth, profile: null, status: "signedOut" } });
      } else if (data.auth.status === "signedIn") {
        setLocalData({ ...data, auth: { ...data.auth, profile: null, status: "signedOut" } });
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    apiClient.setSessionExpiredHandler(async () => {
      setProfile(null);
      setAuthStatus("signedOut");
      setActiveModule("ai");
      setLocalData((current) => {
        if (!current) return current;
        const next = {
          ...current,
          auth: {
            ...current.auth,
            profile: null,
            status: "signedOut" as const
          },
          updatedAt: new Date().toISOString()
        };
        void persistenceService.save(next);
        return next;
      });
    });

    return () => apiClient.setSessionExpiredHandler(null);
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
    const acceptedAt = new Date().toISOString();
    const acceptedConsent = {
      aiDisclaimer: true,
      aiProcessing: true,
      privacy: true,
      prototypeDisclaimer: true,
      ptsdDisclaimer: true,
      terms: true,
      translationDisclaimer: true
    };

    setProfile(nextProfile);
    setAuthStatus("signedIn");
    setActiveModule("ai");
    updateLocalData((current) => ({
      ...current,
      auth: {
        ...current.auth,
        biometricPreference: nextProfile.biometricEnabled ? "deviceBiometrics" : current.auth.biometricPreference,
        consent: acceptedConsent,
        consentAcceptedAt: {
          aiDisclaimer: acceptedAt,
          aiProcessing: acceptedAt,
          privacy: acceptedAt,
          prototypeDisclaimer: acceptedAt,
          ptsdDisclaimer: acceptedAt,
          terms: acceptedAt,
          translationDisclaimer: acceptedAt
        },
        lastSignedInAt: acceptedAt,
        notificationPreferences: nextProfile.notificationPreferences,
        profile: nextProfile,
        status: "signedIn"
      },
      preferences: {
        ...current.preferences,
        biometricEnabled: nextProfile.biometricEnabled,
        consentStatus: acceptedConsent,
        preferredLanguage: nextProfile.preferredLanguage
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSignOut = async () => {
    await authApi.signOut();
    setProfile(null);
    setAuthStatus("signedOut");
    setActiveModule("ai");
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
    if (profile?.userId) await assistantRepository.clearHistory(profile.userId);
    await audioStatementRepository.deleteAll(localData?.audioStatements ?? []);
    await notificationService.cancelAll().catch(() => undefined);
    const seeded = await persistenceService.resetDemoData(localData?.auth);
    setLocalData(seeded);
    if (seeded.auth.status === "signedIn" && seeded.auth.profile) {
      setAuthStatus("signedIn");
      setProfile(seeded.auth.profile);
    }
  };

  const handleClearLocalData = async () => {
    if (profile?.userId) await assistantRepository.clearUserData(profile.userId);
    await audioStatementRepository.deleteAll(localData?.audioStatements ?? []);
    await notificationService.cancelAll().catch(() => undefined);
    await secureSession.clear();
    await persistenceService.clearAll();
    await weatherService.clearLocalWeatherData();
    const seeded = createDefaultLocalAppData({
      biometricPreference: "disabled",
      consent: emptyConsentState,
      consentAcceptedAt: {},
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
    setActiveModule("ai");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#05070B" }}>
        <StatusBar style="light" />
        {!localData ? (
          <View style={{ alignItems: "center", flex: 1, gap: spacing.md, justifyContent: "center" }}>
            <ActivityIndicator accessibilityLabel="Loading OPAi Police" accessibilityRole="progressbar" color={colors.primaryBlue} />
            <Text maxFontSizeMultiplier={1.3} style={{ color: colors.textMuted, fontSize: typography.small, fontWeight: "700" }}>
              Loading OPAi Police
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
            onRegister={async (email, password, displayName) => mapOfficerProfile(await authApi.register(email, password, displayName))}
            onSignIn={async (email, password) => mapOfficerProfile(await authApi.signIn(email, password))}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function mapOfficerProfile(profile: OfficerProfileResponse, previous?: MockUserProfile | null): MockUserProfile {
  const [firstName = "Officer", ...lastNameParts] = profile.display_name.trim().split(/\s+/);
  return {
    userId: profile.id,
    firstName,
    lastName: lastNameParts.join(" ") || "",
    email: profile.email,
    role: profile.role,
    preferredLanguage: previous?.preferredLanguage ?? "English",
    biometricEnabled: previous?.biometricEnabled ?? false,
    notificationPreferences: previous?.notificationPreferences ?? {
      courtReminders: true,
      shiftReminders: true,
      trainingReminders: true,
      wellnessReminders: true
    },
    privacyConsentAccepted: previous?.privacyConsentAccepted ?? false,
    termsAccepted: previous?.termsAccepted ?? false
  };
}
