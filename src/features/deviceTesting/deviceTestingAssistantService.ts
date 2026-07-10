import { deviceModelOptions, deviceTestGuides } from "@/features/deviceTesting/deviceTestingGuides";
import { getDeviceTestingSource } from "@/features/deviceTesting/deviceTestingSources";
import type {
  DeviceModelOption,
  DeviceTestCategory,
  DeviceTestGuide,
  DeviceTestStep,
  DeviceTestingAssistantResponse
} from "@/features/deviceTesting/deviceTestingTypes";

const normalize = (value: string) => value.trim().toLowerCase();

export function getGuideById(guideId: string): DeviceTestGuide | undefined {
  return deviceTestGuides.find((guide) => guide.id === guideId);
}

export function getModelOptions(category: DeviceTestCategory): DeviceModelOption[] {
  return deviceModelOptions.filter((option) => option.category === category);
}

export function getAutomaticDeviceGuide(
  category: DeviceTestCategory,
  manufacturer: string,
  model: string
): DeviceTestingAssistantResponse | undefined {
  const option = deviceModelOptions.find(
    (item) =>
      item.category === category &&
      item.supported &&
      normalize(item.manufacturer) === normalize(manufacturer) &&
      normalize(item.model) === normalize(model)
  );

  if (!option) {
    return undefined;
  }

  const guide = getGuideById(option.guideId);
  return guide ? toAssistantResponse(guide) : undefined;
}

export function getGuideSections(guideId: string): { inspectionSteps: DeviceTestStep[]; testSteps: DeviceTestStep[] } {
  const guide = getGuideById(guideId);
  return {
    inspectionSteps: guide?.inspectionSteps ?? [],
    testSteps: guide?.testSteps ?? []
  };
}

export function getExpectedResults(guideId: string): string[] {
  return getGuideById(guideId)?.expectedResults ?? [];
}

export function getFailureAction(guideId: string): string {
  return getGuideById(guideId)?.failureAction ?? "Follow current manufacturer manual and police-service procedure.";
}

export function getOfficialSources(guideId: string) {
  const guide = getGuideById(guideId);
  const source = getDeviceTestingSource(guideId);
  return {
    sourceLastChecked: guide?.sourceLastChecked ?? source?.sourceLastChecked ?? "Not available",
    sourceRevision: guide?.sourceRevision ?? source?.sourceRevision ?? "Not available",
    sourceTitle: guide?.sourceTitle ?? source?.sourceTitle ?? "Not available",
    sourceUrl: guide?.sourceUrl ?? source?.sourceUrl ?? ""
  };
}

export function getSuggestedFollowUps(guideId: string, stepId: string): string[] {
  const guide = getGuideById(guideId);
  const step = [...(guide?.inspectionSteps ?? []), ...(guide?.testSteps ?? [])].find((item) => item.id === stepId);
  if (!guide || !step) {
    return ["Show official source", "Select another model"];
  }

  return [
    `Explain ${step.title}`,
    "What result should appear?",
    "What if it fails?",
    "Which model does this apply to?",
    "Show official source"
  ];
}

export function getUnsupportedModelResponse(category: DeviceTestCategory, manufacturer: string, model: string) {
  const isMovingRadar = category === "movingRadar";
  return {
    manufacturer,
    model,
    refusal:
      "OPAi does not currently have a verified guide for this exact device. Follow the current manufacturer manual, authorized training, police-service procedure, and applicable law.",
    warning: isMovingRadar
      ? "Moving RADAR test sequences and expected Patrol/Target values are model-specific. Do not apply another manufacturer's sequence."
      : "OPAi will not substitute another model's procedure or invent a tolerance."
  };
}

export function toAssistantResponse(guide: DeviceTestGuide): DeviceTestingAssistantResponse {
  return {
    compactSummary: `${guide.manufacturer} ${guide.model} - ${guide.configuration}`,
    expectedResults: guide.expectedResults,
    failureAction: guide.failureAction,
    guideId: guide.id,
    inspectionSteps: guide.inspectionSteps,
    jurisdiction: guide.jurisdiction,
    limitations: guide.limitations,
    manufacturer: guide.manufacturer,
    model: guide.model,
    offlineAvailable: guide.offlineAvailable,
    prerequisites: guide.prerequisites,
    responseMode: guide.responseMode,
    sourceLastChecked: guide.sourceLastChecked,
    sourceRevision: guide.sourceRevision,
    sourceTitle: guide.sourceTitle,
    sourceUrl: guide.sourceUrl,
    testSteps: guide.testSteps,
    title: guide.title,
    warnings: guide.warnings
  };
}
