import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "./index.css";
import { appTheme } from "./theme";
import { GamificationProvider } from "./context/GamificationContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <GamificationProvider>
        <App />
      </GamificationProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
