import Spot from "../../models/spot";
import {
  NotFoundError,
  InvalidPayloadError,
  createErrorWithDetails,
} from "../../errors";
import { RequestHandler } from "express";

export const getSpots: RequestHandler = async (_, res) => {
  const spots = await Spot.find();
  res.status(200).json(spots);
};

export const createSpot: RequestHandler = async (req, res) => {
  const spot = new Spot(req.body);
  const spotData = await spot.save();
  res.status(201).json(spotData);
};

export const getSpotById: RequestHandler = async (req, res) => {
  const { field = [] } = req.query;
  let fields: string = "";
  if (Array.isArray(field)) {
    fields = field.join(" ");
  } else if (typeof field === "string") {
    fields = field;
  }

  let spot = await Spot.findById(req.params.id, fields).catch((reason) => {
    const invalidId = createErrorWithDetails(InvalidPayloadError, reason);
    res.status(400).json(invalidId);
  });

  if (spot === null) {
    res.status(404).json(NotFoundError);
  }

  res.status(200).json(spot);
};

export default {
  getSpots,
  createSpot,
  getSpotById,
};
