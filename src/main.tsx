import "./index.css";
import "./styles.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { validateEnv } from "./config/envGuard";
import { apiRequest } from "./api/request";
import { initAnalytics } from "./lib/analytics";
import { captureCampaign } from "./lib/campaignTracker";
import { flushEvents } from "./lib/marketing/eventQueue";
import { captureReferral } from "./lib/referralTracker";
import { processQueue } from "./lib/uploadQueue";

async function assertApiHealth() {
  await apiRequest("/api/v1/health");
}

async function bootstrap() {
  validateEnv();
  await assertApiHealth();

  captureCampaign();
  captureReferral();
  initAnalytics();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  window.addEventListener("load", () => {
    flushEvents();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  });

  window.addEventListener("online", () => {
    processQueue();
  });
}

bootstrap();
