import express from "express";
import UserAuthentication from "../middlewares/auth";
import { ScheduleInformationController } from "../controllers/schedule-information";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const scheduleInformationController = new ScheduleInformationController();

router.get(
  "/schedule-information",
  userAuthentication.authMiddleware,
  scheduleInformationController.getScheduleInfomationByGroupId
);

router.get(
  "/schedule-information/position",
  userAuthentication.authMiddleware,
  scheduleInformationController.getScheduleInformationByPosition
);

router.get(
  "/schedule-information/skill",
  userAuthentication.authMiddleware,
  scheduleInformationController.getScheduleInformationBySkill
);

router.get(
  "/schedule-information/user",
  userAuthentication.authMiddleware,
  scheduleInformationController.getScheduleInformationForUser
);

export default router;
