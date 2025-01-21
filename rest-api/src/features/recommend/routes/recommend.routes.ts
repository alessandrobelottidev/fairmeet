import controller from '@features/recommend/controllers/recommend.controllers';
import e from 'express';

const router = e.Router();

/**
 * @swagger
 * /v1/recommend:
 *   get:
 *     tags:
 *       - Recommendations | FEATURE
 *     summary: Get place recommendations based on users' coordinates
 *     description: Returns recommended places based on the group's location and preferences. Uses a centroid calculation to find the optimal meeting point.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coordinates
 *               - groupSize
 *               - timeOfDay
 *               - preferences
 *             properties:
 *               coordinates:
 *                 type: array
 *                 description: Array of [longitude, latitude] coordinates for each user in the group
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                   minItems: 2
 *                   maxItems: 2
 *                 example: [[12.4924, 41.8902], [12.4956, 41.8919]]
 *               groupSize:
 *                 type: integer
 *                 minimum: 1
 *                 description: Number of people in the group
 *                 example: 3
 *               timeOfDay:
 *                 type: string
 *                 enum: [morning, afternoon, evening, night]
 *                 description: Time of day for the recommendation
 *                 example: "afternoon"
 *               preferences:
 *                 type: object
 *                 required:
 *                   - maxDistance
 *                   - preferIndoor
 *                   - preferOutdoor
 *                   - activityType
 *                 properties:
 *                   maxDistance:
 *                     type: number
 *                     description: Maximum distance in kilometers from the centroid point
 *                     minimum: 0
 *                     example: 5
 *                   preferIndoor:
 *                     type: boolean
 *                     description: Preference for indoor activities
 *                     example: true
 *                   preferOutdoor:
 *                     type: boolean
 *                     description: Preference for outdoor activities
 *                     example: false
 *                   activityType:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [cultural, sports, entertainment, dining, shopping]
 *                     description: Types of activities preferred
 *                     example: ["cultural", "dining"]
 *     responses:
 *       200:
 *         description: List of recommended places sorted by relevance score
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   place:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the place
 *                       title:
 *                         type: string
 *                         description: Name of the place
 *                       address:
 *                         type: string
 *                         description: Address of the place
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
 *                       description:
 *                         type: string
 *                         description: Detailed description of the place
 *                       activityType:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Types of activities available at this place
 *                       isIndoor:
 *                         type: boolean
 *                         description: Whether the place is indoor
 *                       isOutdoor:
 *                         type: boolean
 *                         description: Whether the place is outdoor
 *                   score:
 *                     type: number
 *                     description: Relevance score for the recommendation (0-1)
 *                     minimum: 0
 *                     maximum: 1
 *                     example: 0.85
 *                   distance:
 *                     type: number
 *                     description: Distance in kilometers from the centroid point
 *                     example: 2.5
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.route('/').get(controller.getRecommendationsByUsersCoordinates);

export default router;
