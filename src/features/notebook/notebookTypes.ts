export const NOTEBOOK_SCHEMA_VERSION = 1;

export type NotebookRetention = "7-days" | "30-days" | "until-deleted";

export type ShiftNotebookEntry = {
  archivedAt: string | null;
  attachmentIds: string[];
  body: string;
  createdAt: string;
  followUp: boolean;
  id: string;
  retention: NotebookRetention;
  title: string;
  updatedAt: string;
};

export type NotebookStore = {
  entries: ShiftNotebookEntry[];
  userId: string;
  version: typeof NOTEBOOK_SCHEMA_VERSION;
};
