export type CanvassContactResult = "Contact made" | "No answer" | "Refused" | "Vacant" | "Follow-up required" | "Other";

export type CanvassSession = {
  id: string;
  title: string;
  generalArea?: string;
  startedAt: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CanvassEntry = {
  id: string;
  sessionId: string;
  name?: string;
  address: string;
  unit?: string;
  date: string;
  time: string;
  contactResult?: CanvassContactResult;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CanvassSessionDraft = Pick<CanvassSession, "title"> & Partial<Pick<CanvassSession, "generalArea" | "notes">>;
export type CanvassEntryDraft = Omit<CanvassEntry, "createdAt" | "id" | "updatedAt">;
