"use client";

import { useAuth } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import ChatRoomContent from "@/components/chat/ChatRoomContent";
import ChatRoomHeader from "@/components/chat/ChatRoomHeader";
import { Send } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { getGroupDetails } from "@/app/actions/chat";
import { useChatState } from "@/hooks/useChatState";
import type { User } from "@/lib/auth";

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const groupId = params.id;
  const { user, loading } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  // If not logged in after loading, show login prompt
  if (!loading && !user) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex items-center justify-center flex-1">
          <p>Please log in to view this chat.</p>
        </div>
      </div>
    );
  }

  // Show page structure with loading states while auth is loading
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <ChatRoomHeader
          onBack={() => router.push("/chat")}
          onRefresh={() => {}}
          onSettings={() => {}}
          refreshing={false}
        />

        <div className="flex items-center justify-center flex-1">
          <div className="text-gray-500">Loading...</div>
        </div>

        <form className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              disabled
              type="text"
              placeholder="Loading..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none bg-gray-50"
            />
            <button
              disabled
              className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-300 text-white"
            >
              <Send size={20} className="mr-[2px]" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <AuthenticatedChatRoom user={user!} groupId={groupId} />;
}

function AuthenticatedChatRoom({
  user,
  groupId,
}: {
  user: User;
  groupId: string;
}) {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  const chatState = useChatState(user.id);

  const { mutate: sendMessageMutate } = chatState.sendMessageMutation(groupId);
  const { messages, messagesRefetching, refetchMessages } =
    chatState.useGroupMessages(groupId);

  const {
    data: group,
    isInitialLoading: groupInitialLoading,
    isRefetching: groupRefetching,
  } = useQuery(
    ["group-details", groupId, user.id],
    () => getGroupDetails(user.id, groupId),
    {
      enabled: true,
      onError: () => router.push("/chat"),
    }
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessageMutate(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <ChatRoomHeader
        group={group}
        user={{ id: user.id }}
        onBack={() => router.push("/chat")}
        onRefresh={refetchMessages}
        onSettings={() => router.push(`/chat/${groupId}/settings`)}
        refreshing={messagesRefetching || groupRefetching}
      />

      <ChatRoomContent
        user={{ id: user.id, handle: user.handle }}
        messages={messages}
      />

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} className="mr-[2px]" />
          </button>
        </div>
      </form>
    </div>
  );
}
