"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Users, Crown } from "lucide-react";
import StaticMap from "./StaticMap";
import { PlacesList } from "./PlacesList";
import { IMeeting, IPlace, useMeetings } from "@/context/meetings-context";
import { IGroup } from "@fairmeet/rest-api";

interface MeetingCardProps {
  meeting: IMeeting & { group: IGroup; places: IPlace[] };
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const { userHandle, finalizeMeeting } = useMeetings();
  const [isExpanded, setIsExpanded] = useState(true);

  const isCreator = userHandle === meeting.creator.handle;
  const isMeetingFinalized = !!meeting.chosenPlace;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {meeting.group.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} />
              <span>{meeting.group.members.length} members</span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {isMeetingFinalized ? (
            <span className="text-green-600 text-sm font-medium">
              Poll closed • Final place selected
            </span>
          ) : (
            <span className="text-blue-600 text-sm font-medium">
              Poll open • Waiting for votes
            </span>
          )}
          {isCreator && <Crown size={16} className="text-yellow-500" />}
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[2000px]" : "max-h-0"
        } overflow-hidden`}
      >
        <div className="p-4">
          <StaticMap radius={meeting.radius} places={meeting.places} />
        </div>

        <div className="p-4">
          <PlacesList
            meetingId={meeting._id}
            places={meeting.places}
            isMeetingFinalized={isMeetingFinalized}
          />
        </div>

        {isCreator && !isMeetingFinalized && (
          <div className="p-4 border-t">
            <button
              onClick={() => {
                const placeVotes = meeting.places.map((place) => ({
                  place,
                  voteCount: meeting.votes.filter((v) =>
                    v.selectedPlaces.includes(place._id)
                  ).length,
                }));
                const mostVoted = placeVotes.reduce((prev, current) =>
                  current.voteCount > prev.voteCount ? current : prev
                );

                finalizeMeeting(
                  meeting._id,
                  mostVoted.place._id,
                  mostVoted.place.startDateTimeZ ? "event" : "spot"
                );
              }}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 transition-colors font-medium"
            >
              Close Poll & Select Most Voted Place
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetingCard;
