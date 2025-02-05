import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@/hooks/useQuery";
import {
  getGroupMessages,
  getGroupDetails,
  getGroups,
  sendMessage,
} from "@/app/actions/chat";

// Type for cached messages
interface CachedMessages {
  [groupId: string]: {
    messages: any[];
    lastFetched: number;
  };
}

// Type for cached groups
interface CachedGroups {
  groups: any[];
  lastFetched: number;
}

// Singleton to maintain cache across component remounts
const globalCache = {
  messages: {} as CachedMessages,
  groups: null as CachedGroups | null,
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function useChatState(userId: string) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const activeChatRef = useRef<string | null>(null);

  // Groups query with caching
  const {
    data: groups,
    isInitialLoading: groupsLoading,
    isRefetching: groupsRefetching,
    refetch: refetchGroups,
  } = useQuery(
    ["groups", userId, forceUpdate.toString()],
    async () => {
      // Return cached data immediately if available
      const cachedData = globalCache.groups?.groups;
      if (cachedData) {
        // Start fetch in background if cache is stale
        if (
          Date.now() - (globalCache.groups?.lastFetched ?? 0) >=
          CACHE_DURATION
        ) {
          getGroups(userId).then((newGroups) => {
            globalCache.groups = {
              groups: newGroups,
              lastFetched: Date.now(),
            };
          });
        }
        return cachedData;
      }

      // Fetch fresh data
      const newGroups = await getGroups(userId);
      globalCache.groups = {
        groups: newGroups,
        lastFetched: Date.now(),
      };
      return newGroups;
    },
    {
      enabled: !!userId,
      initialData: () => globalCache.groups?.groups,
      refetchInterval: undefined, // Disable automatic refetching
    }
  );

  // Function to get messages for a specific group
  const useGroupMessages = (groupId: string) => {
    const {
      data: messages,
      isInitialLoading: messagesLoading,
      isRefetching: messagesRefetching,
      refetch: refetchMessages,
    } = useQuery(
      ["group-messages", groupId, userId, forceUpdate.toString()],
      async () => {
        activeChatRef.current = groupId;

        // Return cached data immediately if available
        const cachedData = globalCache.messages[groupId]?.messages;
        if (cachedData) {
          // Start fetch in background if cache is stale
          if (
            Date.now() - (globalCache.messages[groupId]?.lastFetched ?? 0) >=
            CACHE_DURATION
          ) {
            getGroupMessages(userId, groupId).then((newMessages) => {
              globalCache.messages[groupId] = {
                messages: newMessages,
                lastFetched: Date.now(),
              };
            });
          }
          return cachedData;
        }

        // Fetch fresh messages
        const newMessages = await getGroupMessages(userId, groupId);
        globalCache.messages[groupId] = {
          messages: newMessages,
          lastFetched: Date.now(),
        };
        return newMessages;
      },
      {
        refetchInterval: activeChatRef.current === groupId ? 10000 : undefined,
        enabled: !!groupId && !!userId,
        initialData: () => globalCache.messages[groupId]?.messages,
      }
    );

    return {
      messages,
      messagesLoading,
      messagesRefetching,
      refetchMessages,
    };
  };

  // Function to invalidate cache and force refresh
  const invalidateCache = useCallback((groupId?: string) => {
    if (groupId) {
      // Invalidate specific group messages
      delete globalCache.messages[groupId];
    } else {
      // Invalidate all cache
      globalCache.messages = {};
      globalCache.groups = null;
    }
    setForceUpdate((prev) => prev + 1);
  }, []);

  // Message mutation with cache update
  const sendMessageMutation = (groupId: string) =>
    useMutation(async (content: string) => {
      await sendMessage(userId, groupId, content);
      invalidateCache(groupId);
    });

  return {
    groups,
    groupsLoading,
    groupsRefetching,
    refetchGroups,
    useGroupMessages,
    invalidateCache,
    sendMessageMutation,
  };
}
