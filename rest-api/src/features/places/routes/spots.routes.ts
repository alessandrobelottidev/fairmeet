import controller from '@features/places/controllers/spots.controller';
import { validateSpotSchema } from '@features/places/middlewares/spots.middleware';
import e from 'express';

const router = e.Router();

/**
 * @swagger
 * /v1/spots:
 *   get:
 *     tags:
 *       - Spots
 *     summary: Get all spots
 *     description: Retrieve a paginated list of all spots, with options for sorting and selecting specific fields.
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
 *           default: "updated_at"
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
 *         description: Comma-separated list of fields to retrieve (e.g., "title,address").
 *     responses:
 *       200:
 *         description: A paginated list of spots.
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
 *                         description: The spot ID.
 *                       title:
 *                         type: string
 *                         description: Title of the spot.
 *                       address:
 *                         type: string
 *                         description: Address of the spot.
 *                       latitude:
 *                         type: number
 *                         description: Latitude of the spot.
 *                       longitude:
 *                         type: number
 *                         description: Longitude of the spot.
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
 *       - Spots
 *     summary: Create a new spot
 *     description: Add a new spot to the database with detailed information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The spot title.
 *                 example: "Sunny Beach"
 *               address:
 *                 type: string
 *                 description: The spot address.
 *                 example: "456 Ocean Drive, Beachtown"
 *               description:
 *                 type: string
 *                 description: Detailed description of the spot.
 *                 example: "A popular beach with clear water and white sand."
 *               latitude:
 *                 type: number
 *                 description: Geographical latitude.
 *                 example: 36.778259
 *               longitude:
 *                 type: number
 *                 description: Geographical longitude.
 *                 example: -119.417931
 *               abstract:
 *                 type: string
 *                 description: Brief description of the spot.
 *                 example: "Scenic beach."
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email for the spot.
 *                 example: "info@sunnybeach.com"
 *               socialMediaHandles:
 *                 type: object
 *                 description: Social media handles associated with the spot.
 *                 additionalProperties:
 *                   type: string
 *                 example: { "facebook": "facebook.com/sunnybeach", "instagram": "instagram.com/sunnybeach" }
 *               featuredImageUrl:
 *                 type: string
 *                 description: URL of the featured image.
 *                 example: "https://example.com/images/sunnybeach.jpg"
 *     responses:
 *       201:
 *         description: Spot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the created spot.
 *                   example: "609e128c81d3e2b1c4f43c56"
 *                 title:
 *                   type: string
 *                   description: The spot title.
 *                   example: "Sunny Beach"
 *                 address:
 *                   type: string
 *                   description: The spot address.
 *                   example: "456 Ocean Drive, Beachtown"
 *                 description:
 *                   type: string
 *                   description: Detailed description of the spot.
 *                   example: "A popular beach with clear water and white sand."
 *                 latitude:
 *                   type: number
 *                   description: Geographical latitude.
 *                   example: 36.778259
 *                 longitude:
 *                   type: number
 *                   description: Geographical longitude.
 *                   example: -119.417931
 *                 abstract:
 *                   type: string
 *                   description: Brief description of the spot.
 *                   example: "Scenic beach."
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Contact email for the spot.
 *                   example: "info@sunnybeach.com"
 *                 socialMediaHandles:
 *                   type: object
 *                   description: Social media handles associated with the spot.
 *                   additionalProperties:
 *                     type: string
 *                   example: { "facebook": "facebook.com/sunnybeach", "instagram": "instagram.com/sunnybeach" }
 *                 featuredImageUrl:
 *                   type: string
 *                   description: URL of the featured image.
 *                   example: "https://example.com/images/sunnybeach.jpg"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the spot was last updated.
 *                   example: "2023-10-12T07:20:50.52Z"
 *       400:
 *         description: Invalid request body.
 *       500:
 *         description: Internal server error.
 */
router.route('/').get(controller.getSpots).post(validateSpotSchema, controller.createSpot);

/**
 * @swagger
 * /v1/spots/{id}:
 *   get:
 *     tags:
 *       - Spots
 *     summary: Get spot by ID
 *     description: Retrieve details of a specific spot by its ID, with an option to select specific fields.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the spot.
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to retrieve (e.g., "title,address").
 *         example: "title,address,latitude,longitude"
 *     responses:
 *       200:
 *         description: Detailed information of the spot.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier of the spot.
 *                 title:
 *                   type: string
 *                   description: Title of the spot.
 *                   example: "Beautiful Park"
 *                 address:
 *                   type: string
 *                   description: Address of the spot.
 *                   example: "123 Park Ave, Cityville"
 *                 description:
 *                   type: string
 *                   description: Full description of the spot.
 *                   example: "A scenic park with lots of greenery and walking paths."
 *                 latitude:
 *                   type: number
 *                   description: Latitude of the spot.
 *                   example: 34.052235
 *                 longitude:
 *                   type: number
 *                   description: Longitude of the spot.
 *                   example: -118.243683
 *                 abstract:
 *                   type: string
 *                   description: Brief description of the spot.
 *                   example: "A beautiful city park."
 *                 email:
 *                   type: string
 *                   description: Contact email for inquiries.
 *                   example: "contact@beautifulpark.com"
 *                 socialMediaHandles:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                   description: Social media handles.
 *                   example: { "facebook": "facebook.com/beautifulpark", "instagram": "instagram.com/beautifulpark" }
 *                 featuredImageUrl:
 *                   type: string
 *                   description: URL for the spot's featured image.
 *                   example: "https://example.com/images/park.jpg"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Last updated timestamp.
 *                   example: "2023-10-12T07:20:50.52Z"
 *       404:
 *         description: Spot not found.
 *       500:
 *         description: Internal server error.
 */
router.route('/:id').get(controller.getSpotById);

/**
 * @swagger
 * /v1/spots/{id}:
 *   patch:
 *     tags:
 *       - Spots
 *     summary: Update a specific spot by ID
 *     description: Modify one or more fields of a specific spot.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the spot to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the spot.
 *                 example: "Updated Sunny Beach"
 *               address:
 *                 type: string
 *                 description: Updated address of the spot.
 *                 example: "789 New Ocean Drive, Beachtown"
 *               description:
 *                 type: string
 *                 description: Updated detailed description of the spot.
 *               latitude:
 *                 type: number
 *                 description: Updated geographical latitude.
 *               longitude:
 *                 type: number
 *                 description: Updated geographical longitude.
 *               abstract:
 *                 type: string
 *                 description: Updated brief description of the spot.
 *     responses:
 *       200:
 *         description: Successfully updated spot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the updated spot.
 *                 title:
 *                   type: string
 *                 address:
 *                   type: string
 *                 description:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 abstract:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Last update timestamp.
 *       404:
 *         description: Spot not found
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Internal server error
 */
router.route('/:id').patch(controller.patchSpotByID);

/**
 * @swagger
 * /v1/spots/{id}:
 *   delete:
 *     tags:
 *       - Spots
 *     summary: Delete a spot by ID
 *     description: Remove a specific spot from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the spot to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the spot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the deleted spot.
 *                 title:
 *                   type: string
 *                 address:
 *                   type: string
 *                 description:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 abstract:
 *                   type: string
 *       404:
 *         description: Spot not found
 *       500:
 *         description: Internal server error
 */
router.route('/:id').delete(controller.deleteSpotByID);
export default router;
