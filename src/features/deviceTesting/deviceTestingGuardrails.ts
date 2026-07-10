export const deviceTestingCoreNotice =
  "Reference guides only. Use only equipment for which you are trained and authorized. Always follow current law, authorized training, police-service policy, manufacturer instructions, certification requirements, and approved procedures.";

export const deviceTestingVariationNotice =
  "Testing requirements vary by manufacturer, model, software version, configuration, jurisdiction, and police service.";

export const deviceTestingFailureNotice =
  "If any required test fails, do not use the device for enforcement. Remove it from service and follow your police service's equipment-reporting, maintenance, and replacement procedure.";

export const deviceTestingReferenceNotice =
  "OPAi provides reference assistance only. Always follow current law, authorized training, police-service policy, and the exact manufacturer procedure.";

export const personalReferenceOnlyNotice = "Personal reference only - not an official equipment record.";

export const useOfForceNotice =
  "The Use of Force Reference is a training and articulation aid only. It does not justify force, prescribe a specific response, replace law, replace police-service policy or training, or determine whether force is reasonable in a particular situation.";

export const deviceTestingGuardrails = [
  "Never invent a test procedure.",
  "Never invent a tolerance.",
  "Never apply another model's procedure.",
  "Never override the manufacturer manual.",
  "Never override police-service policy.",
  "Never certify equipment.",
  "Never create an official test record.",
  "Never advise using equipment after a failed test.",
  "Never expose approved-instrument details without qualified-technician confirmation.",
  "Never recommend a use-of-force option.",
  "Never claim the local guide is a live AI answer.",
  "Always show sources and limitations."
] as const;

export function canShowDetailedGuide(requiresQualifiedTechnician: boolean, qualifiedTechnicianConfirmed: boolean) {
  return !requiresQualifiedTechnician || qualifiedTechnicianConfirmed;
}
