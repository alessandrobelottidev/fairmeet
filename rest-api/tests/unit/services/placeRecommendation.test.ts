import { PlaceRecommendationService } from '../../../src/core/services/recom-engine/placeRecommendationService';
import { IEvent } from '../../../src/features/places/types/event.interface';
import { ISpot } from '../../../src/features/places/types/spot.interface';

describe('PlaceRecommendationService', () => {
  let recommendationService: PlaceRecommendationService;

  beforeEach(() => {
    recommendationService = new PlaceRecommendationService();
  });

  describe('Distance Calculation', () => {
    it('should calculate correct distance between two points', () => {
      // Access private method for testing
      const calculateDistance = (recommendationService as any).calculateDistance.bind(
        recommendationService,
      );

      // Test coordinates (Trento coordinates)
      const coord1: [number, number] = [46.0748, 11.1217];
      const coord2: [number, number] = [46.0747, 11.1218];

      const distance = calculateDistance(coord1, coord2);
      expect(distance).toBeLessThan(1); // Should be very small distance
    });
  });

  describe('Score Calculations', () => {
    const baseEvent: IEvent = {
      title: 'Test Event',
      location: {
        type: 'Point',
        coordinates: [11.1217, 46.0748], // Trento coordinates
      },
      startDateTimeZ: new Date('2025-02-11T10:00:00Z'),
      endDateTimeZ: new Date('2025-02-11T12:00:00Z'),
      description: 'Test Description',
      abstract: 'Test Abstract',
      address: 'Test Address',
    };

    const baseSpot: ISpot = {
      title: 'Test Spot',
      location: {
        type: 'Point',
        coordinates: [46.0748, 11.1217],
      },
      description: 'Test Description',
      abstract: 'Test Abstract',
      address: 'Test Address',
    };

    it('should calculate time score correctly for events', () => {
      const calculateTimeScore = (recommendationService as any).calculateTimeScore.bind(
        recommendationService,
      );

      const currentTime = new Date('2025-02-11T09:00:00Z'); // 1 hour before event
      const score = calculateTimeScore(baseEvent, currentTime);

      expect(score).toBe(1); // Should be high score for event starting soon
    });

    it('should calculate location score based on distance', () => {
      const calculateLocationScore = (recommendationService as any).calculateLocationScore.bind(
        recommendationService,
      );

      const origin: [number, number] = [46.0748, 11.1217]; // Trento
      const maxDistance = 50; // km

      const nearbyScore = calculateLocationScore(baseSpot, origin, maxDistance);
      expect(nearbyScore).toBeGreaterThan(0.9); // Should be high score for nearby location

      const farSpot = {
        ...baseSpot,
        location: {
          type: 'Point',
          coordinates: [12.4964, 41.9028], // Rome coordinates
        },
      };

      const farScore = calculateLocationScore(farSpot, origin, maxDistance);
      expect(farScore).toBe(0); // Should be 0 for location beyond max distance
    });

    it('should calculate amenities score based on available information', () => {
      const calculateAmenitiesScore = (recommendationService as any).calculateAmenitiesScore.bind(
        recommendationService,
      );

      const fullInfoSpot = {
        ...baseSpot,
        featuredImageUrl: 'image.jpg',
        email: 'test@example.com',
        socialMediaHandles: { facebook: 'fb' },
        abstract: 'Abstract',
        description:
          'A very detailed description that is longer than 100 characters to test the scoring system properly',
      };

      const fullScore = calculateAmenitiesScore(fullInfoSpot);
      expect(fullScore).toBe(0.8); // Should be almost max score with all info

      const minimalSpot = {
        ...baseSpot,
        description: 'Short description',
      };

      const minScore = calculateAmenitiesScore(minimalSpot);
      expect(minScore).toBeLessThan(0.5); // Should be low score with minimal info
    });
  });

  describe('Recommendations Generation', () => {
    it('should sort places by score correctly', () => {
      const currentTime = new Date('2025-02-11T09:00:00Z');
      const origin: [number, number] = [46.0748, 11.1217]; // Trento

      const places = [
        {
          title: 'Far Event',
          location: {
            type: 'Point' as const,
            coordinates: [12.4964, 41.9028] as [number, number], // Rome
          },
          startDateTimeZ: new Date('2025-02-11T10:00:00Z'),
          endDateTimeZ: new Date('2025-02-11T12:00:00Z'),
          description: 'Test',
          abstract: '',
          address: 'Test',
        },
        {
          title: 'Nearby Spot',
          location: {
            type: 'Point' as const,
            coordinates: [11.1217, 46.0748] as [number, number], // Trento
          },
          description: 'Test with lots of details to get a good amenities score',
          abstract: 'Test',
          address: 'Test',
          featuredImageUrl: 'test.jpg',
        },
      ];

      const recommendations = recommendationService.getRecommendations(places, {
        currentTime,
        originCoordinates: origin,
        groupSize: 2,
      });

      expect(recommendations[0].place.title).toBe('Far Event');
      expect(recommendations[1].place.title).toBe('Nearby Spot');
    });

    it('should generate optimized itinerary', () => {
      const currentTime = new Date('2025-02-11T09:00:00Z');
      const origin: [number, number] = [46.0748, 11.1217];

      const places: (IEvent | ISpot)[] = [
        // Explicitly type the array
        {
          title: 'Late Event',
          location: {
            type: 'Point' as const, // Use const assertion to make it a literal type
            coordinates: [11.1217, 46.0748] as [number, number],
          },
          startDateTimeZ: new Date('2025-02-11T14:00:00Z'),
          endDateTimeZ: new Date('2025-02-11T16:00:00Z'),
          description: 'Test',
          abstract: '',
          address: 'Test',
        } as IEvent, // Assert as IEvent
        {
          title: 'Early Event',
          location: {
            type: 'Point' as const,
            coordinates: [11.1217, 46.0748] as [number, number],
          },
          startDateTimeZ: new Date('2025-02-11T10:00:00Z'),
          endDateTimeZ: new Date('2025-02-11T12:00:00Z'),
          description: 'Test',
          abstract: '',
          address: 'Test',
        } as IEvent, // Assert as IEvent
      ];

      const itinerary = recommendationService.getOptimizedItinerary(places, {
        currentTime,
        originCoordinates: origin,
        groupSize: 2,
      });

      expect(itinerary[0].title).toBe('Early Event');
      expect(itinerary[1].title).toBe('Late Event');
    });
  });
});
