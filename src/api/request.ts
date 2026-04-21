const API_URL =
  import.meta.env.VITE_API_URL || "https://server.boreal.financial";

export function getApiBaseUrl() {
  return API_URL;
}

export async function apiRequest<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function apiPost<T = unknown>(path: string, body: unknown, options: RequestInit = {}) {
  return apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}
