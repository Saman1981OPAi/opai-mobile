import type { LocalIncidentDraft } from "@/storage/storageTypes";

export function createReportFromToolText(text: string, sourceLabel: string): LocalIncidentDraft {
  const now = new Date();
  const iso = now.toISOString();
  return {
    attachmentMetadata: [],
    attachments: [],
    createdAt: iso,
    date: iso.slice(0, 10),
    followUpRequired: false,
    id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    incidentNotes: {
      disclosureNotes: "",
      followUpNotes: "",
      narrativeDraft: text,
      observations: "",
      officerNotes: ""
    },
    incidentType: "Other",
    involvedPersons: [],
    location: "",
    notes: `Created from ${sourceLabel}.`,
    occurrenceCategory: "General",
    personsInvolved: [],
    priority: "Medium",
    status: "draft",
    time: now.toLocaleTimeString("en-CA", { hour: "2-digit", hour12: false, minute: "2-digit" }),
    updatedAt: iso,
    witnesses: [],
    witnessDetails: []
  };
}

export function appendToolTextToReport(report: LocalIncidentDraft, text: string) {
  const existing = report.incidentNotes.narrativeDraft.trim();
  return {
    ...report,
    incidentNotes: {
      ...report.incidentNotes,
      narrativeDraft: existing ? `${existing}\n\n${text}` : text
    },
    updatedAt: new Date().toISOString()
  };
}

