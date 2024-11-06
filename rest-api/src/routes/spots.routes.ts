import controller from '@controllers/spots.controller';
import { validateSpot } from '@middlewares/spots.middleware';
import e from 'express';

const router = e.Router();

/**
 * @swagger
 * /v1/spots:
 *   get:
 *     tags:
 *       - Spots
 *     summary: Get all spots
 *     description: Retrieve a list of all spots from the database
 *     responses:
 *       200:
 *         description: A list of spots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The spot ID
 *                   title:
 *                     type: string
 *                     description: The spot title
 *                   address:
 *                     type: string
 *                     description: The spot address
 *                   description:
 *                     type: string
 *                     description: Detailed description of the spot
 *                   latitude:
 *                     type: number
 *                     description: Geographical latitude
 *                   longitude:
 *                     type: number
 *                     description: Geographical longitude
 *                   abstract:
 *                     type: string
 *                     description: Brief description of the spot
 *                   email:
 *                     type: string
 *                     description: Contact email for the spot
 *                   socialMediaHandles:
 *                     type: object
 *                     description: Social media handles associated with the spot
 *                   featuredImageUrl:
 *                     type: string
 *                     description: URL of the featured image
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: Last update timestamp
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Spots
 *     summary: Create a new spot
 *     description: Add a new spot to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - address
 *               - latitude
 *               - longitude
 *             properties:
 *               title:
 *                 type: string
 *                 description: The spot title
 *               address:
 *                 type: string
 *                 description: The spot address
 *               description:
 *                 type: string
 *                 description: Detailed description of the spot
 *               latitude:
 *                 type: number
 *                 description: Geographical latitude
 *               longitude:
 *                 type: number
 *                 description: Geographical longitude
 *               abstract:
 *                 type: string
 *                 description: Brief description of the spot
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email for the spot
 *               socialMediaHandles:
 *                 type: object
 *                 description: Social media handles associated with the spot
 *               featuredImageUrl:
 *                 type: string
 *                 description: URL of the featured image
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
 *                   description: The created spot ID
 *                 title:
 *                   type: string
 *                   description: The spot title
 *                 # ... (same properties as above)
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.route('/').get(controller.getSpots).post(validateSpot, controller.createSpot);

/**
 * @swagger
 * /v1/spots/{id}:
 *   get:
 *     tags:
 *      - Spots
 *     summary: Get spot by ID.
 *     description: Get spot by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Spot _id
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Spot not found
 *       '500':
 *         description: Internal server error
 */
router.route('/:id').get(controller.getSpotById);

export default router;
