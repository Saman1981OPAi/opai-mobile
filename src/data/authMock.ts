import type { ConsentKey, ConsentState, MockUserProfile } from "@/types/auth";
import { requiredDisclaimers } from "@/data/compliance";

export const emptyConsentState: ConsentState = {
  aiDisclaimer: false,
  privacy: false,
  ptsdDisclaimer: false,
  terms: false
};

export const consentItems: Array<{ key: ConsentKey; title: string; description: string }> = [
  {
    key: "terms",
    title: "Terms of Use",
    description: requiredDisclaimers[0]
  },
  {
    key: "privacy",
    title: "Privacy Policy",
    description: requiredDisclaimers[1]
  },
  {
    key: "aiDisclaimer",
    title: "AI Disclaimer",
    description: requiredDisclaimers[2]
  },
  {
    key: "ptsdDisclaimer",
    title: "PTSD Awareness Disclaimer",
    description: requiredDisclaimers[3]
  }
];

export const mockUserProfile: MockUserProfile = {
  biometricEnabled: false,
  email: "officer@example.ca",
  firstName: "Sam",
  lastName: "Officer",
  notificationPreferences: {
    courtReminders: true,
    shiftReminders: true,
    trainingReminders: true,
    wellnessReminders: true
  },
  preferredLanguage: "English",
  privacyConsentAccepted: true,
  role: "Canadian Police Officer",
  termsAccepted: true,
  userId: "mock-opai-user-001"
};
