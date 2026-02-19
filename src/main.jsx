import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";

const theme = extendTheme({
  fonts: {
    heading: '"Nunito", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Nunito", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  colors: {
    brand: {
      50: "#e8f0ec",
      100: "#c5d9cf",
      200: "#9fbfb0",
      300: "#7aa591",
      400: "#5a8a72",
      500: "#5a7a6a",
      600: "#4d6b5d",
      700: "#445d50",
      800: "#3a4f44",
      900: "#2d3d34",
    },
  },
  radii: {
    card: "24px",
    touch: "16px",
  },
  shadows: {
    card: "0 20px 50px rgba(55, 45, 35, 0.08)",
    button: "0 8px 24px rgba(90, 122, 106, 0.22)",
    fab: "0 2px 8px rgba(90, 122, 106, 0.35)",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
