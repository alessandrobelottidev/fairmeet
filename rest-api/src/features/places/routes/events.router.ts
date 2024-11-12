import event from '../models/event';
import controller from '@features/places/controllers/events.controller';
import { validateSpotSchema } from '@features/places/middlewares/events.middleware';
import e from 'express';

const router = e.Router();

router.route('/').get(async (req, res) => {
  let events = await event.find({});

  console.log(events);

  res.status(200).json({ test: 'test' });
});

export default router;
