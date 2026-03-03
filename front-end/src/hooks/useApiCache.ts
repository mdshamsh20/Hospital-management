import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheItem<any>>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function useApiCache<T>(url: string, ttl: number = DEFAULT_TTL) {
  const [data, setData] = useState<T | null>(() => {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<Error | null>(null);

  const fetchApi = useCallback(async (ignoreCache = false) => {
    if (!ignoreCache) {
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < ttl) {
        setData(cached.data);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(!cache.has(url)); // Only show loading if we have no stale data to show
      const response = await api.get(url);
      cache.set(url, { data: response, timestamp: Date.now() });
      setData(response as T);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, ttl]);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);

  const refetch = () => fetchApi(true);

  return { data, loading, error, refetch };
}
