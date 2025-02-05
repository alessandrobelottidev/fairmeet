"use client";

import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import ChatRoomContent from "@/components/chat/ChatRoomContent";

export const suppressLayout = true;

export default function ChatRoomPage() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const groupId = params.id;

  // If no user, show login prompt
  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex items-center justify-center flex-1">
          <p>Please log in to view this chat.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatRoomContent user={user} groupId={groupId} />
    </Suspense>
  );
}
