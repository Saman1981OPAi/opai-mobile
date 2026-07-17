import type { MentalHealthResource } from "./mentalHealthResourceTypes.ts";

export const mentalHealthVerificationDate = "2026-07-16";
export const mentalHealthNextReviewDate = "2026-10-16";

export const mentalHealthSourceRegister: MentalHealthResource[] = [
  {
    audience: "Anyone requiring immediate police, fire, or ambulance assistance",
    callNumber: "911",
    coverage: "Canada, where 9-1-1 service is available",
    displayNumber: "9-1-1",
    hours: "Emergency service",
    id: "emergency-911",
    nextReviewDate: mentalHealthNextReviewDate,
    officialUrl: "https://crtc.gc.ca/eng/phone/911/index.htm",
    organization: "Canadian 9-1-1 services",
    section: "immediateCrisis",
    service: "Emergency police, fire, and ambulance dispatch",
    status: "verified",
    verifiedDate: mentalHealthVerificationDate
  },
  {
    audience: "Anyone in Canada thinking about suicide or worried about someone else",
    callNumber: "988",
    coverage: "Canada-wide",
    displayNumber: "9-8-8",
    hours: "24/7/365",
    id: "suicide-crisis-988",
    nextReviewDate: mentalHealthNextReviewDate,
    officialUrl: "https://988.ca/",
    organization: "9-8-8: Suicide Crisis Helpline",
    section: "immediateCrisis",
    service: "Toll-free suicide crisis support by phone or text",
    status: "verified",
    textNumber: "988",
    verifiedDate: mentalHealthVerificationDate
  },
  {
    audience: "Serving or retired first responders, sworn or civilian",
    callNumber: "+18336772668",
    coverage: "Ontario-based peer helpline",
    displayNumber: "1-833-677-2668",
    hours: "24/7",
    id: "boots-on-the-ground",
    nextReviewDate: mentalHealthNextReviewDate,
    officialUrl: "https://www.bootsontheground.ca/",
    organization: "Boots on the Ground",
    section: "firstResponderSupport",
    service: "Anonymous peer support for first responders, by first responders",
    status: "verified",
    verifiedDate: mentalHealthVerificationDate
  },
  {
    audience: "People seeking non-clinical health and social-service navigation",
    callNumber: "211",
    coverage: "Most of Canada",
    displayNumber: "2-1-1",
    hours: "24 hours in most of Canada; local availability may vary",
    id: "211-canada",
    nextReviewDate: mentalHealthNextReviewDate,
    officialUrl: "https://211.ca/",
    organization: "211 Canada",
    section: "communitySupport",
    service: "Free, confidential community and social-service navigation",
    status: "verified",
    verifiedDate: mentalHealthVerificationDate
  },
  {
    audience: "People looking for a Canadian Mental Health Association branch or region",
    coverage: "Canada-wide branch and regional finder",
    hours: "Hours vary by branch and service",
    id: "cmha-finder",
    nextReviewDate: mentalHealthNextReviewDate,
    officialUrl: "https://cmha.ca/find-help/",
    organization: "Canadian Mental Health Association",
    section: "communitySupport",
    service: "Community mental-health organization finder",
    status: "verified",
    verifiedDate: mentalHealthVerificationDate
  },
  {
    audience: "People in the listed service areas who need immediate mental-health crisis support",
    callNumber: "+18553102673",
    coverage: "York Region, South Simcoe, and North York",
    disclosure: "Provider notice: calls may be recorded for training purposes.",
    displayNumber: "1-855-310-COPE (2673)",
    hours: "24/7 phone and text support",
    id: "yssn-310-cope",
    nextReviewDate: mentalHealthNextReviewDate,
    officialUrl: "https://yssn.ca/crisis-services/310-cope/",
    organization: "Your Support Services Network",
    section: "ontarioRegional",
    service: "310-COPE community crisis response",
    status: "verified",
    textNumber: "+18553102673",
    verifiedDate: mentalHealthVerificationDate
  }
];

export const visibleMentalHealthResources = mentalHealthSourceRegister.filter(
  (resource) => resource.status === "verified"
);
