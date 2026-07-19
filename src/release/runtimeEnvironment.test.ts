import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveAppRuntimeEnvironment,
  selectSyntheticSeedData,
  shouldIncludeSyntheticSeedData
} from "../config/runtimeEnvironment.ts";

test("production and TestFlight-compatible defaults contain no synthetic records", () => {
  const syntheticRecords = () => [{ id: "fixture-1" }, { id: "fixture-2" }];

  assert.deepEqual(selectSyntheticSeedData(syntheticRecords, "production"), []);
  assert.deepEqual(selectSyntheticSeedData(syntheticRecords, undefined), []);
  assert.equal(shouldIncludeSyntheticSeedData("production"), false);
  assert.equal(resolveAppRuntimeEnvironment("production"), "production");
});

test("internal staging may opt into synthetic records", () => {
  const syntheticRecords = () => [{ id: "fixture-1" }];

  assert.equal(shouldIncludeSyntheticSeedData("staging"), true);
  assert.deepEqual(selectSyntheticSeedData(syntheticRecords, "staging"), [{ id: "fixture-1" }]);
});

test("development defaults to clean data unless fixtures are explicitly enabled through staging", () => {
  assert.equal(resolveAppRuntimeEnvironment("development"), "development");
  assert.equal(resolveAppRuntimeEnvironment("unexpected"), "development");
  assert.equal(shouldIncludeSyntheticSeedData("development"), false);
});
