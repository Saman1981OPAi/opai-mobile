export type AuthStatus =
  | "signedOut"
  | "signingIn"
  | "signedIn"
  | "onboardingRequired"
  | "biometricPrompt"
  | "passwordResetRequested";

export type ConsentKey =
  | "terms"
  | "privacy"
  | "aiDisclaimer"
  | "aiProcessing"
  | "ptsdDisclaimer"
  | "translationDisclaimer"
  | "prototypeDisclaimer";

export type ConsentState = Record<ConsentKey, boolean>;
export type ConsentAcceptedAt = Partial<Record<ConsentKey, string>>;

export type NotificationPreferences = {
  courtReminders: boolean;
  trainingReminders: boolean;
  shiftReminders: boolean;
  wellnessReminders: boolean;
};

export type MockUserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  preferredLanguage: string;
  biometricEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  privacyConsentAccepted: boolean;
  termsAccepted: boolean;
};
