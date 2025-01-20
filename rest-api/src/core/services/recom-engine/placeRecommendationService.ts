import { RecommendationOptions, ScoredPlace } from './types';
import { IEvent } from '@features/places/types/event.interface';
import { IPlace } from '@features/places/types/place.interface';
import { ISpot } from '@features/places/types/spot.interface';

export class PlaceRecommendationService {
  private readonly MAX_DISTANCE = 50; // km
  private readonly EARTH_RADIUS = 6371; // km

  constructor() {}

  /**
   * Calculate haversine distance between two points
   */
  private calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate time relevance score for events
   */
  private calculateTimeScore(place: IPlace, currentTime: Date): number {
    if (this.isEvent(place)) {
      const event = place as IEvent;
      const hoursUntilStart =
        (event.startDateTimeZ.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

      // Prefer events starting within the next 24 hours
      if (hoursUntilStart < 0) return 0;
      if (hoursUntilStart <= 24) return 1;
      if (hoursUntilStart <= 48) return 0.7;
      if (hoursUntilStart <= 72) return 0.4;
      return 0.2;
    }

    return 0.5; // Neutral score for spots
  }

  /**
   * Calculate location score based on distance from origin
   */
  private calculateLocationScore(
    place: IPlace,
    originCoordinates: [number, number],
    maxDistance: number,
  ): number {
    const distance = this.calculateDistance(originCoordinates, place.location.coordinates);

    if (distance > maxDistance) return 0;
    return 1 - distance / maxDistance;
  }

  /**
   * Calculate amenities score based on available information
   */
  private calculateAmenitiesScore(place: IPlace): number {
    let score = 0;

    if (place.featuredImageUrl) score += 0.2;
    if (place.email) score += 0.2;
    if (place.socialMediaHandles && Object.keys(place.socialMediaHandles).length > 0) {
      score += 0.2;
    }
    if (place.abstract) score += 0.2;
    if (place.description.length > 100) score += 0.2;

    return score;
  }

  /**
   * Determine if a place is an event
   */
  private isEvent(place: IPlace): place is IEvent {
    return 'startDateTimeZ' in place && 'endDateTimeZ' in place;
  }

  /**
   * Get recommendations sorted by score
   */
  public getRecommendations(
    places: (IEvent | ISpot)[],
    options: RecommendationOptions,
  ): ScoredPlace[] {
    const scoredPlaces: ScoredPlace[] = places.map((place) => {
      const timeScore = this.calculateTimeScore(place, options.currentTime);
      const locationScore = this.calculateLocationScore(
        place,
        options.originCoordinates,
        options.preferences?.maxDistance || this.MAX_DISTANCE,
      );
      const amenitiesScore = this.calculateAmenitiesScore(place);

      // Calculate weighted total score
      const totalScore = timeScore * 0.4 + locationScore * 0.3 + amenitiesScore * 0.3;

      return {
        place,
        score: totalScore,
        factors: {
          timeScore,
          locationScore,
          amenitiesScore,
          popularityScore: 0, // Reserved for future implementation
        },
      };
    });

    // Sort by score in descending order
    return scoredPlaces.sort((a, b) => b.score - a.score);
  }

  /**
   * Get optimized itinerary based on scores and time constraints
   */
  public getOptimizedItinerary(
    places: (IEvent | ISpot)[],
    options: RecommendationOptions,
  ): IPlace[] {
    const recommendations = this.getRecommendations(places, options);

    // Filter out places with very low scores
    const viablePlaces = recommendations.filter((place) => place.score > 0.4);

    // If dealing with events, ensure they're ordered by start time
    if (viablePlaces.some((p) => this.isEvent(p.place))) {
      return viablePlaces
        .sort((a, b) => {
          if (this.isEvent(a.place) && this.isEvent(b.place)) {
            return a.place.startDateTimeZ.getTime() - b.place.startDateTimeZ.getTime();
          }
          return b.score - a.score;
        })
        .map((p) => p.place);
    }

    // For spots, return them ordered by score
    return viablePlaces.map((p) => p.place);
  }
}
