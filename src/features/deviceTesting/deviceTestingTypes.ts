import type { MciIcon } from "@/data/uiMockups";

export type DeviceTestCategory =
  | "lidar"
  | "stationaryRadar"
  | "movingRadar"
  | "asd"
  | "breathInstrument"
  | "useOfForce";

export type DeviceTestingResponseMode = "curated-local";

export type DeviceTestingSource = {
  guideId: string;
  sourceTitle: string;
  publisher: string;
  sourceUrl: string;
  sourceRevision: string;
  datePublished: string;
  sourceLastChecked: string;
  contentLastReviewed: string;
  supportedDeviceModel: string;
  jurisdiction: string;
  reviewStatus: "current" | "monitor" | "unsupported";
};

export type DeviceTestStep = {
  id: string;
  title: string;
  icon: MciIcon;
  instruction: string;
  details: string[];
  warning: string;
  sourceRef: string;
};

export type DeviceTestGuide = {
  id: string;
  category: DeviceTestCategory;
  title: string;
  compactTitle: string;
  icon: MciIcon;
  manufacturer: string;
  model: string;
  jurisdiction: string;
  configuration: string;
  applicableSoftwareVersion: string;
  audience: string;
  requiredTraining: string;
  prerequisites: string[];
  inspectionSteps: DeviceTestStep[];
  testSteps: DeviceTestStep[];
  expectedResults: string[];
  failureAction: string;
  warnings: string[];
  limitations: string[];
  sourceTitle: string;
  sourceUrl: string;
  sourceRevision: string;
  sourceLastChecked: string;
  contentLastReviewed: string;
  offlineAvailable: boolean;
  officialLogDisclaimer: string;
  requiresQualifiedTechnician: boolean;
  responseMode: DeviceTestingResponseMode;
};

export type DeviceTestingAssistantResponse = {
  guideId: string;
  title: string;
  compactSummary: string;
  manufacturer: string;
  model: string;
  jurisdiction: string;
  prerequisites: string[];
  inspectionSteps: DeviceTestStep[];
  testSteps: DeviceTestStep[];
  expectedResults: string[];
  failureAction: string;
  warnings: string[];
  limitations: string[];
  sourceTitle: string;
  sourceUrl: string;
  sourceRevision: string;
  sourceLastChecked: string;
  offlineAvailable: boolean;
  responseMode: DeviceTestingResponseMode;
};

export type DeviceTestingCategoryCard = {
  id: DeviceTestCategory;
  icon: MciIcon;
  title: string;
  compactTitle: string;
  description: string;
  section: "equipment" | "reference";
};

export type DeviceModelOption = {
  id: string;
  category: DeviceTestCategory;
  manufacturer: string;
  model: string;
  jurisdiction: string;
  configuration: string;
  guideId: string;
  supported: boolean;
};
