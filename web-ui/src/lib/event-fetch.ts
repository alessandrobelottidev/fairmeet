import { ScoredPlace } from "@fairmeet/rest-api";
import { RecommendationOptions } from "@fairmeet/rest-api";

interface FetchResult {
  data: ScoredPlace[];
  error: string | null;
}

interface MeetupUserPreferences {
  coordinates: number[][];
  groupSize: number;
  preferences?: {
    maxDistance?: number; // in kilometers
    preferIndoor?: boolean;
    preferOutdoor?: boolean;
    activityType?: "active" | "relaxed";
  };
}

const fetchRecommendations = async (
  positions: number[][]
): Promise<FetchResult> => {
  const data: MeetupUserPreferences = {
    coordinates: positions,
    groupSize: positions.length,
    preferences: {
      maxDistance: 10, // in kilometers
      preferIndoor: false,
      preferOutdoor: false,
      activityType: "relaxed",
    },
  };

  try {
    const response = await fetch("http://localhost:3001/v1/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return {
        data: [],
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const result: ScoredPlace[] = await response.json();
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export default fetchRecommendations;
