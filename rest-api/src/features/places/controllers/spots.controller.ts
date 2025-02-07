import { executeQuery, parseFields, parsePagination, setCache } from '@core/middlewares';
import { NotFoundError } from '@core/middlewares/errors/notFound.error';
import Spot from '@features/places/models/spot';
import { RequestHandler } from 'express';

const ALLOWED_FIELDS = [
  'title',
  'address',
  'description',
  'location',
  'abstract',
  'email',
  'socialMediaHandles',
  'featuredImageUrl',
  'updated_at',
] as string[];

export const getSpots: RequestHandler[] = [
  parsePagination({ maxLimit: 100 }),
  parseFields(Spot, {
    allowedFields: ALLOWED_FIELDS,
  }),
  setCache({ timeout: 900 }),
  executeQuery(Spot), // Most basic case - no special query modifications needed
];

export const getSpotById: RequestHandler[] = [
  parseFields(Spot, {
    allowedFields: ALLOWED_FIELDS,
  }),
  executeQuery(Spot, {
    preQuery: async (query, req) => {
      query.where('_id').equals(req.params.id).limit(1);
    },
    postQuery: async (spots) => {
      const spot = spots[0];
      if (!spot) return null;
      return spot;
    },
  }),
];

export const createSpot: RequestHandler = async (req, res) => {
  const spot = new Spot(req.body);
  const spotData = await spot.save();
  res.status(201).json(spotData);
};

export const patchSpotByID: RequestHandler = async (req, res, next) => {
  const update_fields = req.body;

  const spot = await Spot.findByIdAndUpdate(req.params.id, update_fields, {
    runValidators: true,
    returnDocument: 'after',
  });

  res.status(200).json(spot);
};

export const deleteSpotByID: RequestHandler = async (req, res, next) => {
  const spot = await Spot.findByIdAndDelete(req.params.id);

  if (!spot) {
    return next(new NotFoundError('Spot non trovato'));
  }

  res.status(200).json(spot);
};

export const getSpotsByCoordinates = async (
  latitude: number,
  longitude: number,
  radius: number,
) => {
  const spots_list = await Spot.find({
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: radius,
        $minDistance: 0,
      },
    },
  });

  return spots_list;
};

export default {
  getSpots,
  createSpot,
  getSpotById,
  patchSpotByID,
  deleteSpotByID,
  getSpotsByCoordinates,
};
