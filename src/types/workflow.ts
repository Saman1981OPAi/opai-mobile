import type { MciIcon } from "@/data/uiMockups";
import type { NotificationLeadTime } from "@/types/notifications";

export type CalendarWorkflowType =
  | "Court"
  | "Training"
  | "Requalification"
  | "Follow-up"
  | "Meeting"
  | "Shift"
  | "General";

export type CalendarWorkflowStatus = "upcoming" | "completed" | "cancelled";
export type CourtWorkflowStatus = "upcoming" | "completed" | "adjourned" | "cancelled";
export type TrainingWorkflowStatus = "upcoming" | "completed" | "cancelled";
export type RequalificationWorkflowStatus = "valid" | "dueSoon" | "overdue" | "completed";
export type FollowUpWorkflowStatus = "open" | "completed" | "overdue";
export type FollowUpPriority = "low" | "medium" | "high";

export type TrainingCategory =
  | "Firearms"
  | "Use of Force"
  | "CEW"
  | "CPR / First Aid"
  | "Scenario Training"
  | "Policy Training"
  | "Other";

export type RequalificationCategory =
  | "Annual Firearms Qualification"
  | "Use of Force Requalification"
  | "CEW Requalification"
  | "CPR / First Aid Renewal"
  | "Driver Training"
  | "Other";

export type BaseLocalWorkflow = {
  id: string;
  createdAt: string;
  updatedAt: string;
  reminderEnabled: boolean;
  reminderLeadTime: NotificationLeadTime;
};

export type CalendarWorkflowEvent = BaseLocalWorkflow & {
  date: string;
  location: string;
  notes: string;
  status: CalendarWorkflowStatus;
  time: string;
  title: string;
  type: CalendarWorkflowType;
};

export type CourtWorkflowEvent = BaseLocalWorkflow & {
  courtName: string;
  courtroom: string;
  date: string;
  fileReference: string;
  location: string;
  matterName: string;
  notes: string;
  status: CourtWorkflowStatus;
  time: string;
};

export type TrainingWorkflowEvent = BaseLocalWorkflow & {
  category: TrainingCategory;
  date: string;
  instructorOrUnit: string;
  location: string;
  notes: string;
  status: TrainingWorkflowStatus;
  time: string;
  title: string;
};

export type RequalificationWorkflowReminder = BaseLocalWorkflow & {
  category: RequalificationCategory;
  dueDate: string;
  expiryDate: string;
  notes: string;
  status: RequalificationWorkflowStatus;
  title: string;
};

export type FollowUpWorkflowReminder = BaseLocalWorkflow & {
  dueDate: string;
  notes: string;
  priority: FollowUpPriority;
  relatedIncidentId: string;
  status: FollowUpWorkflowStatus;
  title: string;
};

export type WorkflowSummaryItem = {
  accent: string;
  icon: MciIcon;
  id: string;
  meta: string;
  status: string;
  subtitle: string;
  title: string;
};

