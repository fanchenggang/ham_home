import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { NewTabApp } from "./App";
import i18n from "@/lib/i18n/config";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <NewTabApp />
    </I18nextProvider>
  </React.StrictMode>
);
