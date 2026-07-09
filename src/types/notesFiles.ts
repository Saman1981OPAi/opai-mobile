import type { MciIcon } from "@/data/uiMockups";

export type LocalNoteCategory =
  | "General Note"
  | "Incident Note"
  | "Court Note"
  | "Training Note"
  | "Follow-Up Note"
  | "AI Assistant Note"
  | "Translation Note"
  | "Start My Shift Note"
  | "Other";

export type LocalFileMetadataCategory =
  | "Photo Metadata"
  | "Video Metadata"
  | "Audio Metadata"
  | "Document Metadata"
  | "Court Document Placeholder"
  | "Training Document Placeholder"
  | "Translation Document Placeholder"
  | "Other";

export type LocalLinkedItemType =
  | "incident"
  | "ai"
  | "translation"
  | "calendar"
  | "court"
  | "training"
  | "requalification"
  | "followUp";

export type LocalNoteFolder = {
  id: string;
  name: string;
  description?: string | undefined;
  icon?: MciIcon | undefined;
  color?: string | undefined;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LocalStructuredNote = {
  id: string;
  title: string;
  body: string;
  category: LocalNoteCategory;
  tags: string[];
  folderId?: string | undefined;
  linkedIncidentId?: string | undefined;
  linkedAIConversationId?: string | undefined;
  linkedTranslationRecordId?: string | undefined;
  linkedCalendarEventId?: string | undefined;
  linkedCourtEventId?: string | undefined;
  linkedTrainingEventId?: string | undefined;
  linkedRequalificationId?: string | undefined;
  linkedFollowUpId?: string | undefined;
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LocalFileMetadataPlaceholder = {
  id: string;
  fileName: string;
  fileType: "photo" | "video" | "audio" | "document" | "other";
  description: string;
  category: LocalFileMetadataCategory;
  linkedIncidentId?: string | undefined;
  linkedNoteId?: string | undefined;
  linkedCourtEventId?: string | undefined;
  linkedTrainingEventId?: string | undefined;
  linkedTranslationRecordId?: string | undefined;
  createdAt: string;
  updatedAt: string;
  metadataOnly: true;
};

export type NotesFilesFilters = {
  search: string;
  category: LocalNoteCategory | "All";
  folderId: string | "All";
  linkedType: LocalLinkedItemType | "All";
  pinnedOnly: boolean;
  showArchived: boolean;
};

export type LocalLinkedItemSummary = {
  id: string;
  type: LocalLinkedItemType;
  title: string;
  subtitle: string;
  icon: MciIcon;
};
