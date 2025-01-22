import { cookies } from "next/headers";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
  cache?: RequestCache;
}

export async function authFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;

  const { params, ...restOptions } = options;

  const queryParams = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString()
    : "";

  const response = await fetch(`${process.env.API_URL}${path}${queryParams}`, {
    ...restOptions,
    headers: {
      ...restOptions.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
