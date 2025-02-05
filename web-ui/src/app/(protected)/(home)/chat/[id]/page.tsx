"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { ReactNode, Suspense } from "react";
import ChatRoomContent from "@/components/chat/ChatRoomContent";

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

async function FreeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-[1] h-full max-w-7xl sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

ChatRoomPage.getLayout = function getLayout(page: any) {
  return <FreeLayout>{page}</FreeLayout>;
};
