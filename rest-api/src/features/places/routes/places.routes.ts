import controller, { getPlacesByCoordinates } from '@features/places/controllers/places.controller';
import e from 'express';

const router = e.Router();

router.route('/').get(controller.getPlacesByCoordinates);

export default router;
