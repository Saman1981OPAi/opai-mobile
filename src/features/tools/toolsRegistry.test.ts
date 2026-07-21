import assert from "node:assert/strict";
import test from "node:test";
import { toolsRegistry } from "./toolsRegistry.ts";

test("Tools contains only the approved entries without duplicates", () => {
  assert.deepEqual(toolsRegistry.map((tool) => tool.label), ["Shift Notebook", "Timeline", "Description Builder", "Phonetic Alphabet", "Calculator", "Checklists", "Calendar"]);
  assert.equal(new Set(toolsRegistry.map((tool) => tool.id)).size, toolsRegistry.length);
  assert.equal(toolsRegistry.some((tool) => /location|distance|email/i.test(tool.label)), false);
});

