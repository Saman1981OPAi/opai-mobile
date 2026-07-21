import type { TextStyle } from "react-native";

export type TextScript = "arabic" | "latin" | "system";

export const fontFamilies = {
  latin: "Inter",
  persianArabic: "Vazirmatn",
  systemFallback: undefined
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700"
} as const;

export const fontSizes = {
  tiny: 10,
  caption: 12,
  metadata: 13,
  secondary: 14,
  button: 15,
  body: 16,
  compactHeading: 17,
  sectionHeading: 18,
  cardHeading: 19,
  heading: 20,
  screenTitle: 22,
  title: 28,
  displaySmall: 30,
  hero: 34,
  display: 38
} as const;

export const lineHeights = {
  caption: 16,
  secondary: 20,
  input: 24,
  body: 24,
  button: 20,
  sectionHeading: 24,
  screenTitle: 28,
  emptyStateTitle: 34
} as const;

export const typography = {
  hero: fontSizes.hero,
  title: fontSizes.title,
  h1: 24,
  h2: fontSizes.heading,
  h3: fontSizes.sectionHeading,
  body: fontSizes.body,
  small: fontSizes.secondary,
  caption: fontSizes.caption,
  tiny: fontSizes.tiny,
  input: fontSizes.body,
  button: fontSizes.button,
  sectionHeading: fontSizes.sectionHeading,
  screenTitle: fontSizes.screenTitle,
  emptyStateTitle: 26
} as const;

export const typographyStyles = {
  caption: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: lineHeights.caption
  },
  secondary: {
    fontSize: fontSizes.secondary,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: lineHeights.secondary
  },
  body: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: lineHeights.body
  },
  input: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: lineHeights.input
  },
  button: {
    fontSize: fontSizes.button,
    fontWeight: fontWeights.semiBold,
    letterSpacing: 0,
    lineHeight: lineHeights.button
  },
  sectionHeading: {
    fontSize: fontSizes.sectionHeading,
    fontWeight: fontWeights.semiBold,
    letterSpacing: 0,
    lineHeight: lineHeights.sectionHeading
  },
  screenTitle: {
    fontSize: fontSizes.screenTitle,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: lineHeights.screenTitle
  },
  emptyStateTitle: {
    fontSize: 26,
    fontWeight: fontWeights.semiBold,
    letterSpacing: 0,
    lineHeight: lineHeights.emptyStateTitle
  }
} satisfies Record<string, TextStyle>;

export const fontScaling = {
  allowFontScaling: true,
  compactControlMaxFontSizeMultiplier: 1.35
} as const;

const ARABIC_SCRIPT = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/u;
const LATIN_SCRIPT = /[A-Za-z\u00c0-\u024f\u1e00-\u1eff]/u;
const OTHER_SCRIPT =
  /[\u0370-\u052f\u0590-\u05ff\u0900-\u0d7f\u0e00-\u11ff\u1780-\u17ff\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/u;

export function detectTextScript(text: string): TextScript {
  const hasArabic = ARABIC_SCRIPT.test(text);
  const hasLatin = LATIN_SCRIPT.test(text);

  if (OTHER_SCRIPT.test(text) || (hasArabic && hasLatin)) return "system";
  if (hasArabic) return "arabic";
  return "latin";
}

function startsWithArabicScript(text: string) {
  for (const character of text) {
    if (ARABIC_SCRIPT.test(character)) return true;
    if (LATIN_SCRIPT.test(character) || OTHER_SCRIPT.test(character)) return false;
  }
  return false;
}

export function getScriptAwareTextStyle(text: string): TextStyle {
  const script = detectTextScript(text);
  if (script === "arabic") {
    return {
      fontFamily: fontFamilies.persianArabic,
      textAlign: "right",
      writingDirection: "rtl"
    };
  }
  if (script === "system") {
    return {
      fontFamily: fontFamilies.systemFallback,
      writingDirection: startsWithArabicScript(text) ? "rtl" : "ltr"
    };
  }
  return {
    fontFamily: fontFamilies.latin,
    writingDirection: "ltr"
  };
}
