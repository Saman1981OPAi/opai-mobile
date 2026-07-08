export const colors = {
  background: "#05070B",
  backgroundBlue: "#020B17",
  surface: "#080D16",
  elevated: "#0D1421",
  panel: "#07172A",
  panelStrong: "#09213C",
  glass: "rgba(255,255,255,0.07)",
  glassBlue: "rgba(10,132,255,0.10)",
  primaryBlue: "#0A84FF",
  accentBlue: "#4DA3FF",
  ptsdGreen: "#7FFFD4",
  ptsdGreenSoft: "#7FFFD4",
  canadianRed: "#FF0000",
  mapleBlue: "#0E4EA8",
  textPrimary: "#FFFFFF",
  textSecondary: "#D8DEE8",
  textMuted: "#A7B0C0",
  textSubtle: "rgba(255,255,255,0.58)",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(77,163,255,0.45)",
  danger: "#FF5A5F",
  warning: "#FFD166"
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 999
} as const;

export const typography = {
  hero: 34,
  title: 28,
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  small: 14,
  caption: 12,
  tiny: 10
} as const;

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8
  },
  glowBlue: {
    shadowColor: "#0A84FF",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6
  }
} as const;

export const iconSizes = {
  sm: 18,
  md: 24,
  lg: 34,
  xl: 46
} as const;

export const layout = {
  phoneMaxWidth: 460,
  tabletBreakpoint: 768,
  contentMaxWidth: 1180,
  bottomNavHeight: 86
} as const;
