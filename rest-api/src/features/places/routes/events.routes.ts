import controller, {
  deleteEventByID,
  getEventById,
  getEvents,
} from '@features/places/controllers/events.controller';
import { validateEventSchema } from '@features/places/middlewares/events.middleware';
import e from 'express';

const router = e.Router();

router.route('/').get(controller.getEvents).post(validateEventSchema, controller.createEvent);

router
  .route('/:id')
  .get(controller.getEventById)
  .patch(controller.patchEventByID)
  .delete(controller.deleteEventByID);

export default router;
