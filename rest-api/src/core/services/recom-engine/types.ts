import { IPlace } from '@features/places/types/place.interface';

export interface ScoredPlace {
  place: IPlace;
  score: number;
  factors: {
    timeScore: number;
    locationScore: number;
    amenitiesScore: number;
    popularityScore: number;
  };
}

export interface RecommendationOptions {
  currentTime: Date;
  originCoordinates: [number, number];
  groupSize: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  preferences?: {
    maxDistance?: number; // in kilometers
    preferIndoor?: boolean;
    preferOutdoor?: boolean;
    activityType?: 'active' | 'relaxed';
  };
}
