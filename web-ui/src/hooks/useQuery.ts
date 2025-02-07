import { useState, useEffect } from "react";

interface QueryOptions<T> {
  refetchInterval?: number;
  enabled?: boolean;
  onError?: (error: any) => void;
  initialData?: T | (() => T | undefined);
}

export function useQuery<T>(
  key: string[],
  fetchFn: () => Promise<T>,
  options: QueryOptions<T> = {}
) {
  // Initialize with initialData if provided
  const [data, setData] = useState<T | null>(() => {
    if (typeof options.initialData === "function") {
      return (options.initialData as () => T | undefined)() ?? null;
    }
    return options.initialData ?? null;
  });

  // Only show initial loading if we don't have data
  const [isInitialLoading, setIsInitialLoading] = useState(!data);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (isRefresh = false) => {
    if (options.enabled === false) return;

    try {
      if (!isRefresh && !data) {
        setIsInitialLoading(true);
      } else {
        setIsRefetching(true);
      }

      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      options.onError?.(err);
    } finally {
      setIsInitialLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    // If we have initialData, don't show loading state but still fetch in background
    if (data) {
      fetchData(true);
    } else {
      fetchData();
    }

    let intervalId: NodeJS.Timeout | null = null;
    if (options.refetchInterval) {
      intervalId = setInterval(() => fetchData(true), options.refetchInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, key);

  const refetch = () => {
    return fetchData(true);
  };

  return {
    data,
    isInitialLoading,
    isRefetching,
    error,
    refetch,
  };
}

export function useMutation<T = any, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (variables: V) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      options.onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
}
