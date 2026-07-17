export type MentalHealthResourceSection =
  | "immediateCrisis"
  | "firstResponderSupport"
  | "communitySupport"
  | "ontarioRegional";

export type MentalHealthResourceStatus = "verified" | "sourceVerificationRequired";

export type MentalHealthResource = {
  audience: string;
  callNumber?: string;
  coverage: string;
  disclosure?: string;
  displayNumber?: string;
  hours: string;
  id: string;
  nextReviewDate: string;
  officialUrl: string;
  organization: string;
  section: MentalHealthResourceSection;
  service: string;
  status: MentalHealthResourceStatus;
  textNumber?: string;
  verifiedDate: string;
};

export type MentalHealthResourceSectionDefinition = {
  id: MentalHealthResourceSection;
  title: string;
};
