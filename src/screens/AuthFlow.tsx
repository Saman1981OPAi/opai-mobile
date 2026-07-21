import { useMemo, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { consentItems, emptyConsentState } from "@/data/authMock";
import { colors, layout, radius, shadows, spacing, typography } from "@/theme/tokens";
import type { AuthStatus, ConsentKey, ConsentState, MockUserProfile } from "@/types/auth";

type AuthScreen =
  | "welcome"
  | "signIn"
  | "createAccount"
  | "consent"
  | "success";

type AuthFlowProps = {
  authStatus: AuthStatus;
  onAuthenticated: (profile: MockUserProfile) => void;
  onAuthStatusChange: (status: AuthStatus) => void;
  onRegister: (email: string, password: string, displayName: string) => Promise<MockUserProfile>;
  onSignIn: (email: string, password: string) => Promise<MockUserProfile>;
};

export function AuthFlow({ authStatus, onAuthenticated, onAuthStatusChange, onRegister, onSignIn }: AuthFlowProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= layout.tabletBreakpoint;
  const [screen, setScreen] = useState<AuthScreen>("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("Officer");
  const [pendingProfile, setPendingProfile] = useState<MockUserProfile | null>(null);
  const [consent, setConsent] = useState<ConsentState>(emptyConsentState);
  const [authError, setAuthError] = useState("");
  const [loadingAction, setLoadingAction] = useState<"account" | "signin" | null>(null);

  const allConsentAccepted = useMemo(
    () => Object.values(consent).every(Boolean),
    [consent]
  );

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

  const beginVerification = async () => {
    if (!isValidEmail(email)) {
      setAuthError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setAuthError("Enter your password (at least 8 characters). ");
      return;
    }

    setAuthError("");
    onAuthStatusChange("signingIn");
    setLoadingAction("signin");
    try {
      setPendingProfile(await onSignIn(email.trim(), password));
      onAuthStatusChange("onboardingRequired");
      setScreen("consent");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Sign in failed.");
      onAuthStatusChange("signedOut");
    } finally {
      setLoadingAction(null);
    }
  };

  const beginCreateAccount = async () => {
    if (!isValidEmail(email)) {
      setAuthError("Enter a valid email address.");
      return;
    }
    if (displayName.trim().length < 2) {
      setAuthError("Enter your name.");
      return;
    }
    if (password.length < 12) {
      setAuthError("Use a password with at least 12 characters.");
      return;
    }

    setAuthError("");
    onAuthStatusChange("signingIn");
    setLoadingAction("account");
    try {
      setPendingProfile(await onRegister(email.trim(), password, displayName.trim()));
      onAuthStatusChange("onboardingRequired");
      setScreen("consent");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Account creation failed.");
      onAuthStatusChange("signedOut");
    } finally {
      setLoadingAction(null);
    }
  };

  const completeConsent = () => {
    if (!allConsentAccepted) {
      setAuthError("Accept every required consent item before entering OPAi Police.");
      return;
    }

    if (!pendingProfile) {
      setAuthError("Your secure session is no longer available. Sign in again.");
      setScreen("signIn");
      return;
    }

    setAuthError("");
    setScreen("success");
  };

  const enterApp = () => {
    if (!pendingProfile) {
      setAuthError("Sign in again to continue.");
      setScreen("signIn");
      return;
    }
    onAuthenticated({
      ...pendingProfile,
      biometricEnabled: false,
      email,
      privacyConsentAccepted: consent.privacy,
      termsAccepted: consent.terms
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.page, isTablet ? styles.pageTablet : null]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.authCard, isTablet ? styles.authCardTablet : null]}>
        <BrandIntro compact={screen !== "welcome"} />

        {screen === "welcome" ? (
          <WelcomeScreen
            onCreateAccount={() => setScreen("createAccount")}
            onSignIn={() => setScreen("signIn")}
          />
        ) : null}

        {screen === "signIn" ? (
          <SignInScreen
            email={email}
            onBack={() => setScreen("welcome")}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSignIn={beginVerification}
            password={password}
            error={authError}
            loading={loadingAction === "signin"}
          />
        ) : null}

        {screen === "createAccount" ? (
          <CreateAccountScreen
            email={email}
            error={authError}
            loading={loadingAction === "account"}
            onBack={() => setScreen("welcome")}
            onEmailChange={setEmail}
            displayName={displayName}
            onDisplayNameChange={setDisplayName}
            onPasswordChange={setPassword}
            password={password}
            onSubmit={beginCreateAccount}
          />
        ) : null}

        {screen === "consent" ? (
          <ConsentScreen
            allConsentAccepted={allConsentAccepted}
            consent={consent}
            error={authError}
            onBack={() => setScreen("welcome")}
            onContinue={completeConsent}
            onToggle={(key) => setConsent((current) => ({ ...current, [key]: !current[key] }))}
          />
        ) : null}

        {screen === "success" ? (
          <SuccessScreen onEnterApp={enterApp} />
        ) : null}

      </View>
    </ScrollView>
  );
}

function BrandIntro({ compact }: { compact: boolean }) {
  return (
    <View style={[styles.brand, compact ? styles.brandCompact : null]}>
      <View style={styles.brandMark}>
        <MaterialCommunityIcons name="shield-check-outline" size={36} color={colors.primaryBlue} />
      </View>
      <View style={styles.brandCopy}>
        <Text style={styles.brandTitle}>OPAi Police</Text>
        <Text style={styles.brandSub}>Secure account access</Text>
      </View>
    </View>
  );
}

function WelcomeScreen({
  onCreateAccount,
  onSignIn
}: {
  onCreateAccount: () => void;
  onSignIn: () => void;
}) {
  return (
    <View style={styles.stack}>
      <Text style={styles.heroTitle}>Secure access, built carefully.</Text>
      <Text style={styles.heroSub}>Sign in to your OPAi Police account.</Text>
      <View style={styles.buttonStack}>
        <PrimaryButton label="Sign In" onPress={onSignIn}>
          <Ionicons name="log-in-outline" size={22} color={colors.textPrimary} />
        </PrimaryButton>
        <SecondaryButton label="Create Account" onPress={onCreateAccount}>
          <Ionicons name="person-add-outline" size={20} color={colors.primaryBlue} />
        </SecondaryButton>
      </View>
      <DisclaimerBanner message="Use only information you are authorized to process. OPAi Police does not replace official police systems or service policy." />
    </View>
  );
}

function SignInScreen({
  email,
  error,
  loading,
  onBack,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  password
}: {
  email: string;
  error: string;
  loading: boolean;
  onBack: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSignIn: () => void;
  password: string;
}) {
  return (
    <View style={styles.stack}>
      <ScreenHeading icon="lock-outline" title="Sign In" subtitle="Secure OPAi Police account" />
      <Field
        autoCapitalize="none"
        icon="email-outline"
        keyboardType="email-address"
        label="Email"
        onChangeText={onEmailChange}
        value={email}
      />
      <Field icon="key-outline" label="Password" onChangeText={onPasswordChange} placeholder="Password" secureTextEntry value={password} />
      {error ? <ErrorText message={error} /> : null}
      <PrimaryButton label="Continue" loading={loading} onPress={onSignIn}>
        <Ionicons name="arrow-forward" size={22} color={colors.textPrimary} />
      </PrimaryButton>
      <TextButton label="Back" onPress={onBack} />
    </View>
  );
}

function CreateAccountScreen({
  displayName,
  email,
  error,
  loading,
  onBack,
  onDisplayNameChange,
  onEmailChange,
  onPasswordChange,
  password,
  onSubmit
}: {
  displayName: string;
  email: string;
  error: string;
  loading: boolean;
  onBack: () => void;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  password: string;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.stack}>
      <ScreenHeading icon="account-plus-outline" title="Create Account" subtitle="Secure OPAi Police account" />
      <Field icon="account-outline" label="Display Name" onChangeText={onDisplayNameChange} value={displayName} />
      <Field
        autoCapitalize="none"
        icon="email-outline"
        keyboardType="email-address"
        label="Email"
        onChangeText={onEmailChange}
        value={email}
      />
      <Field icon="key-outline" label="Password" onChangeText={onPasswordChange} placeholder="12 or more characters" secureTextEntry value={password} />
      {error ? <ErrorText message={error} /> : null}
      <PrimaryButton label="Create Account" loading={loading} onPress={onSubmit}>
        <Ionicons name="checkmark-circle-outline" size={22} color={colors.textPrimary} />
      </PrimaryButton>
      <TextButton label="Back" onPress={onBack} />
    </View>
  );
}

