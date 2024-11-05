import e from "express";
import controller from "@controllers/spots.controller";
import { validateSpot } from "@middlewares/spots.middleware";

const router = e.Router();

router
  .route("/")
  .get(controller.getSpots)
  .post(validateSpot, controller.createSpot);

router.route("/:id").get(controller.getSpotById);

export default router;
