import assert from "node:assert/strict";
import test from "node:test";
import { ageOnDate, basicArithmetic, cleanNumber, convertUnit, decimalToDms, dmsToDecimal, elapsedMinutes, parseFiniteNumber } from "./calculatorCore.ts";

test("calculator conversions use stable constants", () => {
  assert.equal(cleanNumber(convertUnit("distance-long", 1)), "0.6214");
  assert.equal(cleanNumber(convertUnit("temperature", 0)), "32");
  assert.equal(cleanNumber(convertUnit("speed", 100)), "62.1371");
});

test("calculator handles midnight age coordinates and arithmetic", () => {
  assert.equal(elapsedMinutes("23:45", "00:15"), 30);
  assert.equal(ageOnDate("2000-07-22", new Date("2026-07-21T12:00:00")), 25);
  assert.deepEqual(decimalToDms(-79.5), { degrees: -79, minutes: 30, seconds: 0 });
  assert.equal(cleanNumber(dmsToDecimal(-79, 30, 0)), "-79.5");
  assert.equal(basicArithmetic(50, "%", 10), 5);
});

test("calculator rejects unsafe input", () => {
  assert.throws(() => parseFiniteNumber("2+2"));
  assert.throws(() => basicArithmetic(4, "/", 0));
});
