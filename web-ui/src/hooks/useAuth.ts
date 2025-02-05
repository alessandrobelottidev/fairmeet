"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, type User } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (mounted) {
          setUser(userData);
          setError(null);
        }
      } catch (error) {
        if (mounted) {
          console.error("Failed to fetch user:", error);
          setError(error as Error);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading, error };
}
