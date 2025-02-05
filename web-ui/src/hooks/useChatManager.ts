import {
  getGroupDetails,
  getGroupMessages,
  getGroups,
  sendMessage as sendMessageAction,
} from "@/app/actions/chat";
import { getCurrentUser } from "@/lib/auth";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatData {
  messages: any[];
  group: any;
  lastFetched: number;
}

export interface GroupMetadata {
  name: string;
  description?: string;
  memberCount: number;
  lastActivity: string;
  createdBy: string;
}

export interface CacheEntry<T> {
  data: T | null;
  lastFetched: number;
  promise?: Promise<T>;
}

export interface GlobalCache {
  chats: Map<string, CacheEntry<ChatData>>;
  groups: CacheEntry<any[]>;
  auth: CacheEntry<any>;
  metadata: Map<string, GroupMetadata>; // Cache for group metadata
}

// Constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const POLLING_INTERVAL = 10 * 1000; // 10 seconds
const AUTH_CACHE_DURATION = 60 * 1000; // 1 minute

// Helper to extract metadata from group data
function extractMetadata(group: any): GroupMetadata {
  return {
    name: group.name,
    description: group.description,
    memberCount: (group.members?.length || 0) + 1,
    lastActivity: group.lastActivity || group.createdAt,
    createdBy: group.createdBy,
  };
}

// Singleton cache instance
const globalCache: GlobalCache = {
  chats: new Map(),
  groups: {
    data: null,
    lastFetched: 0,
  },
  auth: {
    data: null,
    lastFetched: 0,
  },
  metadata: new Map(),
};

/**
 * Chat State Manager
 *
 * Provides centralized state management for the chat system with:
 * - Authentication management
 * - Real-time updates
 * - Caching
 * - Optimistic updates
 *
 * @example
 * ```typescript
 * const chatManager = useChatManager(userId);
 * const { data, loading } = chatManager.useChatData(groupId);
 * ```
 */
