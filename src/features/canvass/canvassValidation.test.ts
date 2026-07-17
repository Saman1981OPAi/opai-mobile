import assert from "node:assert/strict";
import test from "node:test";
import { validateCanvassEntry, validateCanvassSession } from "./canvassValidation.ts";

test("normalizes a canvass session", () => {
  assert.equal(validateCanvassSession({ title: "  Area check  " }).title, "Area check");
});

test("requires a usable canvass address and timestamp", () => {
  const valid = { address: "100 Example Street", date: "2030-07-20", notes: "No answer", sessionId: "session", time: "19:15" };
  assert.equal(validateCanvassEntry(valid).address, valid.address);
  assert.throws(() => validateCanvassEntry({ ...valid, address: "" }), /address/);
  assert.throws(() => validateCanvassEntry({ ...valid, time: "31:00" }), /HH:MM/);
});
