import type { DeviceTestingSource } from "@/features/deviceTesting/deviceTestingTypes";

export const sourceReviewDate = "2026-07-10";

export const deviceTestingSources: DeviceTestingSource[] = [
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "lidar-prolaser4-rcmp",
    jurisdiction: "Canada / RCMP configuration",
    publisher: "Kustom Signals",
    reviewStatus: "current",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "006-0966-12 REV 3 RCMP",
    sourceTitle: "Kustom Signals ProLaser 4 RCMP Operator Guide",
    sourceUrl: "https://kustomsignals.com/portal_resources/006-0966-12_REV_3_RCMP.pdf",
    supportedDeviceModel: "Kustom Signals ProLaser 4"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "radar-falcon-hr-ontario",
    jurisdiction: "Ontario / Canada",
    publisher: "Kustom Signals",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "006-1075-01 REV 2",
    sourceTitle: "Kustom Falcon HR Ontario Guide",
    sourceUrl: "https://kustomsignals.com/portal_resources/006-1075-01_rev_2.pdf",
    supportedDeviceModel: "Kustom Falcon HR"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "radar-eagle3-stationary",
    jurisdiction: "Canada",
    publisher: "Kustom Signals",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "Quick Reference Guide",
    sourceTitle: "Kustom Eagle 3 Quick Reference Guide",
    sourceUrl: "https://kustomsignals.com/portal_resources/Eagle_3_Quick_Reference_Guide.pdf",
    supportedDeviceModel: "Kustom Eagle 3"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "radar-raptor-rp1-stationary",
    jurisdiction: "Canada",
    publisher: "Kustom Signals",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "Quick Start Guide",
    sourceTitle: "Kustom Raptor RP-1 Quick Start Guide",
    sourceUrl: "https://kustomsignals.com/portal_resources/Raptor_QSG.pdf",
    supportedDeviceModel: "Kustom Raptor RP-1"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "radar-eagle3-moving",
    jurisdiction: "Canada",
    publisher: "Kustom Signals",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "Quick Reference Guide",
    sourceTitle: "Kustom Eagle 3 Quick Reference Guide",
    sourceUrl: "https://kustomsignals.com/portal_resources/Eagle_3_Quick_Reference_Guide.pdf",
    supportedDeviceModel: "Kustom Eagle 3 moving RADAR"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "radar-raptor-rp1-moving",
    jurisdiction: "Canada",
    publisher: "Kustom Signals",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "Quick Start Guide",
    sourceTitle: "Kustom Raptor RP-1 Quick Start Guide",
    sourceUrl: "https://kustomsignals.com/portal_resources/Raptor_QSG.pdf",
    supportedDeviceModel: "Kustom Raptor RP-1 moving RADAR"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "asd-alco-sensor-fst",
    jurisdiction: "Canada",
    publisher: "Intoximeters / Justice Canada",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "Current web source",
    sourceTitle: "Alco-Sensor FST Accuracy Check Procedure",
    sourceUrl: "https://www.intox.com/alco-sensor-fst-accuracy-check-procedure/",
    supportedDeviceModel: "Alco-Sensor FST"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "asd-draeger-7000-canada",
    jurisdiction: "Canada",
    publisher: "Drager / Justice Canada",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "Current web source",
    sourceTitle: "Drager Alcotest 7000 Canadian Law Enforcement",
    sourceUrl: "https://www.draeger.com/en-us_ca/Products/Alcotest-7000-Canadian-Law-Enforcement",
    supportedDeviceModel: "Drager Alcotest 7000 Canadian Police"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "1985",
    guideId: "breath-instrument-qualified-technician",
    jurisdiction: "Canada",
    publisher: "Justice Canada",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "SI/85-201",
    sourceTitle: "Approved Breath Analysis Instruments Order",
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/regulations/SI-85-201/index.html",
    supportedDeviceModel: "Current approved breath analysis instruments"
  },
  {
    contentLastReviewed: sourceReviewDate,
    datePublished: "Unknown",
    guideId: "use-of-force-reference",
    jurisdiction: "Canada / Ontario",
    publisher: "Public Safety Canada / Ontario",
    reviewStatus: "monitor",
    sourceLastChecked: sourceReviewDate,
    sourceRevision: "National framework archive and Ontario regulation",
    sourceTitle: "National Use of Force Framework and Ontario Regulation 391/23",
    sourceUrl: "https://www.publicsafety.gc.ca/lbrr/archives/cnmcs-plcng/cn31151-eng.pdf",
    supportedDeviceModel: "Use of Force Reference"
  }
];

export function getDeviceTestingSource(guideId: string) {
  return deviceTestingSources.find((source) => source.guideId === guideId);
}
