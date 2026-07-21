import assert from "node:assert/strict";
import test from "node:test";
import { buildPersonDescription, buildVehicleDescription } from "./descriptionBuilder.ts";

test("person description includes only entered details", () => {
  const value = buildPersonDescription({ clothing: "dark jacket", direction: "westbound" });
  assert.match(value, /dark jacket/);
  assert.match(value, /westbound/);
  assert.doesNotMatch(value, /unknown hair/i);
});

test("vehicle description preserves uncertainty and partial plate", () => {
  const value = buildVehicleDescription({
    bodyStyle: "four-door sedan",
    colour: "dark",
    makeModel: "Honda Civic",
    makeModelCertainty: "possible",
    plate: "ABC"
  });
  assert.match(value, /possibly Honda Civic/);
  assert.match(value, /partial plate ABC/);
});

