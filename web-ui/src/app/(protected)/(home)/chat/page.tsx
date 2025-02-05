"use client";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { GroupList } from "@/components/chat/GroupList";
import { useQuery } from "@/hooks/useQuery";
import { getGroups } from "@/app/actions/chat";
import { useAuth } from "@/hooks/useAuth";

export default function ChatPage() {
  const { user } = useAuth();

  const { isRefetching } = useQuery(
    ["groups", user?.id ?? ""],
    () => {
      if (!user?.id) return Promise.resolve([]);
      return getGroups(user.id);
    },
    {
      enabled: !!user?.id,
    }
  );

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-full">
      <ChatHeader
        title="Chat"
        refreshButtonId="groups-refresh"
        createButtonLink="/chat/new"
        refreshing={isRefetching}
      />
      <GroupList refreshButtonId="groups-refresh" />
    </div>
  );
}
