import { cookies } from "next/headers";
import { refreshAccessToken } from "./auth";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
  cache?: RequestCache;
}

export async function authFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const cookieStore = cookies();
  let accessToken = (await cookieStore).get("accessToken")?.value;

  const { params, ...restOptions } = options;

  const queryParams = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString()
    : "";

  async function performFetch(token: string) {
    const response = await fetch(
      `${process.env.API_URL}${path}${queryParams}`,
      {
        ...restOptions,
        headers: {
          ...restOptions.headers,
          Authorization: `Bearer ${token}`,
        },
        cache: options.cache ?? "no-store",
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

  try {
    // First attempt with current token
    return await performFetch(accessToken!);
  } catch (error) {
    if (error instanceof Error && error.message === "TOKEN_EXPIRED") {
      // Token expired, try to refresh
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error("Failed to refresh token");
      }
      // Retry with new token
      return await performFetch(newToken);
    }
    throw error;
  }
}
