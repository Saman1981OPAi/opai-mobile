import type { LocalAppData } from "@/storage/storageTypes";
import type { AIConversation } from "@/types/ai";
import type {
  LocalFileMetadataCategory,
  LocalFileMetadataPlaceholder,
  LocalLinkedItemSummary,
  LocalLinkedItemType,
  LocalNoteCategory,
  LocalNoteFolder,
  LocalStructuredNote,
  NotesFilesFilters
} from "@/types/notesFiles";
import type { TranslationRecord } from "@/types/translation";

const nowIso = () => new Date().toISOString();
const nextId = (prefix: string) => `${prefix}-${Date.now()}`;

export const noteCategories: LocalNoteCategory[] = [
  "General Note",
  "Incident Note",
  "Court Note",
  "Training Note",
  "Follow-Up Note",
  "AI Assistant Note",
  "Translation Note",
  "Start My Shift Note",
  "Other"
];

export const fileMetadataCategories: LocalFileMetadataCategory[] = [
  "Photo Metadata",
  "Video Metadata",
  "Audio Metadata",
  "Document Metadata",
  "Court Document Placeholder",
  "Training Document Placeholder",
  "Translation Document Placeholder",
  "Other"
];

export const linkedTypeOptions: LocalLinkedItemType[] = [
  "incident",
  "ai",
  "translation",
  "calendar",
  "court",
  "training",
  "requalification",
  "followUp"
];

const noteMatchesLinkedType = (note: LocalStructuredNote, linkedType: LocalLinkedItemType) => {
  const map: Record<LocalLinkedItemType, boolean> = {
    ai: Boolean(note.linkedAIConversationId),
    calendar: Boolean(note.linkedCalendarEventId),
    court: Boolean(note.linkedCourtEventId),
    followUp: Boolean(note.linkedFollowUpId),
    incident: Boolean(note.linkedIncidentId),
    requalification: Boolean(note.linkedRequalificationId),
    training: Boolean(note.linkedTrainingEventId),
    translation: Boolean(note.linkedTranslationRecordId)
  };

  return map[linkedType];
};

const includesSearch = (values: string[], search: string) => {
  if (!search.trim()) {
    return true;
  }

  const normalized = search.trim().toLowerCase();
  return values.some((value) => value.toLowerCase().includes(normalized));
};

