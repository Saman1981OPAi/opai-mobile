import { getDeviceTestingSource } from "@/features/deviceTesting/deviceTestingSources";
import { personalReferenceOnlyNotice } from "@/features/deviceTesting/deviceTestingGuardrails";
import type {
  DeviceModelOption,
  DeviceTestCategory,
  DeviceTestGuide,
  DeviceTestStep,
  DeviceTestingCategoryCard,
  DeviceTestingSource
} from "@/features/deviceTesting/deviceTestingTypes";
import type { MciIcon } from "@/data/uiMockups";

const sourceFor = (guideId: string): DeviceTestingSource => {
  const source = getDeviceTestingSource(guideId);
  if (!source) {
    throw new Error(`Missing Device Testing source for ${guideId}`);
  }
  return source;
};

const step = (
  id: string,
  title: string,
  icon: MciIcon,
  instruction: string,
  details: string[],
  warning = "",
  sourceRef = "Selected source"
): DeviceTestStep => ({ details, icon, id, instruction, sourceRef, title, warning });

const sharedWarnings = [
  "Do not use this guide as an official equipment certification.",
  "Do not enter real serial numbers, evidence, police records, or confidential information.",
  "Do not substitute another model's procedure."
];

function guide({
  category,
  configuration,
  guideId,
  icon,
  inspectionSteps,
  jurisdiction,
  manufacturer,
  model,
  prerequisites,
  requiredTraining,
  testSteps,
  title,
  compactTitle,
  expectedResults,
  failureAction,
  warnings = sharedWarnings,
  limitations,
  requiresQualifiedTechnician = false
}: {
  category: DeviceTestCategory;
  configuration: string;
  guideId: string;
  icon: MciIcon;
  inspectionSteps: DeviceTestStep[];
  jurisdiction: string;
  manufacturer: string;
  model: string;
  prerequisites: string[];
  requiredTraining: string;
  testSteps: DeviceTestStep[];
  title: string;
  compactTitle: string;
  expectedResults: string[];
  failureAction: string;
  warnings?: string[];
  limitations: string[];
  requiresQualifiedTechnician?: boolean;
}): DeviceTestGuide {
  const source = sourceFor(guideId);
  return {
    applicableSoftwareVersion: "Confirm against current device and manual",
    audience: requiresQualifiedTechnician ? "Qualified technician only" : "Trained and authorized user",
    category,
    compactTitle,
    configuration,
    contentLastReviewed: source.contentLastReviewed,
    expectedResults,
    failureAction,
    icon,
    id: guideId,
    inspectionSteps,
    jurisdiction,
    limitations,
    manufacturer,
    model,
    offlineAvailable: true,
    officialLogDisclaimer: personalReferenceOnlyNotice,
    prerequisites,
    requiredTraining,
    requiresQualifiedTechnician,
    responseMode: "curated-local",
    sourceLastChecked: source.sourceLastChecked,
    sourceRevision: source.sourceRevision,
    sourceTitle: source.sourceTitle,
    sourceUrl: source.sourceUrl,
    testSteps,
    title,
    warnings
  };
}

export const deviceTestingCategories: DeviceTestingCategoryCard[] = [
  {
    compactTitle: "LIDAR",
    description: "Model-specific alignment and distance checks",
    icon: "crosshairs-gps",
    id: "lidar",
    section: "equipment",
    title: "LIDAR Test"
  },
  {
    compactTitle: "Stationary RADAR",
    description: "Internal and stationary accuracy checks",
    icon: "radar",
    id: "stationaryRadar",
    section: "equipment",
    title: "Stationary RADAR"
  },
  {
    compactTitle: "Moving RADAR",
    description: "Model-specific patrol and target checks",
    icon: "car-speed-limiter",
    id: "movingRadar",
    section: "equipment",
    title: "Moving RADAR"
  },
  {
    compactTitle: "ASD",
    description: "Approved screening-device readiness checks",
    icon: "test-tube",
    id: "asd",
    section: "equipment",
    title: "ASD Test"
  },
  {
    compactTitle: "Breath Instrument",
    description: "Qualified-technician instrument checks",
    icon: "gauge",
    id: "breathInstrument",
    section: "equipment",
    title: "Breath Instrument"
  },
  {
    compactTitle: "Use of Force",
    description: "Canadian framework reference",
    icon: "shield-alert-outline",
    id: "useOfForce",
    section: "reference",
    title: "Use of Force"
  }
];

