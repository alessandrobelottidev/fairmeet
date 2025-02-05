"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getGroupMessages,
  getGroupDetails,
  sendMessage,
} from "@/app/actions/chat";
import { useQuery, useMutation } from "@/hooks/useQuery";
import ChatRoomHeader from "@/components/chat/ChatRoomHeader";

interface ChatRoomContentProps {
  user: { id: string; handle: string };
  groupId: string;
}

export default function ChatRoomContent({
  user,
  groupId,
}: ChatRoomContentProps) {
  const router = useRouter();

  const {
    data: messages,
    isInitialLoading: messagesInitialLoading,
    isRefetching: messagesRefetching,
    refetch: refetchMessages,
  } = useQuery(
    ["group-messages", groupId, user.id],
    () => getGroupMessages(user.id, groupId),
    {
      refetchInterval: 10000,
      enabled: true,
    }
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottomRef = useRef(true);

  const scrollToBottom = () => {
    if (messagesContainerRef.current && shouldScrollToBottomRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } =
        messagesContainerRef.current;
      shouldScrollToBottomRef.current =
        scrollHeight - scrollTop === clientHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const sendMessageMutation = useMutation(
    async (content: string) => {
      await sendMessage(user.id, groupId, content);
    },
    {
      onSuccess: () => {
        refetchMessages();
      },
    }
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessageMutation.mutate(newMessage);
    setNewMessage("");
  };

  // Initial loading state
  if (messagesInitialLoading || groupInitialLoading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <ChatRoomHeader
          onBack={() => router.push("/chat")}
          onRefresh={() => {}}
          onSettings={() => {}}
        />
        <div className="flex items-center justify-center flex-1">
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <ChatRoomHeader
        group={group}
        user={{ id: user.id }}
        onBack={() => router.push("/chat")}
        onRefresh={() => refetchMessages()}
        onSettings={() => router.push(`/chat/${groupId}/settings`)}
        refreshing={messagesRefetching || groupRefetching}
      />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {!messages || messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => {
            return (
              <div
                key={message._id?.toString()}
                className={`flex flex-col ${
                  message.sender.handle === user.handle
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender.handle === user.handle
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {message.sender.handle !== user.handle && (
                    <p className="font-semibold mb-1">
                      @{message.sender.handle}
                    </p>
                  )}
                  <p>{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(message.createdAt!).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
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
