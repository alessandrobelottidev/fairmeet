"use client";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { GroupList } from "@/components/chat/GroupList";
import { useAuth } from "@/hooks/useAuth";
import { useChatState } from "@/hooks/useChatState";

export default function ChatPage() {
  const { user } = useAuth();
  const { groupsRefetching: isRefetching } = useChatState(user?.id ?? "");

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
