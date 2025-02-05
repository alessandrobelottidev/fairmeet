"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { GroupPreview } from "@/components/chat/GroupPreview";
import { useChatManager } from "@/hooks/useChatManager";

interface GroupListProps {
  userId: string;
  refreshButtonId: string;
}

export function GroupList({ userId, refreshButtonId }: GroupListProps) {
  const router = useRouter();
  const chatManager = useChatManager(userId);
  const [groups, setGroups] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGroups = React.useCallback(async () => {
    try {
      setLoading(true);
      const groupsData = await chatManager.fetchGroups();
      setGroups(groupsData);
    } catch (err) {
      console.error("Failed to load groups:", err);
    } finally {
      setLoading(false);
    }
  }, [chatManager]);

  // Initial groups fetch
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Hydrate refresh button
  useEffect(() => {
    const refreshButton = document
      .getElementById(refreshButtonId)
      ?.querySelector("button");
    if (refreshButton) {
      refreshButton.onclick = () => {
        chatManager.invalidateCache();
        loadGroups();
      };
    }
  }, [refreshButtonId, chatManager, loadGroups]);

  if (loading && !groups) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading chat groups...</div>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Create a new group chat or wait to be added to one
        </p>
        <button
          onClick={() => router.push("/chat/new")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none"
        >
          <Plus size={20} className="mr-2" />
          Create a new group
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-300">
      {groups.map((group) => (
        <GroupPreview
          key={group._id?.toString()}
          groupId={group._id}
          userId={userId}
          onClick={() => router.push(`/chat/${group._id}`)}
        />
      ))}
    </div>
  );
}
