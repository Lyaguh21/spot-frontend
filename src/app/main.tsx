import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./providers/store/store";
import { Router } from "./providers/routes/Router";
import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider
        theme={theme}
        defaultColorScheme="dark"
        forceColorScheme="dark"
      >
        <Notifications position="top-center" />
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