export function useChatManager(userId: string | undefined) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const activeChatRef = useRef<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageUpdateRef = useRef<{ [groupId: string]: number }>({});

  // Auth management
  const getAuthUser = useCallback(async () => {
    const now = Date.now();
    const authCache = globalCache.auth;

    // Return cached auth if valid
    if (authCache?.data && now - authCache.lastFetched < AUTH_CACHE_DURATION) {
      return authCache.data;
    }

    // Return existing promise if there's an ongoing request
    if (authCache?.promise) {
      return authCache.promise;
    }

    // Create new auth request
    const promise = getCurrentUser()
      .then((user) => {
        globalCache.auth = {
          data: user,
          lastFetched: Date.now(),
          promise: undefined,
        };
        return user;
      })
      .catch((error) => {
        globalCache.auth = {
          data: null,
          lastFetched: now,
          promise: undefined,
        };
        throw error;
      });

    globalCache.auth.promise = promise;

    return promise;
  }, []);

  // Combined data fetching for a chat room
  const fetchChatData = useCallback(
    async (groupId: string) => {
      if (!userId) throw new Error("User ID is required");

      const cacheEntry = globalCache.chats.get(groupId);
      const now = Date.now();

      // Return cached data if fresh
      if (cacheEntry?.data && now - cacheEntry.lastFetched < CACHE_DURATION) {
        return cacheEntry.data;
      }

      // Return existing promise if there's an ongoing request
      if (cacheEntry?.promise) {
        return cacheEntry.promise;
      }

      // Fetch all data in parallel
      const promise = Promise.all([
        getGroupDetails(userId, groupId),
        getGroupMessages(userId, groupId),
      ])
        .then(([group, messages]) => {
          const data = { group, messages, lastFetched: Date.now() };
          globalCache.chats.set(groupId, {
            data,
            lastFetched: Date.now(),
            promise: undefined,
          });

          // Update metadata cache while we're at it
          globalCache.metadata.set(groupId, extractMetadata(group));

          return data;
        })
        .catch((error) => {
          globalCache.chats.delete(groupId);
          throw error;
        });

      // Store the promise in cache
      globalCache.chats.set(groupId, {
        data: cacheEntry?.data || null,
        lastFetched: cacheEntry?.lastFetched || now,
        promise,
      });

      return promise;
    },
    [userId]
  );

  // Groups management with caching
  const fetchGroups = useCallback(async () => {
    if (!userId) throw new Error("User ID is required");

    const now = Date.now();
    const groupsCache = globalCache.groups;

    // Return cached groups if fresh
    if (groupsCache.data && now - groupsCache.lastFetched < CACHE_DURATION) {
      return groupsCache.data;
    }

    // Return existing promise if there's an ongoing request
    if (groupsCache.promise) {
      return groupsCache.promise;
    }

    // Create new groups request
    const promise = getGroups(userId)
      .then((groups) => {
        globalCache.groups = {
          data: groups,
          lastFetched: Date.now(),
          promise: undefined,
        };

        // Update metadata cache for all groups
        groups.forEach((group) => {
          globalCache.metadata.set(group._id, extractMetadata(group));
        });

        return groups;
      })
      .catch((error) => {
        globalCache.groups = {
          data: null,
          lastFetched: now,
          promise: undefined,
        };
        throw error;
      });

    globalCache.groups.promise = promise;

    return promise;
  }, [userId]);

  // Group metadata management
  const getGroupMetadata = useCallback(
    async (groupId: string) => {
      // Return from cache if available
      const cachedMetadata = globalCache.metadata.get(groupId);
      if (cachedMetadata) {
        return cachedMetadata;
      }

      // Check if we have the data in the chats cache
      const chatData = globalCache.chats.get(groupId)?.data;
      if (chatData?.group) {
        const metadata = extractMetadata(chatData.group);
        globalCache.metadata.set(groupId, metadata);
        return metadata;
      }

      // If no userId, we can't fetch
      if (!userId) throw new Error("User ID is required");

      // Fetch group details and extract metadata
      const group = await getGroupDetails(userId, groupId);
      const metadata = extractMetadata(group);
      globalCache.metadata.set(groupId, metadata);
      return metadata;
    },
    [userId]
  );

  // Hook to use chat data with auto-polling
  const useChatData = (groupId: string | undefined) => {
    const [data, setData] = useState<ChatData | null>(null);
    const [loading, setLoading] = useState(
      !globalCache.chats.get(groupId ?? "")?.data
    );
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      if (!userId || !groupId) return;

      let mounted = true;
      activeChatRef.current = groupId;

      const loadData = async (isPolling = false) => {
        try {
          // Only show loading state if it's not a polling update
          if (!isPolling) {
            setLoading(true);
          }

          // For polling updates, check if we have new messages
          if (isPolling) {
            const lastUpdate = lastMessageUpdateRef.current[groupId] || 0;
            const hasUpdates = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}/has-updates?since=${lastUpdate}`
            )
              .then((res) => res.json())
              .then((data) => data.hasUpdates)
              .catch(() => true); // On error, assume we need to update

            if (!hasUpdates) {
              return; // No new messages, skip full fetch
            }
          }

          const chatData = await fetchChatData(groupId);
          if (mounted) {
            setData(chatData);
            setError(null);
            lastMessageUpdateRef.current[groupId] = Date.now();
          }
        } catch (err) {
          if (mounted) {
            setError(err as Error);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      // Initial load
      loadData();

      // Setup polling if this is the active chat
      if (activeChatRef.current === groupId) {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
        pollingRef.current = setInterval(
          () => loadData(true),
          POLLING_INTERVAL
        );
      }

      return () => {
        mounted = false;
        if (pollingRef.current && activeChatRef.current === groupId) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      };
    }, [groupId, userId, forceUpdate]);

    return { data, loading, error };
  };

  // Message sending with optimistic updates
  const sendMessage = useCallback(
    async (groupId: string, content: string) => {
      if (!userId) throw new Error("User ID is required");

      const cacheEntry = globalCache.chats.get(groupId);
      if (!cacheEntry?.data) return;

      // Create optimistic message
      const optimisticMessage = {
        _id: Date.now().toString(),
        content,
        sender: { id: userId },
        createdAt: new Date().toISOString(),
        optimistic: true,
      };

      // Update cache with optimistic message
      const updatedMessages = [...cacheEntry.data.messages, optimisticMessage];
      globalCache.chats.set(groupId, {
        ...cacheEntry,
        data: { ...cacheEntry.data, messages: updatedMessages },
      });

      // Force update UI
      setForceUpdate((prev) => prev + 1);

      try {
        // Send actual message
        await sendMessageAction(userId, groupId, content);
        // Refresh chat data
        await fetchChatData(groupId);
        setForceUpdate((prev) => prev + 1);
      } catch (error) {
        // Revert optimistic update on error
        globalCache.chats.set(groupId, cacheEntry);
        setForceUpdate((prev) => prev + 1);
        throw error;
      }
    },
    [userId, fetchChatData]
  );

  // Cache invalidation
  const invalidateCache = useCallback((groupId?: string) => {
    if (groupId) {
      globalCache.chats.delete(groupId);
      globalCache.metadata.delete(groupId);
    } else {
      globalCache.chats.clear();
      globalCache.metadata.clear();
      globalCache.groups = {
        data: null,
        lastFetched: 0,
      };
    }
    setForceUpdate((prev) => prev + 1);
  }, []);

  return {
    useChatData,
    sendMessage,
    invalidateCache,
    fetchGroups,
    getAuthUser,
    getGroupMetadata,
  };
}
