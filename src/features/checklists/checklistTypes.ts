export const CHECKLIST_STORE_VERSION = 1;
export const DEMO_CHECKLIST_NOTICE = "Demonstration checklist \u2014 not approved operational guidance.";

export type ChecklistApprovalStatus = "approved" | "draft" | "expired" | "review-required";

export type ChecklistItemDefinition = { id: string; label: string };
export type ChecklistSectionDefinition = { id: string; items: ChecklistItemDefinition[]; title: string };

export type ChecklistDefinition = {
  approvalStatus: ChecklistApprovalStatus;
  expiresAt: string;
  id: string;
  jurisdiction: string;
  reviewedAt: string;
  sections: ChecklistSectionDefinition[];
  source: string;
  sourceUrl?: string;
  title: string;
  version: string;
};

export type ChecklistInstance = {
  archivedAt: string | null;
  checklistDefinitionId: string;
  completedAt: string | null;
  createdAt: string;
  id: string;
  notes: string;
  revision: number;
  selectedItems: string[];
  updatedAt: string;
};

export type ChecklistStore = { instances: ChecklistInstance[]; userId: string; version: typeof CHECKLIST_STORE_VERSION };
