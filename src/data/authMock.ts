import type { ConsentKey, ConsentState, MockUserProfile } from "@/types/auth";

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
    description: "OPAi Police is a productivity and AI assistance tool."
  },
  {
    key: "privacy",
    title: "Privacy Policy",
    description:
      "OPAi Police is not a replacement for official police systems, supervision, service policy, legal advice, medical advice, or professional judgment."
  },
  {
    key: "aiDisclaimer",
    title: "AI Disclaimer",
    description: "AI-generated responses may be incomplete or inaccurate and must be verified."
  },
  {
    key: "ptsdDisclaimer",
    title: "PTSD Awareness Disclaimer",
    description:
      "PTSD awareness content is educational only and is not medical diagnosis, treatment, therapy, or crisis intervention."
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
