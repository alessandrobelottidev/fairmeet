import { refreshAccessToken } from "./auth";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

async function performFetch<T>(
  path: string,
  token: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...restOptions } = options;

  const queryParams = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString()
    : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${path}${queryParams}`,
    {
      ...restOptions,
      credentials: "include",
      headers: {
        ...restOptions.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    return response.json();
  }

  // If we get a 401 with token expired message
  if (response.status === 401) {
    const errorData = await response.json();
    if (errorData.feedback === "Token lifetime exceeded!") {
      throw new Error("TOKEN_EXPIRED");
    }
  }

  throw new Error(`HTTP error! status: ${response.status}`);
}

export async function clientFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  // Get access token from cookie
  const cookies = document.cookie.split(";");
  const accessToken = cookies
    .find((cookie) => cookie.trim().startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    // First attempt with current token
    return await performFetch<T>(path, accessToken, options);
  } catch (error) {
    if (error instanceof Error && error.message === "TOKEN_EXPIRED") {
      // Use the server action to refresh the token
      const newToken = await refreshAccessToken();

      if (!newToken) {
        throw new Error("Failed to refresh token");
      }

      // Retry with new token
      return await performFetch<T>(path, newToken, options);
    }
    throw error;
  }
}
