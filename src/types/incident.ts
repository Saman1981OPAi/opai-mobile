export type IncidentRole = "Complainant" | "Victim" | "Suspect" | "Witness" | "Officer" | "Other";

export type IncidentPriority = "Low" | "Medium" | "High" | "Urgent";

export type IncidentDraftStatus = "draft" | "inReview" | "followUpRequired" | "reviewed" | "archived";

export type IncidentAttachmentType = "Photo" | "Video" | "Audio" | "Document" | "Other";

export type IncidentPerson = {
  id: string;
  role: IncidentRole;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export type IncidentWitness = {
  id: string;
  name: string;
  contact: string;
  statementSummary: string;
  followUpRequired: boolean;
};

export type IncidentNotes = {
  officerNotes: string;
  narrativeDraft: string;
  observations: string;
  followUpNotes: string;
  disclosureNotes: string;
};

export type IncidentAttachmentMetadata = {
  id: string;
  attachmentType: IncidentAttachmentType;
  fileName: string;
  description: string;
  addedAt: string;
  notes: string;
  metadataOnly: true;
};

