import type { LocalIncidentDraft } from "@/storage/storageTypes";
import type { IncidentAttachmentType, IncidentDraftStatus, IncidentPriority, IncidentRole } from "@/types/incident";

export const incidentTypes = [
  "Assault",
  "Domestic Incident",
  "Theft",
  "Fraud",
  "Mischief",
  "Impaired Driving",
  "Traffic Stop",
  "Mental Health Call",
  "Missing Person",
  "Suspicious Person",
  "Property Damage",
  "Neighbour Dispute",
  "Other"
] as const;

export const occurrenceCategories = ["Person", "Property", "Traffic", "Wellness", "Public Safety", "General"] as const;
export const incidentPriorities: IncidentPriority[] = ["Low", "Medium", "High", "Urgent"];
export const incidentStatuses: IncidentDraftStatus[] = ["draft", "inReview", "followUpRequired", "reviewed", "archived"];
export const personRoles: IncidentRole[] = ["Complainant", "Victim", "Suspect", "Witness", "Officer", "Other"];
export const attachmentTypes: IncidentAttachmentType[] = ["Photo", "Video", "Audio", "Document", "Other"];
export const followUpTaskOptions = [
  "Victim callback",
  "Witness statement",
  "CCTV follow-up",
  "Supplementary notes",
  "Court preparation",
  "Supervisor review",
  "Other"
] as const;

export type IncidentDraftFilter = "All" | "Draft" | "Follow-up Required" | "Reviewed" | "Archived";

export const incidentWorkflowService = {
  statusLabel(status: IncidentDraftStatus) {
    const labels: Record<IncidentDraftStatus, string> = {
      archived: "Archived",
      draft: "Draft",
      followUpRequired: "Follow-up Required",
      inReview: "In Review",
      reviewed: "Reviewed"
    };

    return labels[status];
  },

  calculateCompleteness(draft: LocalIncidentDraft) {
    const checks = [
      Boolean(draft.incidentType.trim()),
      Boolean(draft.date.trim()),
      Boolean(draft.time.trim()),
      Boolean(draft.location.trim()),
      draft.personsInvolved.length > 0,
      draft.witnessDetails.length > 0 || draft.incidentNotes.officerNotes.trim().length > 0,
      draft.incidentNotes.narrativeDraft.trim().length > 0,
      draft.attachmentMetadata.length > 0
    ];
    const complete = checks.filter(Boolean).length;

    return {
      complete,
      percent: Math.round((complete / checks.length) * 100),
      total: checks.length
    };
  },

  filterDrafts(drafts: LocalIncidentDraft[], filter: IncidentDraftFilter, search: string) {
    const normalizedSearch = search.trim().toLowerCase();

    return drafts
      .filter((draft) => {
        if (filter === "All") return true;
        if (filter === "Draft") return draft.status === "draft" || draft.status === "inReview";
        if (filter === "Follow-up Required") return draft.followUpRequired || draft.status === "followUpRequired";
        if (filter === "Reviewed") return draft.status === "reviewed";
        return draft.status === "archived";
      })
      .filter((draft) => {
        if (!normalizedSearch) return true;
        return `${draft.incidentType} ${draft.location} ${draft.occurrenceCategory} ${draft.status}`
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  buildAiReadyPreview(draft: LocalIncidentDraft) {
    return {
      attachmentCount: draft.attachmentMetadata.length,
      basics: {
        date: draft.date,
        incidentType: draft.incidentType,
        location: draft.location,
        occurrenceCategory: draft.occurrenceCategory,
        priority: draft.priority,
        status: draft.status,
        time: draft.time
      },
      notes: draft.incidentNotes,
      personCount: draft.personsInvolved.length,
      warning: "AI review is not connected in this testing version. Future versions may assist with summaries, report structure, and follow-up suggestions. Users must verify all AI-generated content.",
      witnessCount: draft.witnessDetails.length
    };
  },

  createReviewSummary(draft: LocalIncidentDraft) {
    const completeness = incidentWorkflowService.calculateCompleteness(draft);
    return `${draft.incidentType} - ${draft.location || "No location"} - ${completeness.percent}% complete - ${incidentWorkflowService.statusLabel(draft.status)}`;
  }
};

