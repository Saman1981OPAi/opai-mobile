import type { MentalHealthResourceSectionDefinition } from "./mentalHealthResourceTypes.ts";
import { visibleMentalHealthResources } from "./mentalHealthSourceRegister.ts";

export const mentalHealthResourceSections: MentalHealthResourceSectionDefinition[] = [
  { id: "immediateCrisis", title: "Immediate Crisis" },
  { id: "firstResponderSupport", title: "First Responder Support" },
  { id: "communitySupport", title: "Community Support" },
  { id: "ontarioRegional", title: "Ontario Regional Resources" }
];

export const mentalHealthResources = visibleMentalHealthResources;

export const mentalHealthDirectoryDisclaimer =
  "This is a resource directory, not diagnosis, treatment, counselling, crisis intervention, or emergency response. OPAi does not assess risk, contact services automatically, record which resources you use, or share your selections.";
