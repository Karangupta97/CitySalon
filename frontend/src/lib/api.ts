const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface FetchOptions extends RequestInit {
  bodyData?: any;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { bodyData, ...rest } = options;
  const headers = new Headers(rest.headers || {});

  if (bodyData) {
    headers.set("Content-Type", "application/json");
    rest.body = JSON.stringify(bodyData);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    throw new Error("Received an invalid response from the server.");
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("citysalon_user");
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/salon/login";
    }
    throw new Error(data?.message || `Server error: ${response.status} ${response.statusText}`);
  }

  return data;
}
