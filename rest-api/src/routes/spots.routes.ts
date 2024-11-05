import controller from '@controllers/spots.controller';
import { validateSpot } from '@middlewares/spots.middleware';
import e from 'express';

const router = e.Router();

router.route('/').get(controller.getSpots).post(validateSpot, controller.createSpot);

/**
 * @swagger
 * /v1/employee/{id}:
 *   get:
 *     summary: Get employee by ID.
 *     description: Get employee by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Internal server error
 */
router.route('/:id').get(controller.getSpotById);

export default router;
