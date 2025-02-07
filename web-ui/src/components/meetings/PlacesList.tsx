"use client";

import { useState } from "react";
import { PlaceVoteItem } from "./PlaceVoteItem";
import { IPlace, useMeetings } from "@/context/meetings-context";

interface PlacesListProps {
  meetingId: string;
  places: IPlace[];
  isMeetingFinalized: boolean;
}

export function PlacesList({
  meetingId,
  places,
  isMeetingFinalized,
}: PlacesListProps) {
  const { getVotesForPlace } = useMeetings();
  const [expandedPlaceIds, setExpandedPlaceIds] = useState<Set<string>>(
    new Set()
  );

  // Sort places by vote count
  const sortedPlaces = [...places].sort((a, b) => {
    const aVotes = getVotesForPlace(meetingId, a._id).length;
    const bVotes = getVotesForPlace(meetingId, b._id).length;
    return bVotes - aVotes;
  });

  const togglePlaceExpansion = (placeId: string) => {
    const newExpanded = new Set(expandedPlaceIds);
    if (newExpanded.has(placeId)) {
      newExpanded.delete(placeId);
    } else {
      newExpanded.add(placeId);
    }
    setExpandedPlaceIds(newExpanded);
  };

  // Get unique voters count from all votes in the meeting
  const uniqueVoterCount = new Set(
    places.flatMap((place) =>
      getVotesForPlace(meetingId, place._id).map((vote) => vote.userId)
    )
  ).size;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Places ({places.length})
        </h2>
      </div>

      <div className="space-y-2">
        {sortedPlaces.map((place) => (
          <PlaceVoteItem
            key={place._id}
            meetingId={meetingId}
            place={place}
            isMeetingFinalized={isMeetingFinalized}
          />
        ))}
      </div>

      <div className="text-sm text-gray-600">
        {uniqueVoterCount === 0
          ? "No votes yet"
          : `${uniqueVoterCount} ${
              uniqueVoterCount === 1 ? "person has" : "people have"
            } voted`}
      </div>
    </div>
  );
}

export default PlacesList;
