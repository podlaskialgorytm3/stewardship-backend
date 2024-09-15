import { Router } from "express";

import UserAuthentication from "../middlewares/auth";
import { DayRestrictionController } from "../controllers/day-restriction";

const router = Router();
const dayRestrictionController = new DayRestrictionController();
const userAuthentication = new UserAuthentication();

router.post(
  "/day-restriction",
  userAuthentication.authMiddleware,
  dayRestrictionController.postDayRestriction
);

router.get(
  "/day-restriction",
  userAuthentication.authMiddleware,
  dayRestrictionController.getDayRestriction
);

export default router;
