export type PaidDutyStatus = "upcoming" | "completed";

export type PaidDuty = {
  id: string;
  title: string;
  organization?: string;
  dutyType?: string;
  location: string;
  date: string;
  startTime: string;
  endTime?: string;
  timezone: string;
  contactName?: string;
  contactPhone?: string;
  compensationRate?: string;
  referenceNumber?: string;
  equipmentNotes?: string;
  notes?: string;
  reminderOffsets: number[];
  notificationIds: string[];
  status: PaidDutyStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaidDutyDraft = Omit<PaidDuty, "createdAt" | "id" | "notificationIds" | "status" | "updatedAt">;
