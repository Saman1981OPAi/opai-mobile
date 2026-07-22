import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(relative: string) {
  return readFileSync(new URL(relative, import.meta.url), "utf8");
}

const tools = source("./ToolsScreen.tsx");
const notebook = source("../notebook/ShiftNotebookScreen.tsx");
const timeline = source("../timeline/TimelineBuilderScreen.tsx");
const descriptions = source("../descriptions/DescriptionBuilderScreen.tsx");
const calculator = source("../calculator/CalculatorScreen.tsx");
const checklists = source("../checklists/ChecklistDetailScreen.tsx");

test("Daily Policing Tools expose only approved local workflows", () => {
  const combined = [tools, notebook, timeline, descriptions, calculator, checklists].join("\n");
  for (const required of ["ShiftNotebookScreen", "TimelineBuilderScreen", "DescriptionBuilderScreen", "PhoneticScreen", "CalculatorScreen", "ChecklistLibraryScreen"]) {
    assert.equal(tools.includes(required), true);
  }
  assert.equal(/mailto:|api\.openai\.com|Google Maps|My Location|Distance Tool/i.test(combined), false);
});

test("long operational lists are virtualized and editors remain keyboard safe", () => {
  assert.equal(notebook.includes("<FlatList"), true);
  assert.equal(notebook.includes("<KeyboardAvoidingView"), true);
  assert.equal(timeline.includes("<FlatList"), true);
  assert.equal(descriptions.includes("<FlatList"), true);
  assert.equal(checklists.includes("<FlatList"), true);
});

test("approved protected handoffs and local utility controls are reachable", () => {
  for (const label of ["Create Report", "Append Latest Report", "Photo", "Audio", "Delete"]) assert.equal(notebook.includes(`label=\"${label}\"`), true);
  assert.equal(notebook.includes('"Archive"'), true);
  for (const label of ["Create Report", "Append Latest"]) assert.equal(timeline.includes(`label=\"${label}\"`), true);
  for (const label of ["Save", "Saved (", "Notebook", "Create Report"]) assert.equal(descriptions.includes(label), true);
  for (const label of ["Coordinates", "To DMS", "To Decimal", "Elapsed Time", "Arithmetic / Percentage"]) assert.equal(calculator.includes(label), true);
  for (const label of ["Copy Incomplete", "Notes to Notebook", "Duplicate", "Archive", "Reset"]) assert.equal(checklists.includes(label), true);
});
