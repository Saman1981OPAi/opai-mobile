# Data Models

Status: Sprint 006 planning only. No production database is created.

These TypeScript-style interfaces describe planned mobile/shared contracts for future FastAPI and PostgreSQL work.

```ts
type ID = string;
type ISODateTime = string;

interface User {
  id: ID;
  email: string;
  role: "officer" | "admin" | "support";
  status: "pending_verification" | "active" | "disabled";
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

interface UserProfile {
  userId: ID;
  firstName: string;
  lastName: string;
  preferredLanguage: string;
  biometricEnabled: boolean;
  notificationPreferences: Record<string, boolean>;
}

interface UserConsent {
  id: ID;
  userId: ID;
  type: "terms" | "privacy" | "ai_disclaimer" | "ptsd_disclaimer";
  version: string;
  acceptedAt: ISODateTime;
}

interface AuthSession {
  id: ID;
  userId: ID;
  deviceId?: string;
  createdAt: ISODateTime;
  expiresAt: ISODateTime;
  revokedAt?: ISODateTime;
}

interface Reminder {
  id: ID;
  userId: ID;
  title: string;
  category: "court" | "training" | "shift" | "follow_up" | "wellness";
  dueAt?: ISODateTime;
  priority: "low" | "normal" | "high";
  completedAt?: ISODateTime;
}

interface ShiftReminder {
  id: ID;
  title: string;
  description: string;
  isMandatory: false;
}

interface ShiftSession {
  id: ID;
  userId: ID;
  startedAt: ISODateTime;
  endedAt?: ISODateTime;
  status: "started" | "ready" | "dismissed";
}

interface Incident {
  id: ID;
  userId: ID;
  type: string;
  occurredAt: ISODateTime;
  locationText?: string;
  notes?: string;
  status: "draft" | "review" | "archived";
  createdAt: ISODateTime;
}

interface IncidentPerson {
  id: ID;
  incidentId: ID;
  role: "involved" | "witness" | "other";
  displayName: string;
  notes?: string;
}

interface IncidentAttachment {
  id: ID;
  incidentId: ID;
  fileId: ID;
  kind: "photo" | "audio" | "document" | "other";
  createdAt: ISODateTime;
}

interface AIConversation {
  id: ID;
  userId: ID;
  context: "general" | "incident" | "translation" | "court" | "training";
  createdAt: ISODateTime;
}

interface AIMessage {
  id: ID;
  conversationId: ID;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: ISODateTime;
  verifiedByUser?: boolean;
}

interface TranslationRecord {
  id: ID;
  userId: ID;
  sourceLanguage?: string;
  targetLanguage: string;
  sourceType: "text" | "voice" | "document" | "camera";
  sourceText?: string;
  translatedText?: string;
  createdAt: ISODateTime;
}

interface CalendarEvent {
  id: ID;
  userId: ID;
  title: string;
  startsAt: ISODateTime;
  endsAt?: ISODateTime;
  source: "manual" | "synced";
}

interface CourtEvent {
  id: ID;
  userId: ID;
  matterLabel?: string;
  courtLocation?: string;
  startsAt: ISODateTime;
  notes?: string;
}

interface TrainingEvent {
  id: ID;
  userId: ID;
  title: string;
  startsAt: ISODateTime;
  completionStatus: "scheduled" | "complete" | "overdue";
}

interface RequalificationReminder {
  id: ID;
  userId: ID;
  qualificationType: string;
  dueAt: ISODateTime;
  priority: "normal" | "high";
}

interface Note {
  id: ID;
  userId: ID;
  title: string;
  body: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

interface FileMetadata {
  id: ID;
  userId: ID;
  filename: string;
  contentType: string;
  sizeBytes: number;
  storageKey: string;
  createdAt: ISODateTime;
}

interface Notification {
  id: ID;
  userId: ID;
  title: string;
  body: string;
  category: "court" | "training" | "shift" | "follow_up" | "system";
  readAt?: ISODateTime;
  createdAt: ISODateTime;
}

interface AuditLog {
  id: ID;
  actorUserId?: ID;
  action: string;
  resourceType: string;
  resourceId?: ID;
  ipHash?: string;
  createdAt: ISODateTime;
}
```

## Modeling Notes

- Use UUIDs or equivalent opaque IDs.
- Keep personally identifiable data minimal.
- Keep incident and file content access tightly scoped.
- Track consent versions.
- Store AI content only where retention and deletion policies are approved.
