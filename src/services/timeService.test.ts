import assert from "node:assert/strict";
import test from "node:test";
import { getTimeAwareGreeting } from "./timeService.ts";

test("selects the greeting period from local device time", () => {
  assert.equal(getTimeAwareGreeting("Sam", new Date(2026, 6, 20, 8)), "Good morning Sam");
  assert.equal(getTimeAwareGreeting("Sam", new Date(2026, 6, 20, 13)), "Good afternoon Sam");
  assert.equal(getTimeAwareGreeting("Sam", new Date(2026, 6, 20, 19)), "Good evening Sam");
  assert.equal(getTimeAwareGreeting("Sam", new Date(2026, 6, 20, 23)), "Good night Sam");
});

test("uses Officer when the profile has no first name", () => {
  assert.equal(getTimeAwareGreeting("   ", new Date(2026, 6, 20, 8)), "Good morning Officer");
});
