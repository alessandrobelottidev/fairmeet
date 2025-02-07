"use client";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { GroupList } from "@/components/chat/GroupList";
import { useState, useEffect } from "react";
import { useChatManager } from "@/hooks/useChatManager";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/auth";

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const chatManager = useChatManager(user?.id);
  const router = useRouter();

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

  if (loading || !user) {
    return (
      <div className="flex flex-col max-w-2xl mx-auto h-full">
        <ChatHeader
          title="Chat"
          refreshButtonId="groups-refresh"
          refreshing={true}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-full">
      <ChatHeader
        title="Chat"
        refreshButtonId="groups-refresh"
        createButtonLink="/chat/new"
      />

      <div className="h-full max-h-[calc(_100vh_-_120px_)] overflow-y-scroll">
        <GroupList userId={user.id} refreshButtonId="groups-refresh" />
      </div>
    </div>
  );
}
