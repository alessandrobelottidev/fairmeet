import controller, {
  deleteEventByID,
  getEventById,
  getEvents,
} from '@features/places/controllers/events.controller';
import { validateEventSchema } from '@features/places/middlewares/events.middleware';
import e from 'express';

const router = e.Router();

/**
 * @swagger
 * /v1/events:
 *   get:
 *     tags:
 *       - Events | FEATURE
 *     summary: Get all upcoming events
 *     description: Retrieve a paginated list of all upcoming events, with options for sorting and selecting specific fields.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The page number for pagination (starting from 0).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Maximum number of items per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "startDateTimeZ"
 *         description: Field by which to sort results.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "desc"
 *         description: Order of sorting, either ascending (asc) or descending (desc).
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to retrieve.
 *     responses:
 *       200:
 *         description: A paginated list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The event ID.
 *                       title:
 *                         type: string
 *                         description: Title of the event.
 *                       address:
 *                         type: string
 *                         description: Address where the event takes place.
 *                       description:
 *                         type: string
 *                         description: Detailed description of the event.
 *                       location:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "Point"
 *                           coordinates:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [12.4924, 41.8902]
 *                       startDateTimeZ:
 *                         type: string
 *                         format: date-time
 *                         description: Event start date and time.
 *                       endDateTimeZ:
 *                         type: string
 *                         format: date-time
 *                         description: Event end date and time.
 *                       formattedStartDate:
 *                         type: string
 *                         description: Formatted start date.
 *                       formattedEndDate:
 *                         type: string
 *                         description: Formatted end date.
 *                       abstract:
 *                         type: string
 *                         description: Brief description of the event.
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: Contact email for the event.
 *                       socialMediaHandles:
 *                         type: object
 *                         description: Social media handles for the event.
 *                       featuredImageUrl:
 *                         type: string
 *                         description: URL of the featured image.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Last update timestamp.
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalDocs:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                     prevPage:
 *                       type: integer
 *                       nullable: true
 *       500:
 *         description: Internal server error.
 *   post:
 *     tags:
 *       - Events | FEATURE
 *     summary: Create a new event
 *     description: Add a new event to the database with detailed information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDateTimeZ
 *               - endDateTimeZ
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 description: The event title.
 *                 example: "Summer Music Festival"
 *               address:
 *                 type: string
 *                 description: The event address.
 *                 example: "Central Park, New York"
 *               description:
 *                 type: string
 *                 description: Detailed description of the event.
 *                 example: "Annual summer music festival featuring local and international artists."
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "Point"
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [12.4924, 41.8902]
 *               startDateTimeZ:
 *                 type: string
 *                 format: date-time
 *                 description: Event start date and time.
 *                 example: "2024-07-15T18:00:00Z"
 *               endDateTimeZ:
 *                 type: string
 *                 format: date-time
 *                 description: Event end date and time.
 *                 example: "2024-07-15T23:00:00Z"
 *               abstract:
 *                 type: string
 *                 description: Brief description of the event.
 *                 example: "Annual summer music festival"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email for the event.
 *                 example: "info@summerfest.com"
 *               socialMediaHandles:
 *                 type: object
 *                 description: Social media handles for the event.
 *                 example: { "facebook": "facebook.com/summerfest", "instagram": "instagram.com/summerfest" }
 *               featuredImageUrl:
 *                 type: string
 *                 description: URL of the featured image.
 *                 example: "https://example.com/images/summerfest.jpg"
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the created event.
 *                 title:
 *                   type: string
 *                 address:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                 startDateTimeZ:
 *                   type: string
 *                   format: date-time
 *                 endDateTimeZ:
 *                   type: string
 *                   format: date-time
 *                 abstract:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 socialMediaHandles:
 *                   type: object
 *                 featuredImageUrl:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request body.
 *       500:
 *         description: Internal server error.
 */
router.route('/').get(controller.getEvents).post(validateEventSchema, controller.createEvent);

/**
 * @swagger
 * /v1/events/{id}:
 *   get:
 *     tags:
 *       - Events | FEATURE
 *     summary: Get event by ID
 *     description: Retrieve details of a specific event by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the event.
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to retrieve.
 *     responses:
 *       200:
 *         description: Detailed information of the event.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 address:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                 startDateTimeZ:
 *                   type: string
 *                   format: date-time
 *                 endDateTimeZ:
 *                   type: string
 *                   format: date-time
 *                 formattedStartDate:
 *                   type: string
 *                 formattedEndDate:
 *                   type: string
 *                 abstract:
 *                   type: string
 *                 email:
 *                   type: string
 *                 socialMediaHandles:
 *                   type: object
 *                 featuredImageUrl:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 *   patch:
 *     tags:
 *       - Events | FEATURE
 *     summary: Update an event by ID
 *     description: Modify one or more fields of a specific event.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *               startDateTimeZ:
 *                 type: string
 *                 format: date-time
 *               endDateTimeZ:
 *                 type: string
 *                 format: date-time
 *               abstract:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 address:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: object
 *                 startDateTimeZ:
 *                   type: string
 *                   format: date-time
 *                 endDateTimeZ:
 *                   type: string
 *                   format: date-time
 *                 abstract:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Event not found
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Events | FEATURE
 *     summary: Delete an event by ID
 *     description: Remove a specific event from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 address:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: object
 *                 startDateTimeZ:
 *                   type: string
 *                   format: date-time
 *                 endDateTimeZ:
 *                   type: string
 *                   format: date-time
 *                 abstract:
 *                   type: string
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router
  .route('/:id')
  .get(controller.getEventById)
  .patch(controller.patchEventByID)
  .delete(controller.deleteEventByID);

export default router;
