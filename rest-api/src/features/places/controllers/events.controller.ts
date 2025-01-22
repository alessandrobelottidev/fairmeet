import { executeQuery, parseFields, parsePagination, setCache } from '@core/middlewares';
import { NotFoundError } from '@core/middlewares/errors/notFound.error';
import Event from '@features/places/models/event';
import { RequestHandler } from 'express';

const ALLOWED_FIELDS = [
  'title',
  'address',
  'description',
  'location',
  'startDateTimeZ',
  'endDateTimeZ',
  'abstract',
  'email',
  'socialMediaHandles',
  'featuredImageUrl',
  'updated_at',
] as string[];

export const getEvents: RequestHandler[] = [
  parsePagination({ maxLimit: 100 }),
  parseFields(Event, {
    allowedFields: ALLOWED_FIELDS,
  }),
  setCache({ timeout: 900 }),
  executeQuery(Event, {
    preQuery: async (query, req) => {
      const showFutureOnly = req.query.futureOnly === 'true';

      if (showFutureOnly) {
        const futureDate = new Date();
        query.where('startDateTimeZ').gte(futureDate);
        return { additionalQuery: { startDateTimeZ: { $gte: futureDate } } };
      }
    },
    postQuery: async (events) => {
      return events.map(
        (event: {
          startDateTimeZ: string | number | Date;
          endDateTimeZ: string | number | Date;
        }) => ({
          ...event,
          formattedStartDate: event.startDateTimeZ
            ? new Date(event.startDateTimeZ).toLocaleDateString()
            : undefined,
          formattedEndDate: event.endDateTimeZ
            ? new Date(event.endDateTimeZ).toLocaleDateString()
            : undefined,
        }),
      );
    },
  }),
];

export const getEventById: RequestHandler[] = [
  parseFields(Event, {
    allowedFields: ALLOWED_FIELDS,
  }),
  executeQuery(Event, {
    preQuery: async (query, req) => {
      query.where('_id').equals(req.params.id).limit(1); // Using where/equals instead of findById
    },
    postQuery: async (events) => {
      const event = events[0];
      if (!event) return null;
      return {
        ...event,
        formattedStartDate: event.startDateTimeZ
          ? new Date(event.startDateTimeZ).toLocaleDateString()
          : undefined,
        formattedEndDate: event.endDateTimeZ
          ? new Date(event.endDateTimeZ).toLocaleDateString()
          : undefined,
      };
    },
  }),
];

export const createEvent: RequestHandler = async (req, res) => {
  const event = new Event(req.body);
  const eventData = await event.save();
  res.status(201).json(eventData);
};

export const patchEventByID: RequestHandler = async (req, res, next) => {
  const update_fields = req.body;

  const event = await Event.findByIdAndUpdate(req.params.id, update_fields, {
    runValidators: true,
    returnDocument: 'after',
  });

  if (!event) {
    return next(new NotFoundError('Evento non trovato'));
  }

  res.status(200).json(event);
};

export const deleteEventByID: RequestHandler = async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new NotFoundError('Evento non trovato'));
  }

  res.status(200).json(event);
};

export const getEventsByCoordinates = async (
  latitude: number,
  longitude: number,
  radius: number,
) => {
  const event_list = await Event.find({
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: radius,
        $minDistance: 0,
      },
    },
  });

  return event_list;
};

export default {
  getEvents,
  createEvent,
  getEventById,
  patchEventByID,
  deleteEventByID,
  getEventsByCoordinates,
};
