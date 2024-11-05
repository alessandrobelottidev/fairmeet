import { NotFoundError } from '@/errors';
import { SpotDTO } from '@interfaces/spot.interface';
import Spot from '@models/spot';
import { RequestHandler } from 'express';

export const getSpots: RequestHandler = async (_, res) => {
  const spots = await Spot.find();
  res.status(200).json(spots);
};

export const createSpot: RequestHandler = async (req, res) => {
  const spot = new Spot(req.body);
  const spotData = await spot.save();
  res.status(201).json(spotData);
};

// This function sends a spot with the specified id and all the fields or, if specific fields
// are specified in the header, sends only them to the client.
// BEWARE: If a requested field is not present, it will not be included in the response,
// so do not expect the specific field with a null value associated with it.
export const getSpotById: RequestHandler = async (req, res) => {
  let fields: string[] = [];

  // Check that the query "fields" in an array
  if (Array.isArray(req.query.fields)) {
    // Filter out fields that do not belong to the ISpot interface
    fields = (req.query.fields as string[]).filter((field): field is keyof SpotDTO => {
      return field in Spot.schema.paths;
    });
  }

  const spot = await Spot.findById(req.params.id, fields.join(' '));

  if (!spot) {
    res.status(404).json(NotFoundError).end();
    return;
  }

  res.status(200).json({
    _id: spot._id,
    title: spot.title,
    address: spot.address,
    description: spot.description,
    latitude: spot.latitude,
    longitude: spot.longitude,
    abstract: spot.abstract,
    email: spot.email,
    socialMediaHandles: spot.socialMediaHandles,
    featuredImageUrl: spot.featuredImageUrl,
    updated_at: spot.updated_at,
  });
};

export default {
  getSpots,
  createSpot,
  getSpotById,
};