export const deviceTestGuides: DeviceTestGuide[] = [
  guide({
    category: "lidar",
    compactTitle: "LIDAR",
    configuration: "RCMP Configuration",
    expectedResults: [
      "Self-test completes successfully.",
      "Aiming point, tone, and displayed range correspond to the selected target.",
      "Differential-distance result is checked only against the current manufacturer or service tolerance."
    ],
    failureAction: "If any self-test, alignment check, or distance check fails, do not use the LIDAR for enforcement.",
    guideId: "lidar-prolaser4-rcmp",
    icon: "crosshairs-gps",
    inspectionSteps: [
      step("lidar-inspect", "Inspect device", "magnify", "Check housing, trigger, display, lenses, battery, and power.", [
        "Confirm lenses are clean and unobstructed.",
        "Confirm the device is serviceable and authorized for use."
      ]),
      step("lidar-environment", "Confirm setting", "map-marker-check-outline", "Use a safe, isolated stationary target area.", [
        "Avoid traffic hazards and reflective clutter.",
        "Confirm training and police-service procedure before testing."
      ])
    ],
    jurisdiction: "Canada",
    limitations: [
      "ProLaser 4 RCMP content applies only to the exact selected configuration.",
      "Other LIDAR models must use the current manufacturer manual and service procedure."
    ],
    manufacturer: "Kustom Signals",
    model: "ProLaser 4",
    prerequisites: [
      "Trained and authorized operator",
      "Exact ProLaser 4 RCMP configuration confirmed",
      "Current service/certification status confirmed"
    ],
    requiredTraining: "Authorized LIDAR operator training",
    testSteps: [
      step("lidar-self", "Self-test", "power", "Power on and allow automatic checks to complete.", [
        "Run the manual self-test when required by the current guide.",
        "Stop if an error appears."
      ], "If an error appears, remove the device from service."),
      step("lidar-hud", "HUD alignment", "crosshairs", "Sweep the reticle across an isolated target around 30 m / 100 ft away.", [
        "Use range mode.",
        "Sweep horizontally and vertically.",
        "Confirm reticle, tone, and range correspond to the selected target."
      ], "Do not use the device if alignment does not correspond.", "ProLaser 4 RCMP guide only"),
      step("lidar-distance", "Distance check", "map-marker-distance", "Compare two verified fixed targets using the current approved procedure.", [
        "Use approximately 15 m and 30 m targets, or distances required by current agency procedure.",
        "Apply only the current manufacturer or service tolerance.",
        "Never invent a tolerance."
      ], "Do not continue if the result is outside the authorized tolerance.")
    ],
    title: "LIDAR Test"
  }),
  guide({
    category: "stationaryRadar",
    compactTitle: "Falcon HR",
    configuration: "Ontario / Canadian guide",
    expectedResults: [
      "Internal and display tests pass.",
      "Stationary test source values match the selected manufacturer guide.",
      "All required antennas and modes pass before use."
    ],
    failureAction: "If a required internal, display, antenna, or test-source check fails, remove the RADAR from service.",
    guideId: "radar-falcon-hr-ontario",
    icon: "radar",
    inspectionSteps: [
      step("falcon-precheck", "Confirm setup", "format-list-checks", "Confirm model, frequency band, mode, and authorized test source.", [
        "Confirm fork or electronic test-source certification where required.",
        "Confirm service/certification status."
      ]),
      step("falcon-inspect", "Inspect hardware", "cable-data", "Check antenna, display, cables, mounts, remote, battery, and power.", [
        "Do not continue if a cable, mount, antenna, or display is damaged."
      ])
    ],
    jurisdiction: "Ontario / Canada",
    limitations: [
      "Stationary RADAR tolerances are model-specific.",
      "This guide does not create a universal RADAR testing tolerance."
    ],
    manufacturer: "Kustom Signals",
    model: "Falcon HR",
    prerequisites: ["Trained and authorized RADAR operator", "Correct frequency-specific test source", "Current Falcon HR guide available"],
    requiredTraining: "Authorized RADAR operator training",
    testSteps: [
      step("falcon-internal", "Internal test", "checkbox-marked-circle-outline", "Power on and complete automatic/manual internal checks.", [
        "Confirm display segments, audio, antenna status, and internal indicators pass."
      ]),
      step("falcon-stationary", "Stationary check", "speedometer", "Select stationary mode and apply the correct test source.", [
        "Confirm displayed speed matches the selected source value.",
        "Use only the tolerance in the selected guide."
      ], "Remove from service if the check fails.")
    ],
    title: "Stationary or Handheld RADAR Test"
  }),
  guide({
    category: "stationaryRadar",
    compactTitle: "Eagle 3",
    configuration: "Stationary mode",
    expectedResults: ["Internal tests pass.", "Stationary fork/test-source results match the Eagle 3 guide."],
    failureAction: "Remove the device from service if any required channel, antenna, or test mode fails.",
    guideId: "radar-eagle3-stationary",
    icon: "radar",
    inspectionSteps: [
      step("eagle3-stationary-setup", "Confirm Eagle 3", "format-list-checks", "Confirm exact model, antenna, mode, and test source.", [
        "Use the current Eagle 3 guide and service policy."
      ]),
      step("eagle3-stationary-inspect", "Inspect system", "car-connected", "Check antenna, display, remote, cables, mounts, and power.", [
        "Confirm the system is installed and powered correctly."
      ])
    ],
    jurisdiction: "Canada",
    limitations: ["Eagle 3 moving-mode sequences are separate and model-specific."],
    manufacturer: "Kustom Signals",
    model: "Eagle 3",
    prerequisites: ["Trained RADAR operator", "Correct Eagle 3 source guide", "Correct test source"],
    requiredTraining: "Authorized RADAR operator training",
    testSteps: [
      step("eagle3-stationary-internal", "Internal test", "checkbox-marked-circle-outline", "Complete the Eagle 3 internal and display checks.", [
        "Confirm all required indicators pass."
      ]),
      step("eagle3-stationary-source", "Stationary source", "speedometer", "Use Eagle 3 stationary test/fork mode.", [
        "Follow the selected guide for values and sequence.",
        "Do not use a universal tolerance."
      ])
    ],
    title: "Stationary or Handheld RADAR Test"
  }),
  guide({
    category: "stationaryRadar",
    compactTitle: "Raptor RP-1",
    configuration: "Stationary mode",
    expectedResults: ["Automatic/manual checks pass.", "Stationary test-source values match the Raptor RP-1 guide."],
    failureAction: "Remove from service if any assisted test, antenna, display, or mode fails.",
    guideId: "radar-raptor-rp1-stationary",
    icon: "radar",
    inspectionSteps: [
      step("raptor-stationary-setup", "Confirm RP-1", "format-list-checks", "Confirm model, antenna, mode, and test source.", [
        "Use current Raptor RP-1 guide."
      ]),
      step("raptor-stationary-inspect", "Inspect system", "car-connected", "Check antenna, display, cables, mounts, and power.", [
        "Confirm intended antennas are available."
      ])
    ],
    jurisdiction: "Canada",
    limitations: ["Raptor assisted tests must not be bypassed when required."],
    manufacturer: "Kustom Signals",
    model: "Raptor RP-1",
    prerequisites: ["Trained RADAR operator", "Correct Raptor guide", "Correct low/high test source where required"],
    requiredTraining: "Authorized RADAR operator training",
    testSteps: [
      step("raptor-stationary-internal", "Internal test", "checkbox-marked-circle-outline", "Complete automatic/manual internal checks.", [
        "Confirm required display, antenna, and audio indicators."
      ]),
      step("raptor-stationary-assisted", "Assisted test", "speedometer", "Enter Fork Test or Assisted Fork Test and follow prompts.", [
        "Test required signals and intended stationary modes.",
        "Use only guide-specific expected values."
      ], "Do not bypass a failed assisted test.")
    ],
    title: "Stationary or Handheld RADAR Test"
  }),
  guide({
    category: "movingRadar",
    compactTitle: "Eagle 3 Moving",
    configuration: "Moving mode",
    expectedResults: [
      "Patrol and target displays match the Eagle 3 expected values.",
      "Required front/rear antennas and intended modes pass."
    ],
    failureAction: "If any required moving-mode channel or antenna fails, remove the RADAR from service.",
    guideId: "radar-eagle3-moving",
    icon: "car-speed-limiter",
    inspectionSteps: [
      step("eagle3-moving-confirm", "Confirm moving setup", "car-info", "Confirm Eagle 3, intended antenna, and moving mode.", [
        "Moving-mode sequences are model-specific."
      ]),
      step("eagle3-moving-precheck", "Complete pre-check", "checkbox-marked-circle-outline", "Complete the internal test before moving-mode checks.", [
        "Do not continue if the internal test fails."
      ])
    ],
    jurisdiction: "Canada",
    limitations: ["Do not apply Eagle 3 moving procedures to any other RADAR model."],
    manufacturer: "Kustom Signals",
    model: "Eagle 3",
    prerequisites: ["Trained RADAR operator", "Current Eagle 3 guide", "Correct moving-mode test sources"],
    requiredTraining: "Authorized moving RADAR operator training",
    testSteps: [
      step("eagle3-moving-opposite", "Opposite direction", "swap-horizontal", "Follow the Eagle 3 Moving Opposite procedure.", [
        "Confirm Patrol and Target displays against manufacturer values."
      ]),
      step("eagle3-moving-same", "Same direction", "swap-horizontal-bold", "Follow the Eagle 3 Moving Same Direction procedure.", [
        "Repeat for required antennas and intended modes."
      ], "Stop if expected values do not match the selected guide.")
    ],
    title: "Moving RADAR Test"
  }),
  guide({
    category: "movingRadar",
    compactTitle: "Raptor RP-1 Moving",
    configuration: "Moving mode",
    expectedResults: ["Assisted moving tests pass.", "Required patrol/target values match the selected guide."],
    failureAction: "Remove from service if any assisted moving test or required operating mode fails.",
    guideId: "radar-raptor-rp1-moving",
    icon: "car-speed-limiter",
    inspectionSteps: [
      step("raptor-moving-confirm", "Confirm RP-1", "car-info", "Confirm exact Raptor RP-1 configuration and moving mode.", [
        "Confirm front/rear antenna needs before testing."
      ]),
      step("raptor-moving-precheck", "Internal checks", "checkbox-marked-circle-outline", "Complete automatic/manual checks before moving-mode tests.", [
        "Do not continue after a failed internal check."
      ])
    ],
    jurisdiction: "Canada",
    limitations: ["Do not bypass a failed assisted test.", "Do not use another manufacturer's sequence."],
    manufacturer: "Kustom Signals",
    model: "Raptor RP-1",
    prerequisites: ["Trained RADAR operator", "Current Raptor RP-1 guide", "Correct low/high fork or test signals"],
    requiredTraining: "Authorized moving RADAR operator training",
    testSteps: [
      step("raptor-moving-assisted", "Assisted test", "progress-check", "Enter Fork Test or Assisted Fork Test and follow prompts.", [
        "Test required low/high signals.",
        "Test all intended operating modes."
      ]),
      step("raptor-moving-antennas", "Antennas", "radar", "Test front and rear antennas where applicable.", [
        "Confirm model-specific expected results."
      ], "Remove from service if any intended mode fails.")
    ],
    title: "Moving RADAR Test"
  }),
  guide({
    category: "asd",
    compactTitle: "Alco-Sensor FST",
    configuration: "Canadian approved-device workflow",
    expectedResults: ["Device powers on cleanly.", "No fault, service, temperature, or calibration error appears.", "Ready state appears when applicable."],
    failureAction: "If the ASD fails a required check, remove it from service and notify the designated authority.",
    guideId: "asd-alco-sensor-fst",
    icon: "test-tube",
    inspectionSteps: [
      step("fst-approved", "Confirm approval", "file-certificate-outline", "Confirm the device appears in the current Approved Screening Devices Order.", [
        "Confirm police-service authorization for the exact device and configuration."
      ]),
      step("fst-inspect", "Inspect device", "magnify", "Check housing, display, battery, mouthpiece connection, sensor area, and accessories.", [
        "Confirm calibration, service, maintenance, and accuracy-check status."
      ])
    ],
    jurisdiction: "Canada",
    limitations: ["Accuracy checks require authorized training and exact program standards.", "Do not perform calibration unless specifically authorized."],
    manufacturer: "Intoximeters",
    model: "Alco-Sensor FST",
    prerequisites: ["Trained and authorized ASD operator", "Current Approved Screening Devices Order checked", "Police-service configuration confirmed"],
    requiredTraining: "Authorized ASD training",
    testSteps: [
      step("fst-power", "Power-up", "power", "Power on and allow automatic self-test.", [
        "Confirm no fault, service, temperature, or calibration error.",
        "Confirm blank/zero check where applicable."
      ]),
      step("fst-authorized-check", "Accuracy check", "account-check-outline", "Use only the approved standard and exact authorized procedure.", [
        "Confirm standard type, expiry, traceability, and temperature requirements.",
        "Compare result with the applicable program/manufacturer tolerance only."
      ], "Do not use another model or jurisdiction's tolerance.")
    ],
    title: "ASD Test"
  }),
  guide({
    category: "asd",
    compactTitle: "Drager 7000",
    configuration: "Canadian Police",
    expectedResults: ["Device self-test passes.", "No service or temperature error appears.", "Ready state appears when applicable."],
    failureAction: "If the ASD fails a required check, remove it from service and notify the designated authority.",
    guideId: "asd-draeger-7000-canada",
    icon: "test-tube",
    inspectionSteps: [
      step("draeger-approved", "Confirm approval", "file-certificate-outline", "Confirm the device appears in the current Approved Screening Devices Order.", [
        "Confirm exact Canadian police configuration."
      ]),
      step("draeger-inspect", "Inspect device", "magnify", "Check housing, display, battery, mouthpiece connection, sensor area, and accessories.", [
        "Confirm calibration, service, maintenance, and accuracy-check status."
      ])
    ],
    jurisdiction: "Canada",
    limitations: ["Accuracy checks require authorized training and exact program standards.", "This guide does not include unauthorized calibration steps."],
    manufacturer: "Drager",
    model: "Alcotest 7000 Canadian Police",
    prerequisites: ["Trained and authorized ASD operator", "Current Approved Screening Devices Order checked", "Police-service configuration confirmed"],
    requiredTraining: "Authorized ASD training",
    testSteps: [
      step("draeger-power", "Power-up", "power", "Power on and allow automatic self-test.", [
        "Confirm no fault, service, temperature, or calibration error."
      ]),
      step("draeger-authorized-check", "Accuracy check", "account-check-outline", "Use only the approved standard and exact authorized procedure.", [
        "Follow the exact Drager, program, and police-service procedure.",
        "Apply only the applicable program/manufacturer tolerance."
      ], "If the check fails, remove the device from service.")
    ],
    title: "ASD Test"
  }),
  guide({
    category: "breathInstrument",
    compactTitle: "Breath Instrument",
    configuration: "Qualified technician only",
    expectedResults: ["System checks complete as required by the exact instrument and program.", "Required record/output is reviewed according to procedure."],
    failureAction: "If a required instrument check fails, remove the instrument from service and follow the designated authority process.",
    guideId: "breath-instrument-qualified-technician",
    icon: "gauge",
    inspectionSteps: [
      step("breath-qualified", "Confirm qualification", "account-key-outline", "Confirm qualified-technician designation and training.", [
        "Confirm exact approved model and current program procedure."
      ]),
      step("breath-inspect", "Inspect instrument", "printer-check", "Check power, printer, paper, sample pathway, standard connection, and accessories.", [
        "Confirm maintenance/service and approved standard status."
      ])
    ],
    jurisdiction: "Canada",
    limitations: [
      "No subject demand scripts.",
      "No evidentiary sample-taking sequences.",
      "No certificate-completion advice.",
      "No unauthorized calibration instructions."
    ],
    manufacturer: "Current Approved Breath Analysis Instruments Order",
    model: "Approved instrument list",
    prerequisites: ["Qualified technician confirmation", "Exact approved model confirmed", "Current manufacturer, forensic-program, and police-service procedure available"],
    requiredTraining: "Qualified technician designation and exact-instrument training",
    requiresQualifiedTechnician: true,
    testSteps: [
      step("breath-diagnostics", "Diagnostics", "progress-check", "Allow self-diagnostics and required temperature state to complete.", [
        "Confirm display and printer readiness.",
        "Confirm air blank or zero checks where required."
      ]),
      step("breath-system-check", "System check", "format-list-checks", "Follow the exact approved instrument system-check procedure.", [
        "Confirm required result record according to the current program.",
        "Review errors before use."
      ], "Remove from service if a required check fails.")
    ],
    title: "Approved Breath Instrument Check"
  })
];

