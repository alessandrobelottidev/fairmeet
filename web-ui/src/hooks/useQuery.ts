import { useState, useEffect } from "react";

interface QueryOptions<T> {
  refetchInterval?: number;
  enabled?: boolean;
  onError?: (error: any) => void;
}

export function useQuery<T>(
  key: string[],
  fetchFn: () => Promise<T>,
  options: QueryOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (isRefresh = false) => {
    if (options.enabled === false) return;

    try {
      if (!isRefresh) {
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
      if (!isRefresh) {
        setIsInitialLoading(false);
      } else {
        setIsRefetching(false);
      }
    }
  };

  useEffect(() => {
    fetchData();

    let intervalId: NodeJS.Timeout | null = null;
    if (options.refetchInterval) {
      intervalId = setInterval(() => fetchData(true), options.refetchInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, key);

  const refetch = () => {
    fetchData(true);
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
