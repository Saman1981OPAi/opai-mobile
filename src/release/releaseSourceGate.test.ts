import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("Translation route uses the authenticated Build 25 screen", () => {
  const moduleScreen = read("src/screens/ModuleScreen.tsx");

  assert.match(
    moduleScreen,
    /<Build25TranslationScreen history=\{localData\.translationHistory\} \/>/
  );
  assert.doesNotMatch(moduleScreen, /function TranslationScreen\s*\(/);
  assert.equal(existsSync("src/services/translationService.ts"), false);
});

test("Device Testing remains hidden", () => {
  assert.match(
    read("src/config/release.ts"),
    /export const DEVICE_TESTING_VISIBLE = false;/
  );
});

test("internal certification label is gated by the staging environment", () => {
  const header = read("src/components/ui/AppHeader.tsx");

  assert.match(header, /resolveAppRuntimeEnvironment\(\) === "staging"/);
  assert.match(header, /Internal Certification/);
});

test("clean-install seed construction gates every synthetic operational collection", () => {
  const source = read("src/storage/seedDataService.ts");
  const defaultData = source.slice(source.indexOf("export function createDefaultLocalAppData"));
  const gatedCollections = [
    "calendarEvents",
    "calendarWorkflowEvents",
    "courtWorkflowEvents",
    "followUpWorkflowReminders",
    "incidentDrafts",
    "notesFiles",
    "structuredNotes",
    "fileMetadataPlaceholders",
    "requalificationWorkflowReminders",
    "trainingWorkflowEvents",
    "scheduledReminders"
  ];

  for (const collection of gatedCollections) {
    assert.match(
      defaultData,
      new RegExp(`${collection}: selectSyntheticSeedData\\(`),
      `${collection} must be gated by the runtime environment`
    );
  }
});

test("migration fallbacks never introduce synthetic operational records", () => {
  const migration = read("src/storage/migrationService.ts");
  const prohibitedConstructors = [
    "createDefaultCalendarWorkflowEvents",
    "createDefaultCourtWorkflowEvents",
    "createDefaultFileMetadataPlaceholders",
    "createDefaultFollowUpWorkflowReminders",
    "createDefaultRequalificationWorkflowReminders",
    "createDefaultScheduledReminders",
    "createDefaultStructuredNotes",
    "createDefaultTrainingWorkflowEvents"
  ];

  for (const constructor of prohibitedConstructors) {
    assert.equal(migration.includes(constructor), false);
  }
});
