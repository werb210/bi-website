const API_URL = import.meta.env.VITE_API_URL;

function normalizeBiPath(path: string) {
  if (path.startsWith("/api/v1/application/")) {
    return path.replace("/api/v1/application/", "/api/v1/bi/application/");
  }

  if (path === "/api/v1/application/by-phone") {
    return "/api/v1/bi/application/by-phone";
  }

  return path;
}

export function getApiBaseUrl() {
  return API_URL;
}

export async function apiRequest<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const normalizedPath = normalizeBiPath(path);
  const res = await fetch(`${API_URL}${normalizedPath}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...(options.credentials ? { credentials: options.credentials } : {}),
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
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options,
  });
}
