import { CustomError } from '@errors/custom.error';
import { PaginatedResponse, PaginationQuery } from '@interfaces/pagination.interface';
import { ISpot } from '@interfaces/spot.interface';
import Spot from '@models/spot';
import { RequestHandler } from 'express';

// TODO: For some fields allow the LIKE parameter. eg. title LIKE "%a%"
// TODO: Decide on a smarter caching system (cursor based?), maybe even server side (redis?)
export const getSpots: RequestHandler = async (req, res, next) => {
  try {
    const {
      page = '0',
      limit = '10',
      sortBy = 'updated_at',
      order = 'desc',
      fields,
    } = req.query as PaginationQuery;

    // Convert string parameters to numbers
    const pageNum = Math.max(0, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Cap at 100 items per page

    // Parse and validate requested fields
    let selectedFields: string[] = [];
    if (fields) {
      selectedFields = fields.split(',').filter((field): field is keyof ISpot => {
        return field in Spot.schema.paths;
      });
    }

    // Calculate skip for pagination
    const skip = pageNum * limitNum;

    // Build sort object
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {
      [sortBy]: order,
    };

    // Build the query
    let query = Spot.find().sort(sortOptions).skip(skip).limit(limitNum);

    // Add field selection if specified
    if (selectedFields.length > 0) {
      query = query.select(selectedFields.join(' '));
    }

    // Execute queries in parallel using Promise.all
    const [spots, totalDocs] = await Promise.all([
      query.lean(), // Use lean() for better performance when you don't need Mongoose document features
      Spot.countDocuments(),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalDocs / limitNum);
    const hasNextPage = pageNum < totalPages - 1;
    const hasPrevPage = pageNum > 0;

    const response: PaginatedResponse<(typeof spots)[0]> = {
      data: spots,
      pagination: {
        totalDocs,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? pageNum + 1 : null,
        prevPage: hasPrevPage ? pageNum - 1 : null,
      },
    };

    // Set Cache-Control header to enable caching
    res.setHeader('Cache-Control', 'public, max-age=900'); // Cache for 15 minutes, expressed in seconds

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getSpots:', error);
    return next(
      new CustomError('Errror interno del server mentre cercava gli spots richiesti', 404),
    );
  }
};

export const createSpot: RequestHandler = async (req, res) => {
  const spot = new Spot(req.body);
  const spotData = await spot.save();
  res.status(201).json(spotData);
};

export const getSpotById: RequestHandler = async (req, res, next) => {
  const { fields } = req.query as { fields?: string };

  // Parse and validate requested fields
  let selectedFields: string[] = [];
  if (fields) {
    selectedFields = fields.split(',').filter((field): field is keyof ISpot => {
      return field in Spot.schema.paths;
    });
  }

  const spot = await Spot.findById(req.params.id, selectedFields.join(' ')).lean();

  if (!spot) {
    return next(new CustomError('Spot non trovato', 404));
  }

  res.status(200).json(spot);
};

export default {
  getSpots,
  createSpot,
  getSpotById,
};
