import type { LocalAppData, LocalIncidentDraft, LocalNoteFileMetadata } from "@/storage/storageTypes";
import type { AICategory, AICategoryId, AIConversation, AIPreferences, AIPromptSuggestion, AISuggestedAction } from "@/types/ai";
import type { AIResponseContract } from "@/services/api/apiTypes";

const nowIso = () => new Date().toISOString();

const categories: AICategory[] = [
  { description: "Productivity and organization support.", icon: "chat-processing-outline", id: "general", label: "General Support", shortLabel: "General" },
  { description: "Non-mandatory readiness reminders for the start of duty.", icon: "shield-check-outline", id: "shift_readiness", label: "Shift Readiness Helper", shortLabel: "Shift" },
  { description: "Review report drafts for clarity and completeness.", icon: "file-search-outline", id: "report_review", label: "Report Review", shortLabel: "Report" },
  { description: "Organize report notes and prepare concise summaries.", icon: "file-document-outline", id: "incident_summary", label: "Report Note Organizer", shortLabel: "Report" },
  { description: "Suggest possible follow-up tasks for user review.", icon: "clipboard-check-outline", id: "follow_up", label: "Follow-Up Suggestions", shortLabel: "Follow-Ups" },
  { description: "Organize court preparation reminders.", icon: "scale-balance", id: "court", label: "Court Reminder Helper", shortLabel: "Court" },
  { description: "Organize calendar items and reminders.", icon: "calendar-clock-outline", id: "calendar", label: "Calendar Assistant", shortLabel: "Calendar" },
  { description: "Explain training and requalification reminders.", icon: "school-outline", id: "training", label: "Training / Requalification Helper", shortLabel: "Training" },
  { description: "Support translation workflows while requiring user verification.", icon: "translate", id: "translation", label: "Translation Support", shortLabel: "Translate" },
  { description: "Supportive PTSD and stress awareness messaging only. No medical advice.", icon: "ribbon", id: "ptsd_stress_support", label: "PTSD / Stress Support", shortLabel: "PTSD", wellnessOnly: true },
  { description: "Supportive check-in prompts only. No medical advice.", icon: "heart-pulse", id: "wellness", label: "Wellness Check-In", shortLabel: "Wellness", wellnessOnly: true }
];

const suggestedActions: AISuggestedAction[] = [
  { category: "report_review", icon: "file-search-outline", id: "review-report", prompt: "Review this report for clarity and completeness.", subtitle: "Clarity check", title: "Review Report" },
  { category: "incident_summary", icon: "file-document-outline", id: "summarize-incident", prompt: "Summarize this report draft.", subtitle: "Local draft aid", title: "Summarize Report" },
  { category: "follow_up", icon: "clipboard-check-outline", id: "suggest-followups", prompt: "Suggest follow-up tasks for this incident.", subtitle: "Next steps", title: "Suggest Follow-Ups" },
  { category: "court", icon: "scale-balance", id: "court-checklist", prompt: "Prepare a court preparation checklist.", subtitle: "Preparation", title: "Prepare Court Checklist" },
  { category: "general", icon: "folder-text-outline", id: "organize-notes", prompt: "Organize these notes into themes.", subtitle: "Structure", title: "Organize Notes" },
  { category: "incident_summary", icon: "text-box-check-outline", id: "draft-summary", prompt: "Draft a concise summary using only the information provided.", subtitle: "Draft summary", title: "Draft Summary" },
  { category: "translation", icon: "translate", id: "translate-support", prompt: "Create a translation support note.", subtitle: "Language aid", title: "Translate Support Note" },
  { category: "shift_readiness", icon: "shield-check-outline", id: "shift-reminders", prompt: "Review Start My Shift reminders.", subtitle: "Readiness", title: "Review Shift Reminders" },
  { category: "training", icon: "school-outline", id: "training-deadline", prompt: "Explain this training deadline.", subtitle: "Awareness", title: "Explain Training Deadline" },
  { category: "calendar", icon: "calendar-plus-outline", id: "calendar-reminder", prompt: "Help me organize a calendar reminder.", subtitle: "Local reminder", title: "Create Calendar Reminder" },
  { category: "wellness", icon: "ribbon", id: "ptsd-awareness", prompt: "Create a PTSD awareness support message.", subtitle: "Supportive only", title: "PTSD Awareness Message" }
];

const promptSuggestions: AIPromptSuggestion[] = [
  { category: "wellness", id: "wellness-check-in", label: "Wellness Check-In", prompt: "Give me a short wellness check-in message for a stressful shift." },
  { category: "wellness", id: "stigma-free-support", label: "Stigma-Free Words", prompt: "Draft a supportive, stigma-free mental health reminder." },
  { category: "ptsd_stress_support", id: "ptsd-awareness", label: "PTSD Awareness", prompt: "Create a PTSD awareness support message." },
  { category: "ptsd_stress_support", id: "stress-grounding", label: "Stress Support", prompt: "Give a short educational stress-support reminder for police work." },
  { category: "incident_summary", id: "incident-organize-notes", label: "Organize Notes", prompt: "Organize these incident notes into clear sections." },
  { category: "incident_summary", id: "incident-summary", label: "Summarize Draft", prompt: "Summarize this incident draft in plain language." },
  { category: "report_review", id: "report-clarity", label: "Review Clarity", prompt: "Review this report for clarity and completeness." },
  { category: "follow_up", id: "follow-up-tasks", label: "Follow-Ups", prompt: "Suggest follow-up tasks for this incident." },
  { category: "court", id: "court-reminders", label: "Court Reminders", prompt: "Prepare a court preparation reminder list." },
  { category: "calendar", id: "calendar-reminder", label: "Reminder", prompt: "Help me organize a calendar reminder." },
  { category: "training", id: "training-deadline", label: "Training Due", prompt: "Explain this training or requalification deadline." },
  { category: "shift_readiness", id: "shift-readiness", label: "Shift Ready", prompt: "Review Start My Shift reminders." },
  { category: "translation", id: "translation-note", label: "Translation Note", prompt: "Create a translation support note." },
  { category: "general", id: "general-support", label: "General Support", prompt: "Organize these notes into themes." }
];

