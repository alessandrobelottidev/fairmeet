import event from '@features/places/models/event';
import e from 'express';

const router = e.Router();

router.route('/').get(async (req, res) => {
  let events = await event.find({});

  console.log(events);

  res.status(200).json({ test: 'test' });
});

export default router;
