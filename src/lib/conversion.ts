import { apiPost } from "../api/request";

export function trackConversion(event: string, data: Record<string, unknown> = {}) {

  const payload = {
    event,
    timestamp: Date.now(),
    campaign: JSON.parse(localStorage.getItem("bi_campaign") || "{}"),
    referrer: localStorage.getItem("bi_referrer_code"),
    data
  }

  void apiPost("/api/v1/marketing-event", payload).catch(() => {});

}
