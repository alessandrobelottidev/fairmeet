import { ISpot } from '../spot.interface';
import { getEventByCoordinates } from './events.controller';
import { getSpotByCoordinates } from './spots.controller';
import { catchAsync } from '@core/utils/catchAsync';
import { RequestHandler } from 'express';

export const getPlacesByCoordinates: RequestHandler = async (req, res, next) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const events = await getEventByCoordinates(latitude, longitude);
  const spots = await getSpotByCoordinates(latitude, longitude);

  const result: ISpot[] = [...events, ...spots];

  res.status(200).json(result);
};

export default {
  getPlacesByCoordinates: catchAsync(getPlacesByCoordinates),
};
