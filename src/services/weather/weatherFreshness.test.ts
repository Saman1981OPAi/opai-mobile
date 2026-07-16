import assert from "node:assert/strict";
import test from "node:test";
import { isWeatherCacheStale, weatherCacheDurationMs } from "./weatherFreshness.ts";

const now = Date.parse("2026-07-13T18:00:00.000Z");

test("keeps recently cached weather fresh", () => {
  assert.equal(isWeatherCacheStale(new Date(now - weatherCacheDurationMs + 1).toISOString(), now), false);
});

test("marks weather stale at the cache threshold and after it", () => {
  assert.equal(isWeatherCacheStale(new Date(now - weatherCacheDurationMs).toISOString(), now), true);
  assert.equal(isWeatherCacheStale(new Date(now - weatherCacheDurationMs - 1).toISOString(), now), true);
});

test("treats invalid or future timestamps as stale", () => {
  assert.equal(isWeatherCacheStale("invalid", now), true);
  assert.equal(isWeatherCacheStale(new Date(now + 1).toISOString(), now), true);
});