export const deviceModelOptions: DeviceModelOption[] = [
  {
    category: "lidar",
    configuration: "RCMP Configuration",
    guideId: "lidar-prolaser4-rcmp",
    id: "lidar-prolaser4-rcmp",
    jurisdiction: "Canada",
    manufacturer: "Kustom Signals",
    model: "ProLaser 4",
    supported: true
  },
  {
    category: "lidar",
    configuration: "Current manual required",
    guideId: "",
    id: "lidar-other",
    jurisdiction: "Current agency procedure",
    manufacturer: "Other LIDAR",
    model: "Consult Current Manufacturer Manual",
    supported: false
  },
  {
    category: "stationaryRadar",
    configuration: "Ontario / Canadian guide",
    guideId: "radar-falcon-hr-ontario",
    id: "radar-falcon-hr-ontario",
    jurisdiction: "Ontario / Canada",
    manufacturer: "Kustom Signals",
    model: "Falcon HR",
    supported: true
  },
  {
    category: "stationaryRadar",
    configuration: "Stationary mode",
    guideId: "radar-eagle3-stationary",
    id: "radar-eagle3-stationary",
    jurisdiction: "Canada",
    manufacturer: "Kustom Signals",
    model: "Eagle 3",
    supported: true
  },
  {
    category: "stationaryRadar",
    configuration: "Stationary mode",
    guideId: "radar-raptor-rp1-stationary",
    id: "radar-raptor-rp1-stationary",
    jurisdiction: "Canada",
    manufacturer: "Kustom Signals",
    model: "Raptor RP-1",
    supported: true
  },
  {
    category: "stationaryRadar",
    configuration: "Current manual required",
    guideId: "",
    id: "radar-other-stationary",
    jurisdiction: "Current agency procedure",
    manufacturer: "Other RADAR",
    model: "Consult Current Manufacturer Manual",
    supported: false
  },
  {
    category: "movingRadar",
    configuration: "Moving mode",
    guideId: "radar-eagle3-moving",
    id: "radar-eagle3-moving",
    jurisdiction: "Canada",
    manufacturer: "Kustom Signals",
    model: "Eagle 3",
    supported: true
  },
  {
    category: "movingRadar",
    configuration: "Moving mode",
    guideId: "radar-raptor-rp1-moving",
    id: "radar-raptor-rp1-moving",
    jurisdiction: "Canada",
    manufacturer: "Kustom Signals",
    model: "Raptor RP-1",
    supported: true
  },
  {
    category: "movingRadar",
    configuration: "Current manual required",
    guideId: "",
    id: "radar-other-moving",
    jurisdiction: "Current agency procedure",
    manufacturer: "Other Moving RADAR",
    model: "Consult Current Manufacturer Manual",
    supported: false
  },
  {
    category: "asd",
    configuration: "Canadian approved-device workflow",
    guideId: "asd-alco-sensor-fst",
    id: "asd-alco-sensor-fst",
    jurisdiction: "Canada",
    manufacturer: "Intoximeters",
    model: "Alco-Sensor FST",
    supported: true
  },
  {
    category: "asd",
    configuration: "Canadian Police",
    guideId: "asd-draeger-7000-canada",
    id: "asd-draeger-7000-canada",
    jurisdiction: "Canada",
    manufacturer: "Drager",
    model: "Alcotest 7000 Canadian Police",
    supported: true
  },
  {
    category: "asd",
    configuration: "Current order required",
    guideId: "",
    id: "asd-other",
    jurisdiction: "Canada",
    manufacturer: "Other ASD",
    model: "Current Approved Screening Devices Order",
    supported: false
  },
  {
    category: "breathInstrument",
    configuration: "Qualified technician only",
    guideId: "breath-instrument-qualified-technician",
    id: "breath-instrument-qualified-technician",
    jurisdiction: "Canada",
    manufacturer: "Approved Instrument List",
    model: "Current approved instrument",
    supported: true
  }
];
