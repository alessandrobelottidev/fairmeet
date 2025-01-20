import { IPlace } from '../types/place.interface';
import { getEventsByCoordinates } from './events.controller';
import { getSpotsByCoordinates } from './spots.controller';
import { RequestHandler } from 'express';

export const getPlacesByCoordinates: RequestHandler = async (req, res, next) => {
  const { latitude, longitude } = req.body;
  const radius = 10000.0; //equals to 10km

  const events_list = await getEventsByCoordinates(latitude, longitude, radius);
  const spots_list = await getSpotsByCoordinates(latitude, longitude, radius);
  const result: IPlace[] = [...events_list, ...spots_list];

  //ordina i risultati per il più vicino dall'utente„
  result.sort((a, b) => {
    if (
      Math.pow(a.location.coordinates[0], 2) + Math.pow(a.location.coordinates[1], 2) <=
      Math.pow(b.location.coordinates[0], 2) + Math.pow(b.location.coordinates[1], 2)
    ) {
      return -1;
    } else {
      return 1;
    }
  });
  res.status(200).json(result);
};

export default {
  getPlacesByCoordinates: getPlacesByCoordinates,
};
