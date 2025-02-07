"use client";

import { IPlace, useMeetings } from "@/context/meetings-context";
import Image from "next/image";
import { useState } from "react";
import { CircleCheck } from "lucide-react";

interface PlaceVoteItemProps {
  meetingId: string;
  place: IPlace;
  isMeetingFinalized: boolean;
}

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function PlaceVoteItem({
  meetingId,
  place,
  isMeetingFinalized,
}: PlaceVoteItemProps) {
  const { toggleVote, hasUserVotedFor, getVoteStatsForPlace } = useMeetings();
  const [imgSrc, setImgSrc] = useState(
    place.featuredImageUrl || "/placeholder.jpg"
  );

  const userVoted = hasUserVotedFor(meetingId, place._id);
  const { voteCount, percentage, progressWidth } = getVoteStatsForPlace(
    meetingId,
    place._id
  );

  return (
    <div className="bg-white rounded-lg p-4 mb-2 transition-all duration-300 h-auto overflow-hidden cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image
            src={imgSrc}
            alt={place.title ?? "No title available"}
            fill
            className="rounded-md object-cover"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{place.title}</h3>
              {place.placeType === "event" &&
                place.startDateTimeZ &&
                place.endDateTimeZ && (
                  <p className="text-sm text-gray-500">
                    {formatDateTime(place.startDateTimeZ)} -{" "}
                    {formatDateTime(place.endDateTimeZ)}
                  </p>
                )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent expansion when clicking vote button
                if (!isMeetingFinalized) {
                  toggleVote(meetingId, place._id);
                }
              }}
              disabled={isMeetingFinalized}
              className={`p-2 rounded-full transition-all ${
                userVoted
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              } ${
                isMeetingFinalized
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <CircleCheck
                className={`h-5 w-5 ${userVoted ? "fill-current" : ""}`}
              />
            </button>
          </div>

          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{voteCount}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceVoteItem;
