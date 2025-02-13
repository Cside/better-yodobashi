import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./style.css";

Sentry.init({
  dsn: import.meta.env.DEV
    ? "https://d6f04db311083810b1aecdd573f37829@o49171.ingest.us.sentry.io/4508812083855360" // dev
    : "https://08c169747ea6e0e0d1065195518a102d@o49171.ingest.us.sentry.io/4508812084903936", // prod
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});

const root = document.getElementById("root");
if (!root) throw new Error("root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
