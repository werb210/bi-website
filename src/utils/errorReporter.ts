import { apiPost } from "../api/request";

export function reportError(error: unknown) {
  if (import.meta.env.PROD) {
    void apiPost("/error-log", { error: String(error) }).catch(() => {});
  }
}
