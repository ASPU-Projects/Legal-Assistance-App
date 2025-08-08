import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.scss";
import "./i18n";
import i18n from "./i18n";
import { Provider } from "react-redux";
import store from "./store/store";
import Container from "./components/Container.tsx";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1d4c6a",
    },
  },
});

// مكون React يحتوي useEffect لتحميل اللغة من localStorage
function Root() {
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    i18n.changeLanguage(savedLang || "ar");
    document.documentElement.lang = savedLang || "ar";
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Container />
      </ThemeProvider>
    </Provider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
