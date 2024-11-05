import e from "express";
import controller from "./spots.controller";
import { validateSpot } from "./spots.middleware";

const router = e.Router();

router
  .route("/")
  .get(controller.getSpots)
  .post(validateSpot, controller.createSpot);

router.route("/:id").get(controller.getSpotById);

export default router;
