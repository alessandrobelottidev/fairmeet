interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export async function clientFetch<T>(
  path: string,
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
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
