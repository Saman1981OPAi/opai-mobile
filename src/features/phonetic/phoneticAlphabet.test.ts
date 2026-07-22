import assert from "node:assert/strict";
import test from "node:test";
import { toNatoPhonetic } from "./phoneticAlphabet.ts";

test("phonetic utility handles mixed letters digits spaces and punctuation", () => {
  assert.equal(toNatoPhonetic("CXYR 248!"), "Charlie - X-ray - Yankee - Romeo - Space - Two - Four - Eight - !");
});
