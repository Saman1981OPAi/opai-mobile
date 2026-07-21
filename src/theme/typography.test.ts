import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  detectTextScript,
  fontFamilies,
  fontWeights,
  getScriptAwareTextStyle,
  typographyStyles
} from "./typography.ts";

test("uses Inter for English, Latin text, dates, times, and numbers", () => {
  assert.equal(detectTextScript("Good evening, Sam"), "latin");
  assert.equal(detectTextScript("July 20, 2026 - 4:34 PM"), "latin");
  assert.equal(getScriptAwareTextStyle("Report Writing").fontFamily, fontFamilies.latin);
});

test("uses Vazirmatn with RTL direction for Persian and Arabic text", () => {
  const persian = getScriptAwareTextStyle("سلام، چطور می‌توانم کمک کنم؟");
  const arabic = getScriptAwareTextStyle("مرحبا، كيف يمكنني المساعدة؟");

  assert.equal(persian.fontFamily, fontFamilies.persianArabic);
  assert.equal(persian.writingDirection, "rtl");
  assert.equal(arabic.fontFamily, fontFamilies.persianArabic);
  assert.equal(arabic.writingDirection, "rtl");
});

test("uses the system fallback for mixed or unsupported scripts", () => {
  assert.equal(getScriptAwareTextStyle("OPAi پاسخ").fontFamily, undefined);
  assert.equal(getScriptAwareTextStyle("警察支援").fontFamily, undefined);
});

test("central type styles use only approved real font weights", () => {
  const approved = new Set<string>(Object.values(fontWeights));
  for (const style of Object.values(typographyStyles)) {
    assert.equal(approved.has(String(style.fontWeight)), true);
    assert.equal(style.letterSpacing, 0);
  }
});

function collectTsx(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectTsx(fullPath);
    return entry.name.endsWith(".tsx") ? [fullPath] : [];
  });
}

test("application text uses the centralized typography primitives", () => {
  const root = process.cwd();
  const sources = [path.join(root, "App.tsx"), ...collectTsx(path.join(root, "src"))];
  for (const sourcePath of sources) {
    if (sourcePath.endsWith(path.join("ui", "Typography.tsx"))) continue;
    const source = readFileSync(sourcePath, "utf8");
    assert.doesNotMatch(
      source,
      /import\s*\{[^}]*\b(?:Text|TextInput)\b[^}]*\}\s*from\s*["']react-native["']/s,
      sourcePath
    );
    assert.doesNotMatch(source, /fontWeight\s*:\s*["'](?:800|900)["']/, sourcePath);
  }
});

test("native app configuration embeds all approved static font weights", () => {
  const appConfig = readFileSync(path.join(process.cwd(), "app.json"), "utf8");
  for (const weight of ["400Regular", "500Medium", "600SemiBold", "700Bold"]) {
    assert.match(appConfig, new RegExp(`Inter_${weight}\\.ttf`));
    assert.match(appConfig, new RegExp(`Vazirmatn_${weight}\\.ttf`));
  }
  assert.doesNotMatch(appConfig, /https?:\/\/.*\.(?:ttf|otf)/);
});
