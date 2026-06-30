import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@mantine-bites/lightbox/styles.css";
import "@gfazioli/mantine-onboarding-tour/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./providers/store/store";
import { Router } from "./providers/routes/Router";
import { theme } from "./theme";
import PwaInstallPrompt from "./providers/pwa/PwaInstallPrompt";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider
        theme={theme}
        defaultColorScheme="dark"
        forceColorScheme="dark"
      >
        <Notifications position="top-center" />
        <PwaInstallPrompt />
        <Router />
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
