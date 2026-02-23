import { createTheme } from "@mui/material/styles";

/*
 * Earthplate palette — chosen from original 5-color swatch:
 *   CCD5AE  Tea Green      ← eco / nature accent
 *   D4A373  Light Bronze   ← primary action & brand warmth
 *   FEFAE0  Cornsilk       ← warm background base
 */
export const PALETTE = {
  sage: "#CCD5AE",
  sageLight: "#E2E8D0",
  sageDark: "#8FA07A",
  cream: "#FEFAE0",
  warmBeige: "#F5EDE2",
  warmBrown: "#D4A373",

  background: "#FAFAF5",
  surface: "#FFFFFF",
  surfaceSecondary: "#F5F3EE",
  surfaceTinted: "#FEFAE0",

  accent: "#B8864F",
  accentRaw: "#D4A373",
  accentLight: "#F5E8D8",
  accentDark: "#9A6F3C",

  eco: "#CCD5AE",
  ecoMedium: "#8FA07A",
  ecoDeep: "#5C6E48",
  ecoDark: "#3D4E30",

  textPrimary: "#1C1C1E",
  textSecondary: "#6E6E73",
  textTertiary: "#AEAEB2",
  separator: "rgba(60, 60, 67, 0.12)",
  glass: "rgba(255, 255, 255, 0.78)",
  glassBorder: "rgba(255, 255, 255, 0.45)",
};

const SF_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, "Helvetica Neue", Arial, sans-serif';

export const appTheme = createTheme({
  palette: {
    primary: { main: PALETTE.accent, light: PALETTE.accentRaw, dark: PALETTE.accentDark, contrastText: "#fff" },
    secondary: { main: PALETTE.sage, light: PALETTE.sageLight, dark: PALETTE.sageDark, contrastText: "#2d3319" },
    background: { default: PALETTE.background, paper: PALETTE.surface },
    text: { primary: PALETTE.textPrimary, secondary: PALETTE.textSecondary, disabled: PALETTE.textTertiary },
    divider: PALETTE.separator,
  },
  typography: {
    fontFamily: SF_FONT,
    h1: { fontSize: "2.125rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.18 },
    h2: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 },
    h3: { fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.25 },
    h4: { fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 },
    h5: { fontSize: "1.0625rem", fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.47 },
    body2: { fontSize: "0.9375rem", fontWeight: 400, lineHeight: 1.45 },
    caption: { fontSize: "0.8125rem", fontWeight: 400, lineHeight: 1.35 },
    overline: { fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" },
    button: { fontWeight: 600, textTransform: "none", fontSize: "1.0625rem" },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: "none", fontWeight: 600, boxShadow: "none", "&:hover": { boxShadow: "none" } },
        contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none", borderRadius: 14 } } },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: PALETTE.surfaceSecondary,
            "& fieldset": { borderColor: "transparent" },
            "&:hover fieldset": { borderColor: PALETTE.separator },
            "&.Mui-focused fieldset": { borderColor: PALETTE.accent, borderWidth: 1.5 },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: { root: { color: PALETTE.textTertiary, "&.Mui-checked": { color: PALETTE.accent } } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 99, height: 6 }, bar: { borderRadius: 99 } },
    },
  },
});
