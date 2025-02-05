"use client";

import { useEffect, useRef } from "react";
import type { IMessage } from "@fairmeet/rest-api";

interface ChatRoomContentProps {
  user: { id: string; handle: string };
  messages: IMessage[] | null;
}

export default function ChatRoomContent({
  user,
  messages,
}: ChatRoomContentProps) {
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

  // Show skeleton UI if we don't have messages
  if (!messages) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-2"
    >
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet</div>
      ) : (
        messages.map((message) => (
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
                <p className="font-semibold mb-1">@{message.sender.handle}</p>
              )}
              <p>{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(message.createdAt!).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
