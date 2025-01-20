import { calculateCentroid } from './findCommonPoint';
import { getPlacesByCoordinates } from '@features/places/controllers/places.controller';
import { RequestHandler } from 'express';

export const getRecommendationsByUsersCoordinates: RequestHandler = async (req, res, next) => {
  const list_coordinates = req.body.coordinates;

  //Least distant common point
  const [latitude, longitude] = calculateCentroid(list_coordinates);

  const result = await getPlacesByCoordinates(latitude, longitude);

  res.status(200).json(result);
};

export default {
  getRecommendationsByUsersCoordinates,
};
