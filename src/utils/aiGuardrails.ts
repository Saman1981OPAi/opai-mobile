import type { AIPromptClassification } from "@/types/ai";

const keywordMap: Array<{ classification: AIPromptClassification; keywords: string[] }> = [
  { classification: "incident", keywords: ["incident", "occurrence", "call", "summary"] },
  { classification: "report", keywords: ["report", "draft", "review", "notes"] },
  { classification: "court", keywords: ["court", "disclosure", "appearance", "trial"] },
  { classification: "calendar", keywords: ["calendar", "reminder", "schedule", "deadline"] },
  { classification: "training", keywords: ["training", "requalification", "firearms", "cew"] },
  { classification: "translation", keywords: ["translate", "translation", "language", "interpreter"] },
  { classification: "legal_reference_placeholder", keywords: ["criminal code", "statute", "law", "legal"] },
  { classification: "wellness", keywords: ["ptsd", "wellness", "stress", "mental health"] }
];

const unsafeKeywords = [
  "diagnose",
  "treat me",
  "therapy",
  "certify report",
  "official legal advice",
  "guarantee",
  "bypass policy",
  "hide evidence"
];

export function classifyMockPrompt(prompt: string): AIPromptClassification {
  const normalized = prompt.trim().toLowerCase();

  if (!normalized) {
    return "unsupported";
  }

  if (unsafeKeywords.some((keyword) => normalized.includes(keyword))) {
    return "unsupported";
  }

  return keywordMap.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)))?.classification ?? "general";
}

export function getUnsupportedMockMessage() {
  return "[Mock AI Response] This request is not supported in the testing version. Future versions will include additional safety, moderation, supervision, and verification controls.";
}

export function isPlaceholderOnlyClassification(classification: AIPromptClassification) {
  return classification === "legal_reference_placeholder";
}
