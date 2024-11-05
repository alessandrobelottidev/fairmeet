import e from "express";
import event from "../models/event";
const router = e.Router();

router.route("/").get(async (req, res) => {
  let events = await event.find({});

  console.log(events);

  res.status(200).json({ test: "test" });
});

export default router;
