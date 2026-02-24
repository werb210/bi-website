const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export async function apiPost<T = any>(
  path: string,
  body: unknown
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}