function ConsentScreen({
  allConsentAccepted,
  consent,
  error,
  onBack,
  onContinue,
  onToggle
}: {
  allConsentAccepted: boolean;
  consent: ConsentState;
  error: string;
  onBack: () => void;
  onContinue: () => void;
  onToggle: (key: ConsentKey) => void;
}) {
  return (
    <View style={styles.stack}>
      <ScreenHeading icon="file-check-outline" title="Review Consent" subtitle="Required before entering OPAi Police." />
      <View style={styles.consentStack}>
        {consentItems.map((item) => (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consent[item.key] }}
            key={item.key}
            onPress={() => onToggle(item.key)}
            style={({ pressed }) => [
              styles.consentRow,
              consent[item.key] ? styles.consentRowActive : null,
              pressed ? styles.pressed : null
            ]}
          >
            <Ionicons
              name={consent[item.key] ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={consent[item.key] ? colors.ptsdGreen : colors.textMuted}
            />
            <View style={styles.consentCopy}>
              <Text style={styles.consentTitle}>{item.title}</Text>
              <Text style={styles.consentDescription}>{item.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <PrimaryButton label={allConsentAccepted ? "Accept & Continue" : "Accept All Required Items"} onPress={onContinue}>
        <Ionicons name="checkmark-done-outline" size={22} color={colors.textPrimary} />
      </PrimaryButton>
      {error ? <ErrorText message={error} /> : null}
      {!allConsentAccepted ? (
        <Text style={styles.helperText}>All consent items are required for app access.</Text>
      ) : null}
      <TextButton label="Back" onPress={onBack} />
    </View>
  );
}

function SuccessScreen({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <View style={styles.stack}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark" size={42} color={colors.background} />
      </View>
      <ScreenHeading icon="shield-check-outline" title="Account Ready" subtitle="Your secure sign-in is complete." />
      <PrimaryButton label="Enter OPAi" onPress={onEnterApp}>
        <MaterialCommunityIcons name="shield-check-outline" size={22} color={colors.textPrimary} />
      </PrimaryButton>
    </View>
  );
}

function ScreenHeading({
  icon,
  subtitle,
  title
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  subtitle: string;
  title: string;
}) {
  return (
    <View style={styles.headingRow}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.primaryBlue} />
      <View style={styles.headingCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

function Field({
  icon,
  label,
  ...inputProps
}: {
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  keyboardType?: "default" | "email-address" | "number-pad";
  label: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.primaryBlue} />
      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primaryBlue}
          style={styles.input}
          {...inputProps}
        />
      </View>
    </View>
  );
}

function ErrorText({ message }: { message: string }) {
  return (
    <View accessibilityRole="alert" style={styles.errorBox}>
      <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.textButtonControl, pressed ? styles.pressed : null]}
    >
      <Text style={styles.textButton}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  authCard: {
    ...shadows.card,
    backgroundColor: "rgba(7,23,42,0.84)",
    borderColor: "rgba(77,163,255,0.26)",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.md,
    width: "100%"
  },
  authCardTablet: {
    maxWidth: 640
  },
  biometricOrb: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(10,132,255,0.12)",
    borderColor: colors.primaryBlue,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 104,
    justifyContent: "center",
    width: 104
  },
  brand: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  brandCompact: {
    paddingBottom: spacing.xs
  },
  brandCopy: {
    flex: 1
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.10)",
    borderColor: "rgba(127,255,212,0.32)",
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  brandSub: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "700"
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: typography.h1,
    fontWeight: "700"
  },
  buttonStack: {
    gap: spacing.sm
  },
  consentCopy: {
    flex: 1,
    gap: spacing.xs
  },
  consentDescription: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20
  },
  consentRow: {
    alignItems: "flex-start",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  consentRowActive: {
    backgroundColor: "rgba(127,255,212,0.09)",
    borderColor: "rgba(127,255,212,0.42)"
  },
  consentStack: {
    gap: spacing.sm
  },
  consentTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "700"
  },
  field: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 62,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  fieldCopy: {
    flex: 1
  },
  fieldGrid: {
    gap: spacing.sm
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  errorBox: {
    alignItems: "flex-start",
    backgroundColor: "rgba(255,209,102,0.10)",
    borderColor: "rgba(255,209,102,0.35)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.base
  },
  errorText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20
  },
  headingCopy: {
    flex: 1
  },
  headingRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.small,
    textAlign: "center"
  },
  heroSub: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: "700",
    lineHeight: 34
  },
  inlineActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "center"
  },
  input: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: "700",
    margin: 0,
    padding: 0
  },
  page: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.md
  },
  pageTablet: {
    paddingVertical: spacing.xxl
  },
  pressed: {
    opacity: 0.74,
    transform: [{ translateY: 1 }]
  },
  sectionSub: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: "700"
  },
  stack: {
    gap: spacing.md
  },
  statusBadge: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(127,255,212,0.08)",
    borderColor: "rgba(127,255,212,0.28)",
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  successIcon: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.ptsdGreen,
    borderRadius: radius.full,
    height: 76,
    justifyContent: "center",
    width: 76
  },
  testingPill: {
    backgroundColor: "rgba(127,255,212,0.10)",
    borderColor: "rgba(127,255,212,0.34)",
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  testingPillText: {
    color: colors.ptsdGreen,
    fontSize: typography.caption,
    fontWeight: "700"
  },
  textButton: {
    color: colors.accentBlue,
    fontSize: typography.small,
    fontWeight: "700",
    textAlign: "center"
  },
  textButtonControl: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: spacing.md
  }
});
