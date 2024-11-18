import { CustomError } from '@core/errors/custom.error';
import { PaginatedResponse, PaginationQuery } from '@core/interfaces/pagination.interface';
import { catchAsync } from '@core/utils/catchAsync';
import { IEvent } from '@features/places/event.interface';
import Event from '@features/places/models/event';
import { RequestHandler } from 'express';

// TODO: For some fields allow the LIKE parameter. eg. title LIKE "%a%"
// TODO: Decide on a smarter caching system (cursor based?), maybe even server side (redis?)
export const getEvents: RequestHandler = async (req, res, next) => {
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
      selectedFields = fields.split(',').filter((field): field is keyof IEvent => {
        return field in Event.schema.paths;
      });
    }

    // Calculate skip for pagination
    const skip = pageNum * limitNum;

    // Build sort object
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {
      [sortBy]: order,
    };

    // Build the query
    let query = Event.find().sort(sortOptions).skip(skip).limit(limitNum);

    // Add field selection if specified
    if (selectedFields.length > 0) {
      query = query.select(selectedFields.join(' '));
    }

    // Execute queries in parallel using Promise.all
    const [events, totalDocs] = await Promise.all([
      query.lean(), // Use lean() for better performance when you don't need Mongoose document features
      Event.countDocuments(),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalDocs / limitNum);
    const hasNextPage = pageNum < totalPages - 1;
    const hasPrevPage = pageNum > 0;

    const response: PaginatedResponse<(typeof events)[0]> = {
      data: events,
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
    console.error('Error in getEvents:', error);
    return next(
      new CustomError('Errror interno del server mentre cercava gli events richiesti', 404),
    );
  }
};

export const createEvent: RequestHandler = async (req, res) => {
  const event = new Event(req.body);
  const eventData = await event.save();
  res.status(201).json(eventData);
};

export const getEventById: RequestHandler = async (req, res, next) => {
  const { fields } = req.query as { fields?: string };

  // Parse and validate requested fields
  let selectedFields: string[] = [];
  if (fields) {
    selectedFields = fields.split(',').filter((field): field is keyof IEvent => {
      return field in Event.schema.paths;
    });
  }

  const event = await Event.findById(req.params.id, selectedFields.join(' ')).lean(); // lean method to return a javascript object

  if (!event) {
    return next(new CustomError('Event non trovato', 404));
  }

  res.status(200).json(event);
};
export const patchEventByID: RequestHandler = async (req, res, next) => {
  const update_fields = req.body;

  //see the possible options like runValidators
  const event = await Event.findByIdAndUpdate(req.params.id, update_fields, {
    runValidators: true,
    returnDocument: 'after',
  });

  res.status(200).json(event);
  // const event = await Event.findByIdAndUpdate(req.params.id, )
};

export const deleteEventByID: RequestHandler = async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  // console.log(event);

  //handle error if event is not found
  if (!event) {
    return next(new CustomError('Event non trovato, 404'));
  }

  res.status(200).json(event);
};

export const getEventByCoordinates = async (latitude: number, longitude: number) => {
  // console.log(latitude);
  // console.log(longitude);

  const event = await Event.find({})
    .where('latitude')
    .gte(latitude - 1)
    .lte(latitude + 1)
    .where('longitude')
    .gte(longitude - 1)
    .lte(longitude + 1)
    .then();
  // const event = await Event.find({});

  return event.map((el) => {
    return {
      title: el.title,
      address: el.address,
      description: el.description,
      latitude: el.latitude,
      longitude: el.longitude,
      startDateTimeZ: el.startDateTimeZ,
      endDateTimeZ: el.endDateTimeZ,
      abstract: el.abstract,
      email: el.email,
      socialMediaHandles: el.socialMediaHandles,
      featuredImageUrl: el.featuredImageUrl,
      updated_at: el.updated_at,
    } as IEvent;
  });
};

export default {
  getEvents: catchAsync(getEvents),
  createEvent: catchAsync(createEvent),
  getEventById: catchAsync(getEventById),
  patchEventByID: catchAsync(patchEventByID),
  deleteEventByID: catchAsync(deleteEventByID),
  getEventByCoordinates: getEventByCoordinates,
};
