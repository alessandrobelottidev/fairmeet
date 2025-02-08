"use client";

import { useMeetings } from "@/context/meetings-context";
import { MeetingCard } from "./MeetingCard";
import { MeetingCardSkeleton } from "./MeetingCardSkeleton";
import { useEffect } from "react";

export function MeetingsView() {
  const { meetings, isLoading, refreshMeetings } = useMeetings();

  useEffect(() => {
    refreshMeetings();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <MeetingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      {meetings.map((meeting) => (
        <>
          <MeetingCard key={meeting._id} meeting={meeting} />
        </>
      ))}
    </div>
  );
}
