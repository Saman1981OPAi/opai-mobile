export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
};

export type OfficerProfileResponse = {
  id: string;
  email: string;
  display_name: string;
  badge_number?: string | null;
  agency?: string | null;
  agency_id?: string | null;
  role: string;
  status: string;
};

export type AIRequestMode =
  | "general"
  | "report_writing"
  | "training"
  | "calendar"
  | "device_testing"
  | "wellness"
  | "translation_support";

export type ProviderUsage = {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
};

export type SourceReference = {
  title: string;
  url?: string | null;
  issuing_body?: string | null;
  revision?: string | null;
  last_reviewed?: string | null;
};

export type AIResponseContract = {
  request_id: string;
  conversation_id?: string | null;
  mode: string;
  title: string;
  answer: string;
  summary?: string | null;
  warnings: string[];
  missing_information: string[];
  verification_required: boolean;
  sources: SourceReference[];
  refusal_reason?: string | null;
  usage?: ProviderUsage | null;
};

export type ReportAction =
  | "organize_facts"
  | "improve_grammar"
  | "improve_clarity"
  | "build_chronology"
  | "summarize"
  | "identify_missing_information"
  | "create_draft";

export type ReportResponse = {
  request_id: string;
  title: string;
  organized_draft: string;
  supplied_facts: string[];
  missing_information: string[];
  inconsistencies: string[];
  verification_required: boolean;
  warning: string;
  usage?: ProviderUsage | null;
};

export type TranslationResponse = {
  request_id: string;
  detected_source_language: string;
  target_language: string;
  original_text: string;
  translated_text: string;
  uncertainty_notes: string[];
  verification_required: boolean;
  notice: string;
  original_transcript?: string;
  extracted_text?: string;
  unreadable_regions?: string[];
  page_or_section_mapping?: string[];
  unsupported_elements?: string[];
  warnings?: string[];
};

export type AIUsageResponse = {
  day: string;
  ai_requests: number;
  ai_limit: number;
  translation_requests: number;
  translation_limit: number;
};

export type DeviceTestingExplainResponse = AIResponseContract & {
  guide_id: string;
  source_revision: string;
  offline_guide_available: boolean;
};

export type UploadAsset = {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
  temporary?: boolean;
};
