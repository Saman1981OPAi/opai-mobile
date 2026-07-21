import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const screen = readFileSync(new URL("./AssistantScreen.tsx", import.meta.url), "utf8");
const list = readFileSync(new URL("./AssistantMessageList.tsx", import.meta.url), "utf8");
const voice = readFileSync(new URL("./useAssistantVoiceInput.ts", import.meta.url), "utf8");
const voiceApi = readFileSync(new URL("./assistantVoiceApi.ts", import.meta.url), "utf8");
const repository = readFileSync(new URL("./assistantRepository.ts", import.meta.url), "utf8");
const navigation = readFileSync(
  new URL("../../components/ui/BottomNavigation.tsx", import.meta.url),
  "utf8"
);

test("Assistant has the approved focused controls without categorized prompts", () => {
  for (const removed of ["Prompt Chips", "Suggested Actions", "Optional Report Draft", "Categories"]) {
    assert.equal(screen.includes(removed), false);
  }
  for (const required of ["New chat", "History", "onStop", "onRetry"]) {
    assert.equal(`${screen}\n${list}`.includes(required), true);
  }
});

test("Assistant message rendering is virtualized and raw content is restricted", () => {
  assert.equal(list.includes("<FlatList"), true);
  assert.equal(list.includes("html: false"), true);
  assert.equal(list.includes("image: () => null"), true);
  assert.equal(list.includes("isSafeAssistantLink"), true);
  assert.equal(list.includes("getScriptAwareTextStyle(content)"), true);
});

test("primary navigation is OPAi, Report, Translate, Calendar, Settings", () => {
  const labels = [...navigation.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(labels, ["OPAi", "Report", "Translate", "Calendar", "Settings"]);
});

test("Assistant supports explicit foreground-only voice transcription", () => {
  assert.equal(voice.includes("requestRecordingPermissionsAsync"), true);
  assert.equal(voice.includes("allowsBackgroundRecording: false"), true);
  assert.equal(voice.includes("onTranscript(response.transcript)"), true);
  assert.equal(voiceApi.includes('"/audio-statements/transcribe"'), true);
  assert.equal(voiceApi.includes("api.openai.com"), false);
  assert.equal(screen.includes("voiceInput.onPress"), true);
});

test("OPAi answers use a distinct response bubble and errors retain warning styling", () => {
  assert.equal(list.includes("OPAi response"), true);
  assert.equal(list.includes("OPAi warning"), true);
  assert.equal(list.includes("rgba(10,132,255,0.12)"), true);
  assert.equal(list.includes("rgba(255,209,102,0.09)"), true);
});

test("clearing protected Assistant data waits for queued writes before deleting keys", () => {
  const waitForQueue = repository.indexOf(
    "await (writeQueues.get(userId) ?? Promise.resolve()).catch"
  );
  const removeEncryptedData = repository.indexOf("AsyncStorage.removeItem(storageKey(userId))");
  assert.ok(waitForQueue >= 0);
  assert.ok(removeEncryptedData > waitForQueue);
});
