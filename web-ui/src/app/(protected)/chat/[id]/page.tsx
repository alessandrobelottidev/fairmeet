"use client";

import { useParams, useRouter } from "next/navigation";
import ChatRoomContent from "@/components/chat/ChatRoomContent";
import ChatRoomHeader from "@/components/chat/ChatRoomHeader";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useChatManager } from "@/hooks/useChatManager";
import type { User } from "@/lib/auth";

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const groupId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const chatManager = useChatManager(user?.id);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await chatManager.getAuthUser();
        setUser(userData);
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [chatManager, router]);

  if (!loading && !user) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex items-center justify-center flex-1">
          <p>Please log in to view this chat.</p>
        </div>
      </div>
    );
  }

  if (loading || !user) {
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

  // At this point TypeScript knows user cannot be null
  return <AuthenticatedChatRoom user={user} groupId={groupId} />;
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
  const chatManager = useChatManager(user.id);
  const { data: chatData, loading: chatLoading } =
    chatManager.useChatData(groupId);
  const [metadata, setMetadata] = useState<any>(null);

  // Fetch group metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await chatManager.getGroupMetadata(groupId);
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch group metadata:", error);
        router.push("/chat");
      }
    };

    fetchMetadata();
  }, [groupId, chatManager, router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await chatManager.sendMessage(groupId, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <ChatRoomHeader
        group={
          metadata && { ...metadata, members: chatData?.group?.members || [] }
        }
        user={{ id: user.id }}
        onBack={() => router.push("/chat")}
        onRefresh={() => chatManager.invalidateCache(groupId)}
        onSettings={() => router.push(`/chat/${groupId}/settings`)}
        refreshing={chatLoading}
      />

      <ChatRoomContent
        user={{ id: user.id, handle: user.handle }}
        messages={chatData?.messages ?? null}
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
