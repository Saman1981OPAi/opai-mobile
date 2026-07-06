export const colors = {
  background: "#05070B",
  surface: "#080D16",
  elevated: "#0D1421",
  glass: "rgba(255,255,255,0.07)",
  primaryBlue: "#0A84FF",
  accentBlue: "#4DA3FF",
  ptsdGreen: "#6EDB8F",
  canadianRed: "#FF0000",
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
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 999
} as const;

export const typography = {
  title: 30,
  h1: 24,
  h2: 20,
  body: 16,
  small: 14,
  caption: 12
} as const;

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8
  }
} as const;
