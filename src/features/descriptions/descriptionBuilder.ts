import type { PersonDescriptionInput, VehicleDescriptionInput } from "./descriptionTypes.ts";

function sentence(parts: string[]) {
  const value = parts.filter(Boolean).join(", ").trim();
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}.` : "No description details entered.";
}

export function buildPersonDescription(input: PersonDescriptionInput) {
  return sentence([
    input.presentation?.trim() ? `person described as ${input.presentation.trim()}` : "",
    input.age?.trim() ? `approximately ${input.age.trim()} years old` : "",
    input.height?.trim() ? `approximately ${input.height.trim()}` : "",
    input.build?.trim() ? `${input.build.trim()} build` : "",
    input.hair?.trim() ? `${input.hair.trim()} hair` : "",
    input.clothing?.trim() ? `wearing ${input.clothing.trim()}` : "",
    input.distinguishingFeatures?.trim() ? `noted ${input.distinguishingFeatures.trim()}` : "",
    input.direction?.trim() ? `last seen travelling ${input.direction.trim()}` : "",
    input.lastSeenAt?.trim() ? `last seen at ${input.lastSeenAt.trim()}` : ""
  ]);
}

export function buildVehicleDescription(input: VehicleDescriptionInput) {
  const makeModel = input.makeModel?.trim()
    ? `${input.makeModelCertainty === "possible" ? "possibly " : input.makeModelCertainty === "unknown" ? "unconfirmed " : ""}${input.makeModel.trim()}`
    : "";
  return sentence([
    input.colour?.trim() ? `${input.colour.trim()}-coloured` : "",
    input.bodyStyle?.trim() ? input.bodyStyle.trim() : "vehicle",
    makeModel,
    input.plate?.trim() ? `${input.plate.trim().length < 6 ? "partial " : ""}${input.jurisdiction?.trim() ? `${input.jurisdiction.trim()} ` : ""}plate ${input.plate.trim().toUpperCase()}` : "",
    input.damage?.trim() ? `damage ${input.damage.trim()}` : "",
    input.markings?.trim() ? `markings ${input.markings.trim()}` : "",
    input.direction?.trim() ? `last seen travelling ${input.direction.trim()}` : "",
    input.lastSeenLocation?.trim() ? `near ${input.lastSeenLocation.trim()}` : "",
    input.lastSeenAt?.trim() ? `at ${input.lastSeenAt.trim()}` : ""
  ]);
}
