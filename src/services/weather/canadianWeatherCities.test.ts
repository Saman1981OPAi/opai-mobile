import assert from "node:assert/strict";
import test from "node:test";
import {
  canadianWeatherCities,
  defaultWeatherCity,
  searchCanadianWeatherCities
} from "./canadianWeatherCities.ts";

const requiredCities = [
  "Toronto",
  "Ottawa",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Winnipeg",
  "Halifax",
  "Quebec City",
  "Hamilton",
  "London",
  "Mississauga",
  "Brampton",
  "Markham",
  "Vaughan",
  "Richmond Hill",
  "Aurora",
  "Newmarket"
];

test("bundles the approved 18-city Canadian catalogue", () => {
  assert.equal(canadianWeatherCities.length, requiredCities.length);
  assert.deepEqual(canadianWeatherCities.map((item) => item.city), requiredCities);
  assert.equal(defaultWeatherCity.city, "Toronto");
});

test("keeps city metadata complete and coordinates valid", () => {
  const keys = new Set<string>();
  for (const city of canadianWeatherCities) {
    const key = `${city.city}-${city.province}`;
    assert.equal(keys.has(key), false);
    keys.add(key);
    assert.ok(city.latitude >= -90 && city.latitude <= 90);
    assert.ok(city.longitude >= -180 && city.longitude <= 180);
    assert.ok(city.timezone.startsWith("America/"));
  }
});

test("searches locally by city or province without case sensitivity", () => {
  assert.deepEqual(searchCanadianWeatherCities("AURORA").map((item) => item.city), ["Aurora"]);
  assert.ok(searchCanadianWeatherCities("ontario").length >= 10);
  assert.equal(searchCanadianWeatherCities("not-a-city").length, 0);
  assert.equal(searchCanadianWeatherCities(" ").length, requiredCities.length);
});
