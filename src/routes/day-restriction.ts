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
  dayRestrictionController.getDayRestrictions
);

router.get(
  "/day-restriction/:dayRestrictionId",
  userAuthentication.authMiddleware,
  dayRestrictionController.getDayRestriction
);

router.put(
  "/day-restriction",
  userAuthentication.authMiddleware,
  dayRestrictionController.putDayRestriction
);

router.delete(
  "/day-restriction",
  userAuthentication.authMiddleware,
  dayRestrictionController.deleteDayRestriction
);

export default router;
