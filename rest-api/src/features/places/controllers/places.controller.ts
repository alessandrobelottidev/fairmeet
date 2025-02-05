import { IPlace } from '../types/place.interface';
import { getEventsByCoordinates } from './events.controller';
import { getSpotsByCoordinates } from './spots.controller';

export const getPlacesByCoordinates = async (
  latitude: number,
  longitude: number,
  radius: number,
) => {
  const events_list = await getEventsByCoordinates(latitude, longitude, radius);
  const spots_list = await getSpotsByCoordinates(latitude, longitude, radius);
  const result: IPlace[] = [...events_list, ...spots_list];

  return result;
};

export default {
  getPlacesByCoordinates,
};
