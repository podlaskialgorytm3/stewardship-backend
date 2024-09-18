import express from "express";
import UserAuthentication from "../middlewares/auth";
import { ScheduleInformationController } from "../controllers/schedule-information";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const scheduleInformationController = new ScheduleInformationController();

router.get(
  "/scheudule-information",
  userAuthentication.authMiddleware,
  scheduleInformationController.getScheduleInfomationByGroupId
);

router.get(
  "/scheudule-information/position",
  userAuthentication.authMiddleware,
  scheduleInformationController.getScheduleInformationByPosition
);

export default router;