export const aiService = {
  getAICategories() {
    return categories;
  },
  getSuggestedActions() {
    return suggestedActions;
  },
  getPromptSuggestions(category: AICategoryId) {
    const categoryPrompts = promptSuggestions.filter((item) => item.category === category);
    return categoryPrompts.length > 0 ? categoryPrompts : promptSuggestions.filter((item) => item.category === "general");
  },
  getAIHistory(localData: LocalAppData, category: AICategoryId | "all" = "all") {
    return category === "all" ? localData.aiHistory : localData.aiHistory.filter((item) => item.category === category);
  },
  getAIPreferences(localData: LocalAppData): AIPreferences {
    return localData.aiPreferences;
  },
  createLiveConversation({
    category,
    prompt,
    response,
    relatedIncidentId
  }: {
    category: AICategoryId;
    prompt: string;
    response: AIResponseContract;
    relatedIncidentId?: string;
  }): AIConversation {
    const createdAt = nowIso();
    const conversation: AIConversation = {
      category,
      createdAt,
      id: response.conversation_id ?? `ai-conversation-${Date.now()}`,
      mockResponse: response.answer,
      prompt,
      requestId: response.request_id,
      updatedAt: createdAt,
      verificationRequired: response.verification_required,
      warnings: response.warnings,
      ...(response.summary ? { summary: response.summary } : {}),
      ...(response.missing_information.length ? { missingInformation: response.missing_information } : {}),
      ...(response.sources.length ? { sources: response.sources.map(({ title, url }) => ({ title, ...(url ? { url } : {}) })) } : {}),
      ...(response.refusal_reason ? { refusalReason: response.refusal_reason } : {})
    };
    return relatedIncidentId ? { ...conversation, relatedIncidentId } : conversation;
  },
  saveAIConversation(localData: LocalAppData, conversation: AIConversation): LocalAppData {
    return {
      ...localData,
      aiHistory: [conversation, ...localData.aiHistory.filter((item) => item.id !== conversation.id)].slice(0, 40),
      updatedAt: nowIso()
    };
  },
  deleteAIConversation(localData: LocalAppData, conversationId: string): LocalAppData {
    return {
      ...localData,
      aiHistory: localData.aiHistory.filter((item) => item.id !== conversationId),
      updatedAt: nowIso()
    };
  },
  clearAIHistory(localData: LocalAppData): LocalAppData {
    return {
      ...localData,
      aiHistory: [],
      updatedAt: nowIso()
    };
  },
  saveAIPreferences(localData: LocalAppData, preferences: AIPreferences): LocalAppData {
    return {
      ...localData,
      aiPreferences: {
        ...preferences,
        lastUpdatedAt: nowIso()
      },
      updatedAt: nowIso()
    };
  },
  attachAIResponseToIncidentDraft(localData: LocalAppData, conversation: AIConversation, incidentId: string): LocalAppData {
    const incidentDrafts: LocalIncidentDraft[] = localData.incidentDrafts.map((draft) =>
      draft.id === incidentId
        ? {
            ...draft,
            incidentNotes: {
              ...draft.incidentNotes,
              followUpNotes: `${draft.incidentNotes.followUpNotes}\n\nAI response: ${conversation.mockResponse}`.trim()
            },
            updatedAt: nowIso()
          }
        : draft
    );

    return {
      ...localData,
      aiHistory: localData.aiHistory.map((item) =>
        item.id === conversation.id ? { ...item, relatedIncidentId: incidentId, updatedAt: nowIso() } : item
      ),
      incidentDrafts,
      updatedAt: nowIso()
    };
  },
  saveAIResponseToNote(localData: LocalAppData, conversation: AIConversation): LocalAppData {
    const note: LocalNoteFileMetadata = {
      fileType: "note",
      icon: "note-text-outline",
      id: `ai-note-${Date.now()}`,
      referenceOnly: true,
      subtitle: "AI response saved locally on this device.",
      title: `AI Note - ${categories.find((item) => item.id === conversation.category)?.shortLabel ?? "General"}`,
      updatedAt: nowIso()
    };

    return {
      ...localData,
      aiHistory: localData.aiHistory.map((item) =>
        item.id === conversation.id ? { ...item, relatedNoteId: note.id, updatedAt: nowIso() } : item
      ),
      notesFiles: [note, ...localData.notesFiles].slice(0, 30),
      updatedAt: nowIso()
    };
  }
};