const sortNotes = (notes: LocalStructuredNote[]) =>
  [...notes].sort((left, right) => {
    if (left.pinned !== right.pinned) {
      return left.pinned ? -1 : 1;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });

export const notesService = {
  createBlankNote(folderId?: string): LocalStructuredNote {
    const createdAt = nowIso();

    return {
      archived: false,
      body: "",
      category: "General Note",
      createdAt,
      folderId,
      id: nextId("note"),
      pinned: false,
      tags: [],
      title: "",
      updatedAt: createdAt
    };
  },

  createBlankFolder(): LocalNoteFolder {
    const createdAt = nowIso();

    return {
      archived: false,
      color: "#7FFFD4",
      createdAt,
      description: "",
      icon: "folder-outline",
      id: nextId("folder"),
      name: "",
      updatedAt: createdAt
    };
  },

  createBlankFileMetadata(linkedNoteId?: string): LocalFileMetadataPlaceholder {
    const createdAt = nowIso();

    return {
      category: "Document Metadata",
      createdAt,
      description: "",
      fileName: "",
      fileType: "document",
      id: nextId("file-meta"),
      linkedNoteId,
      metadataOnly: true,
      updatedAt: createdAt
    };
  },

  parseTags(value: string) {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8);
  },

  formatTags(tags: string[]) {
    return tags.join(", ");
  },

  getFolderName(localData: LocalAppData, folderId?: string) {
    return localData.noteFolders.find((folder) => folder.id === folderId)?.name ?? "No folder";
  },

  filterNotes(localData: LocalAppData, filters: NotesFilesFilters) {
    return sortNotes(
      localData.structuredNotes.filter((note) => {
        const visible = filters.showArchived ? true : !note.archived;
        const category = filters.category === "All" || note.category === filters.category;
        const folder = filters.folderId === "All" || note.folderId === filters.folderId;
        const linked = filters.linkedType === "All" || noteMatchesLinkedType(note, filters.linkedType);
        const pinned = !filters.pinnedOnly || note.pinned;
        const search = includesSearch([note.title, note.body, note.category, ...note.tags], filters.search);

        return visible && category && folder && linked && pinned && search;
      })
    );
  },

  filterFolders(localData: LocalAppData, search: string, showArchived: boolean) {
    return localData.noteFolders.filter(
      (folder) =>
        (showArchived || !folder.archived) &&
        includesSearch([folder.name, folder.description ?? "", folder.id], search)
    );
  },

  filterFileMetadata(localData: LocalAppData, search: string, category: LocalFileMetadataCategory | "All") {
    return localData.fileMetadataPlaceholders.filter(
      (item) =>
        (category === "All" || item.category === category) &&
        includesSearch([item.fileName, item.description, item.category, item.fileType], search)
    );
  },

  upsertNote(localData: LocalAppData, note: LocalStructuredNote): LocalAppData {
    const updatedAt = nowIso();
    const normalized = {
      ...note,
      body: note.body.trim() || "Prototype note body.",
      title: note.title.trim() || "Untitled local note",
      updatedAt
    };
    const exists = localData.structuredNotes.some((item) => item.id === note.id);

    return {
      ...localData,
      structuredNotes: exists
        ? localData.structuredNotes.map((item) => (item.id === note.id ? normalized : item))
        : [normalized, ...localData.structuredNotes],
      updatedAt
    };
  },

  deleteNote(localData: LocalAppData, noteId: string): LocalAppData {
    const updatedAt = nowIso();

    return {
      ...localData,
      fileMetadataPlaceholders: localData.fileMetadataPlaceholders.map((item) =>
        item.linkedNoteId === noteId ? { ...item, linkedNoteId: undefined, updatedAt } : item
      ),
      structuredNotes: localData.structuredNotes.filter((note) => note.id !== noteId),
      updatedAt
    };
  },

  togglePinned(localData: LocalAppData, noteId: string): LocalAppData {
    const updatedAt = nowIso();

    return {
      ...localData,
      structuredNotes: localData.structuredNotes.map((note) =>
        note.id === noteId ? { ...note, pinned: !note.pinned, updatedAt } : note
      ),
      updatedAt
    };
  },

  archiveNote(localData: LocalAppData, noteId: string): LocalAppData {
    const updatedAt = nowIso();

    return {
      ...localData,
      structuredNotes: localData.structuredNotes.map((note) =>
        note.id === noteId ? { ...note, archived: !note.archived, pinned: note.archived ? note.pinned : false, updatedAt } : note
      ),
      updatedAt
    };
  },

  upsertFolder(localData: LocalAppData, folder: LocalNoteFolder): LocalAppData {
    const updatedAt = nowIso();
    const normalized = {
      ...folder,
      name: folder.name.trim() || "Untitled folder",
      updatedAt
    };
    const exists = localData.noteFolders.some((item) => item.id === folder.id);

    return {
      ...localData,
      noteFolders: exists
        ? localData.noteFolders.map((item) => (item.id === folder.id ? normalized : item))
        : [normalized, ...localData.noteFolders],
      updatedAt
    };
  },

  archiveFolder(localData: LocalAppData, folderId: string): LocalAppData {
    const updatedAt = nowIso();

    return {
      ...localData,
      noteFolders: localData.noteFolders.map((folder) =>
        folder.id === folderId ? { ...folder, archived: !folder.archived, updatedAt } : folder
      ),
      updatedAt
    };
  },

  deleteFolder(localData: LocalAppData, folderId: string): LocalAppData {
    const updatedAt = nowIso();

    return {
      ...localData,
      noteFolders: localData.noteFolders.filter((folder) => folder.id !== folderId),
      structuredNotes: localData.structuredNotes.map((note) =>
        note.folderId === folderId ? { ...note, folderId: undefined, updatedAt } : note
      ),
      updatedAt
    };
  },

  upsertFileMetadata(localData: LocalAppData, item: LocalFileMetadataPlaceholder): LocalAppData {
    const updatedAt = nowIso();
    const normalized = {
      ...item,
      description: item.description.trim() || "Metadata placeholder only. No file is uploaded or stored.",
      fileName: item.fileName.trim() || "file-placeholder",
      metadataOnly: true as const,
      updatedAt
    };
    const exists = localData.fileMetadataPlaceholders.some((metadata) => metadata.id === item.id);

    return {
      ...localData,
      fileMetadataPlaceholders: exists
        ? localData.fileMetadataPlaceholders.map((metadata) => (metadata.id === item.id ? normalized : metadata))
        : [normalized, ...localData.fileMetadataPlaceholders],
      updatedAt
    };
  },

  deleteFileMetadata(localData: LocalAppData, itemId: string): LocalAppData {
    const updatedAt = nowIso();

    return {
      ...localData,
      fileMetadataPlaceholders: localData.fileMetadataPlaceholders.filter((item) => item.id !== itemId),
      updatedAt
    };
  },

  saveAIResponseAsNote(localData: LocalAppData, conversation?: AIConversation): LocalAppData {
    const source = conversation ?? localData.aiHistory[0];
    const folderId = localData.noteFolders.find((folder) => folder.name === "AI Assistant")?.id;
    const note = {
      ...this.createBlankNote(folderId),
      body: source?.mockResponse ?? "Mock AI response note. Verify all information before use.",
      category: "AI Assistant Note" as const,
      linkedAIConversationId: source?.id,
      tags: ["ai", "mock", "verify"],
      title: source?.prompt ? `AI note: ${source.prompt.slice(0, 42)}` : "AI Assistant note"
    };

    return this.upsertNote(localData, note);
  },

  saveTranslationRecordAsNote(localData: LocalAppData, record?: TranslationRecord): LocalAppData {
    const source = record ?? localData.translationHistory[0];
    const folderId = localData.noteFolders.find((folder) => folder.name === "Translation")?.id;
    const note = {
      ...this.createBlankNote(folderId),
      body: source
        ? `${source.sourceLanguage} to ${source.targetLanguage}: ${source.sourceText}\n\nMock output: ${source.translatedText}`
        : "Mock translation note. Not certified translation or official interpretation.",
      category: "Translation Note" as const,
      linkedTranslationRecordId: source?.id,
      tags: ["translation", "mock", "local"],
      title: source?.sourceText ? `Translation note: ${source.sourceText.slice(0, 36)}` : "Translation note"
    };

    return this.upsertNote(localData, note);
  },

  getLinkedSummaries(localData: LocalAppData, note: LocalStructuredNote): LocalLinkedItemSummary[] {
    const summaries: LocalLinkedItemSummary[] = [];

    if (note.linkedIncidentId) {
      const incident = localData.incidentDrafts.find((item) => item.id === note.linkedIncidentId);
      summaries.push({
        icon: "file-document-outline",
        id: note.linkedIncidentId,
        subtitle: incident?.status ?? "Incident placeholder",
        title: incident ? `${incident.incidentType} - ${incident.location}` : note.linkedIncidentId,
        type: "incident"
      });
    }

    if (note.linkedAIConversationId) {
      const conversation = localData.aiHistory.find((item) => item.id === note.linkedAIConversationId);
      summaries.push({
        icon: "brain",
        id: note.linkedAIConversationId,
        subtitle: "Mock local AI history",
        title: conversation?.prompt ?? note.linkedAIConversationId,
        type: "ai"
      });
    }

    if (note.linkedTranslationRecordId) {
      const record = localData.translationHistory.find((item) => item.id === note.linkedTranslationRecordId);
      summaries.push({
        icon: "translate",
        id: note.linkedTranslationRecordId,
        subtitle: record ? `${record.sourceLanguage} to ${record.targetLanguage}` : "Translation placeholder",
        title: record?.sourceText ?? note.linkedTranslationRecordId,
        type: "translation"
      });
    }

    if (note.linkedCalendarEventId) {
      const event = localData.calendarWorkflowEvents.find((item) => item.id === note.linkedCalendarEventId);
      summaries.push({
        icon: "calendar-outline",
        id: note.linkedCalendarEventId,
        subtitle: event?.date ?? "Calendar placeholder",
        title: event?.title ?? note.linkedCalendarEventId,
        type: "calendar"
      });
    }

    if (note.linkedCourtEventId) {
      const court = localData.courtWorkflowEvents.find((item) => item.id === note.linkedCourtEventId);
      summaries.push({
        icon: "scale-balance",
        id: note.linkedCourtEventId,
        subtitle: court?.date ?? "Court placeholder",
        title: court?.matterName ?? note.linkedCourtEventId,
        type: "court"
      });
    }

    if (note.linkedTrainingEventId) {
      const training = localData.trainingWorkflowEvents.find((item) => item.id === note.linkedTrainingEventId);
      summaries.push({
        icon: "school-outline",
        id: note.linkedTrainingEventId,
        subtitle: training?.date ?? "Training placeholder",
        title: training?.title ?? note.linkedTrainingEventId,
        type: "training"
      });
    }

    if (note.linkedRequalificationId) {
      const requalification = localData.requalificationWorkflowReminders.find((item) => item.id === note.linkedRequalificationId);
      summaries.push({
        icon: "target",
        id: note.linkedRequalificationId,
        subtitle: requalification?.dueDate ?? "Requalification placeholder",
        title: requalification?.title ?? note.linkedRequalificationId,
        type: "requalification"
      });
    }

    if (note.linkedFollowUpId) {
      const followUp = localData.followUpWorkflowReminders.find((item) => item.id === note.linkedFollowUpId);
      summaries.push({
        icon: "clipboard-check-outline",
        id: note.linkedFollowUpId,
        subtitle: followUp?.dueDate ?? "Follow-up placeholder",
        title: followUp?.title ?? note.linkedFollowUpId,
        type: "followUp"
      });
    }

    return summaries;
  }
};
