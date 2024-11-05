import e from "express";
import Spot from "../../models/spot";
import { validateSpot } from "./middleware";

const router = e.Router();

router
  .route("/")
  .get(async (_, res) => {
    let spots = await Spot.find();
    res.status(200).json(spots);
  })
  .post(validateSpot, async (req, res) => {
    const spot = new Spot(req.body);

    let spotData = await spot.save();

    res.status(201).json(spotData);
  });

export default router;
