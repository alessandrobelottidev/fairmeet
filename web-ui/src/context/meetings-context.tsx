"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { clientFetch } from "@/lib/client-fetch";

export interface IMeeting {
  _id: string;
  group: IGroup;
  creator: string & { handle: string };
  places:
    | Array<{
        placeId: string;
        placeType: "spot" | "event";
      }>
    | Array<IPlace>;
  votes: Array<Vote>;
  chosenPlace?: {
    placeId: string;
    placeType: "spot" | "event";
  };
  radius: {
    center: {
      type: "Point";
      coordinates: [number, number];
    };
    sizeInMeters: number;
  };
}

interface IGroup {
  _id: string;
  name: string;
  members: string[];
  createdBy: string;
}

export interface IPlace {
  _id: string;
  placeId: string;
  title: string;
  placeType: "spot" | "event";
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  featuredImageUrl?: string;
  startDateTimeZ?: Date;
  endDateTimeZ?: Date;
}

interface Vote {
  userId: string;
  selectedPlaces: string[];
  createdAt: Date;
}

interface VoteStats {
  voteCount: number;
  percentage: number;
  progressWidth: number;
}

interface MeetingsContextType {
  meetings: Array<IMeeting & { group: IGroup; places: IPlace[] }>;
  isLoading: boolean;
  error: Error | null;
  refreshMeetings: () => Promise<void>;
  toggleVote: (meetingId: string, placeId: string) => Promise<void>;
  finalizeMeeting: (
    meetingId: string,
    placeId: string,
    placeType: "spot" | "event"
  ) => Promise<void>;
  hasUserVotedFor: (meetingId: string, placeId: string) => boolean;
  getVotesForPlace: (meetingId: string, placeId: string) => Array<Vote>;
  getTotalVotersForMeeting: (meetingId: string) => number;
  getVoteStatsForPlace: (meetingId: string, placeId: string) => VoteStats;
  getMeetingById: (
    meetingId: string
  ) => (IMeeting & { group: IGroup; places: IPlace[] }) | undefined;
  userId: string;
  userHandle: string;
}

const MeetingsContext = createContext<MeetingsContextType | undefined>(
  undefined
);

export function MeetingsProvider({
  children,
  initialMeetings,
  userId,
  userHandle,
}: {
  children: ReactNode;
  initialMeetings: IMeeting[];
  userId: string;
  userHandle: string;
}) {
  const [meetings, setMeetings] = useState<Array<any>>(initialMeetings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMeetingsWithDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentMeetings = await clientFetch<IMeeting[]>("/v1/meetings");

      const detailedMeetings = await Promise.all(
        currentMeetings.map(async (meeting) => {
          const [group, places] = await Promise.all([
            clientFetch(`/v1/users/${userId}/groups/${meeting.group._id}`),
            Promise.all(
              meeting.places.map((place) =>
                clientFetch(`/v1/${place.placeType}s/${place.placeId}`)
              )
            ),
          ]);

          return {
            ...meeting,
            group,
            places,
          };
        })
      );

      setMeetings(detailedMeetings);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const toggleVote = async (meetingId: string, placeId: string) => {
    const meeting = meetings.find((m) => m._id === meetingId);
    if (!meeting) return;

    const isVoted = meeting.votes.some(
      (vote: Vote) =>
        vote.userId === userId && vote.selectedPlaces.includes(placeId)
    );

    const endpoint = isVoted
      ? `/v1/meetings/${meetingId}/votes/remove`
      : `/v1/meetings/${meetingId}/votes`;

    const body = isVoted ? {} : { selectedPlaces: [placeId] };

    try {
      await clientFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
      await fetchMeetingsWithDetails();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const finalizeMeeting = async (
    meetingId: string,
    placeId: string,
    placeType: "spot" | "event"
  ) => {
    try {
      await clientFetch(`/v1/meetings/${meetingId}/finalize`, {
        method: "POST",
        body: JSON.stringify({
          placeId,
          placeType,
        }),
      });
      await fetchMeetingsWithDetails();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getMeetingById = useCallback(
    (meetingId: string) => meetings.find((m) => m._id === meetingId),
    [meetings]
  );

  const getVotesForPlace = useCallback(
    (meetingId: string, placeId: string) => {
      const meeting = getMeetingById(meetingId);
      return (
        meeting?.votes.filter((vote: Vote) =>
          vote.selectedPlaces.includes(placeId)
        ) ?? []
      );
    },
    [getMeetingById]
  );

  const hasUserVotedFor = useCallback(
    (meetingId: string, placeId: string) => {
      const meeting = getMeetingById(meetingId);
      return (
        meeting?.votes.some(
          (vote: Vote) =>
            vote.userId === userId && vote.selectedPlaces.includes(placeId)
        ) ?? false
      );
    },
    [getMeetingById, userId]
  );

  const getTotalVotersForMeeting = useCallback(
    (meetingId: string): number => {
      const meeting = getMeetingById(meetingId);
      if (!meeting) return 0;

      return new Set(meeting.votes.map((vote: Vote) => vote.userId)).size;
    },
    [getMeetingById]
  );

  const getVoteStatsForPlace = useCallback(
    (meetingId: string, placeId: string): VoteStats => {
      const meeting = getMeetingById(meetingId);
      if (!meeting) return { voteCount: 0, percentage: 0, progressWidth: 0 };

      const votes = getVotesForPlace(meetingId, placeId);
      const voteCount = votes.length;
      const totalVoters = getTotalVotersForMeeting(meetingId);

      const percentage = totalVoters > 0 ? (voteCount / totalVoters) * 100 : 0;

      // Calculate progress width based on the place with most votes
      const maxVotes = Math.max(
        ...meeting.places.map(
          (p: { _id: string }) => getVotesForPlace(meetingId, p._id).length
        )
      );
      const progressWidth = maxVotes > 0 ? (voteCount / maxVotes) * 100 : 0;

      return {
        voteCount,
        percentage,
        progressWidth,
      };
    },
    [getMeetingById, getVotesForPlace, getTotalVotersForMeeting]
  );

  return (
    <MeetingsContext.Provider
      value={{
        meetings,
        isLoading,
        error,
        refreshMeetings: fetchMeetingsWithDetails,
        toggleVote,
        finalizeMeeting,
        hasUserVotedFor,
        getVotesForPlace,
        getTotalVotersForMeeting,
        getVoteStatsForPlace,
        getMeetingById,
        userId,
        userHandle,
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetings() {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error("useMeetings must be used within a MeetingsProvider");
  }
  return context;
}
