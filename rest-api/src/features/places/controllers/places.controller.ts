import { getValidEventByCoordinates } from './events.controller';
import { catchAsync } from '@core/utils/catchAsync';
import { RequestHandler } from 'express';


export const getValidPlaces: RequestHandler = async(req, res, next)=>{
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const event = await getValidEventByCoordinates(latitude, longitude);

  res.status(200).json(event);
  
};


export default {
  getValidPlaces: catchAsync(getValidPlaces)
};