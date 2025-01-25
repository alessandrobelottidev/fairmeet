import { PlaceRecommendationService } from '@core/services/recom-engine/placeRecommendationService';
import { RecommendationOptions, ScoredPlace } from '@core/services/recom-engine/types';
import { getPlacesByCoordinates } from '@features/places/controllers/places.controller';
import { RequestHandler } from 'express';

function calculateCentroid(coordinates: number[][]) {
  let x = 0,
    y = 0,
    z = 0;

  coordinates.forEach(([longitude, latitude]) => {
    const latRad = (latitude * Math.PI) / 180; // Convert to radians
    const lonRad = (longitude * Math.PI) / 180; // Convert to radians

    x += Math.cos(latRad) * Math.cos(lonRad);
    y += Math.cos(latRad) * Math.sin(lonRad);
    z += Math.sin(latRad);
  });

  const total = coordinates.length;
  x /= total;
  y /= total;
  z /= total;

  const lon = Math.atan2(y, x) * (180 / Math.PI); // Convert back to degrees
  const hyp = Math.sqrt(x * x + y * y); // Hypotenuse
  const lat = Math.atan2(z, hyp) * (180 / Math.PI); // Convert back to degrees

  return [lon, lat];
}

export const getRecommendationsByUsersCoordinates: RequestHandler = async (req, res, next) => {
  const list_coordinates = req.body.coordinates;
  // const radius = req.body.preferences.maxDistance * 1000; //conversion km to m
  const radius = 10000;

  //Least distant common point
  const [latitude, longitude] = calculateCentroid(list_coordinates);

  //Get the list of all places in IPlaces format
  const result1 = await getPlacesByCoordinates(latitude, longitude, radius);

  //Set a variable with RecommendationOptions vlaue for the next function
  const data: RecommendationOptions = {
    currentTime: new Date(),
    originCoordinates: [latitude, longitude],
    groupSize: req.body.groupSize,
    timeOfDay: req.body.timeOfDay,
    preferences: {
      maxDistance: radius, // in kilometers CHANGE this to the preferences of the user
      preferIndoor: req.body.preferences.preferIndoor,
      preferOutdoor: req.body.preferences.preferOutdoor,
      activityType: req.body.preferences.activityType,
    },
  };

  // console.log(data);

  const service = new PlaceRecommendationService();
  const result2: ScoredPlace[] = await service.getRecommendations(result1, data);

  res.status(200).json(result2);
};

export default {
  getRecommendationsByUsersCoordinates,
};
