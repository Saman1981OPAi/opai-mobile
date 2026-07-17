import assert from "node:assert/strict";
import test from "node:test";
import { mentalHealthResources } from "./mentalHealthResources.ts";

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
