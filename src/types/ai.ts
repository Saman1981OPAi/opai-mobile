import type { MciIcon } from "@/data/uiMockups";

export type AICategoryId =
  | "general"
  | "report_review"
  | "incident_summary"
  | "follow_up"
  | "court"
  | "calendar"
  | "training"
  | "translation"
  | "legal_reference_placeholder"
  | "policy_placeholder"
  | "wellness";

export type AIPromptClassification =
  | "general"
  | "incident"
  | "report"
  | "court"
  | "calendar"
  | "training"
  | "translation"
  | "legal_reference_placeholder"
  | "wellness"
  | "unsupported";

export type AICategory = {
  id: AICategoryId;
  label: string;
  shortLabel: string;
  description: string;
  icon: MciIcon;
  placeholderOnly?: boolean;
  wellnessOnly?: boolean;
};

export type AISuggestedAction = {
  id: string;
  category: AICategoryId;
  icon: MciIcon;
  title: string;
  subtitle: string;
  prompt: string;
};

export type AIConversation = {
  id: string;
  category: AICategoryId;
  prompt: string;
  mockResponse: string;
  relatedIncidentId?: string;
  relatedNoteId?: string;
  createdAt: string;
  updatedAt: string;
};

export type AIPreferences = {
  lastSelectedCategory: AICategoryId;
  saveHistory: boolean;
  lastUpdatedAt: string;
};
