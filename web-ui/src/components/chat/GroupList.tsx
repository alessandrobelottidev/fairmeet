"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import GroupChatItem from "@/components/chat/GroupChatItem";
import { useChatState } from "@/hooks/useChatState";

interface GroupListProps {
  refreshButtonId: string;
}

export function GroupList({ refreshButtonId }: GroupListProps) {
  const { user } = useAuth();
  const router = useRouter();

  const {
    groups,
    groupsLoading: isInitialLoading,
    groupsRefetching: isRefetching,
    refetchGroups,
  } = useChatState(user?.id ?? "");

  // Hydrate refresh button
  React.useEffect(() => {
    const refreshButton = document
      .getElementById(refreshButtonId)
      ?.querySelector("button");
    if (refreshButton) {
      refreshButton.onclick = () => refetchGroups();
    }
  }, [refreshButtonId, refetchGroups]);

  // Initial loading state - only show if we have no groups data
  if (isInitialLoading && !groups) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading chat groups...</div>
      </div>
    );
  }

  // No groups state
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

  // Groups list
  return (
    <div className="divide-y divide-gray-300">
      {groups.map((group) => (
        <GroupChatItem
          key={group._id?.toString()}
          group={group}
          onClick={() => router.push(`/chat/${group._id}`)}
        />
      ))}
    </div>
  );
}
