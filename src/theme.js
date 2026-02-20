import { createTheme } from "@mui/material/styles";

/**
 * Earthplate palette (HCI prototype)
 * ccd5ae, e9edc9, fefae0, faedcd, d4a373
 */
export const PALETTE = {
  sage: "#ccd5ae",
  sageLight: "#e9edc9",
  cream: "#fefae0",
  warmBeige: "#faedcd",
  warmBrown: "#d4a373",
};

export const appTheme = createTheme({
  palette: {
    primary: {
      main: PALETTE.warmBrown,
      light: "#e0b892",
      dark: "#b8864f",
      contrastText: "#fff",
    },
    secondary: {
      main: PALETTE.sage,
      light: PALETTE.sageLight,
      dark: "#a8b88a",
      contrastText: "#2d3319",
    },
    background: {
      default: PALETTE.cream,
      paper: PALETTE.warmBeige,
    },
  },
  typography: {
    fontFamily: '"Nunito", "Segoe UI", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(55, 45, 35, 0.06)",
        },
      },
    },
  },
});
