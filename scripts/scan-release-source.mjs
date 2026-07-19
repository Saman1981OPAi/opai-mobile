import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const trackedFiles = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const prohibitedFiles = trackedFiles.filter((file) =>
  /(^|\/)\.env$|\.ipa$|\.mobileprovision$|\.p12$|\.p8$|\.pem$|\.key$/i.test(file),
);
assert.deepEqual(prohibitedFiles, [], `Prohibited tracked files: ${prohibitedFiles.join(", ")}`);

const sourceFiles = trackedFiles.filter(
  (file) =>
    file === "App.tsx" ||
    file === "app.json" ||
    file === "eas.json" ||
    file.startsWith("src/") ||
    file.startsWith("modules/"),
);

const findings = [];
for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  if (/api\.openai\.com/i.test(content)) {
    findings.push(`${file}: direct OpenAI endpoint`);
  }
  if (/sk-(?:proj-)?[A-Za-z0-9_-]{20,}/.test(content)) {
    findings.push(`${file}: API-key-shaped value`);
  }
  if (/OPENAI_API_KEY\s*[:=]\s*["'][^"']+["']/.test(content)) {
    findings.push(`${file}: populated OpenAI key variable`);
  }
}
assert.deepEqual(findings, [], `Release source scan failed:\n${findings.join("\n")}`);

const app = JSON.parse(readFileSync("app.json", "utf8"));
const backgroundModes = app.expo?.ios?.infoPlist?.UIBackgroundModes ?? [];
assert.ok(!backgroundModes.includes("audio"), "Background audio mode must remain disabled");

const androidPermissions = app.expo?.android?.permissions ?? [];
assert.ok(
  !androidPermissions.includes("android.permission.FOREGROUND_SERVICE_MICROPHONE"),
  "Background microphone service permission must remain disabled",
);

const audioPlugin = (app.expo?.plugins ?? []).find(
  (plugin) => Array.isArray(plugin) && plugin[0] === "expo-audio",
);
assert.notEqual(
  audioPlugin?.[1]?.enableBackgroundRecording,
  true,
  "expo-audio background recording must remain disabled",
);

console.log("Release source scan clear.");
