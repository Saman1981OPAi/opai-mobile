import assert from "node:assert/strict";
import test from "node:test";
import { mentalHealthResources } from "./mentalHealthResources.ts";
import {
  mentalHealthNextReviewDate,
  mentalHealthVerificationDate
} from "./mentalHealthSourceRegister.ts";

test("publishes only verified resources with secure official URLs", () => {
  assert.ok(mentalHealthResources.length >= 6);
  for (const resource of mentalHealthResources) {
    assert.equal(resource.status, "verified");
    assert.match(resource.officialUrl, /^https:\/\//);
    assert.ok(resource.verifiedDate);
    assert.ok(resource.nextReviewDate);
  }
});

test("resource identifiers are unique", () => {
  const ids = mentalHealthResources.map((resource) => resource.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("9-8-8 supports user-initiated call and text actions", () => {
  const helpline = mentalHealthResources.find((resource) => resource.id === "suicide-crisis-988");
  assert.equal(helpline?.callNumber, "988");
  assert.equal(helpline?.textNumber, "988");
});

test("resource verification dates match the current release review", () => {
  assert.equal(mentalHealthVerificationDate, "2026-07-18");
  assert.equal(mentalHealthNextReviewDate, "2026-10-18");
});

test("provider qualifications remain accurate and narrow", () => {
  const boots = mentalHealthResources.find((resource) => resource.id === "boots-on-the-ground");
  assert.match(boots?.audience ?? "", /sworn and civilian personnel/);
  assert.equal(boots?.displayNumber, "1-833-677-BOOT (2668)");

  const directory = mentalHealthResources.find((resource) => resource.id === "211-canada");
  assert.match(directory?.coverage ?? "", /availability vary by region/);
  assert.match(directory?.service ?? "", /government and community-based services/);

  const cope = mentalHealthResources.find((resource) => resource.id === "yssn-310-cope");
  assert.equal(cope?.coverage, "York Region, South Simcoe, and North York");
  assert.match(cope?.disclosure ?? "", /quality and training/);
});
