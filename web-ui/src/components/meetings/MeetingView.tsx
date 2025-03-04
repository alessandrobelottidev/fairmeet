"use client";

import { useMeetings } from "@/context/meetings-context";
import { MeetingCard } from "./MeetingCard";
import { MeetingCardSkeleton } from "./MeetingCardSkeleton";
import { useEffect } from "react";
import Image from "next/image";

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
      {meetings.length == 0 && 
      <div className="flex flex-col items-center">
        <Image
          src="/no_data.svg"
          alt="No data"
          width={300} // specify appropriate width
          height={300} // specify appropriate height
          className="max-w-[220px] mb-4"
        />
        <p className="text-center">Non hai ancora creato nessun ritrovo...<br />Clicca il + per creare un ritrovo</p>
      </div>}
      {meetings.map((meeting) => (
        <>
          <MeetingCard key={meeting._id} meeting={meeting} />
        </>
      ))}
    </div>
  );
}
