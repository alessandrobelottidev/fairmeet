import controller from '@features/recommend/controllers/recommend.controllers';
import e from 'express';

const router = e.Router();

router.route('/').get(controller.getRecommendationsByUsersCoordinates);

export default router;
