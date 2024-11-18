
import controller, {getValidPlaces} from '@features/places/controllers/places.controller';
import e from 'express';

const router = e.Router();

router.route('/').get(controller.getValidPlaces);

export default router;
