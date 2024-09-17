import express from "express";
import UserAuthentication from "../middlewares/auth";
import { WorkScheduleController } from "../controllers/work-schedule";

const workScheduleController = new WorkScheduleController();
const userAuthentication = new UserAuthentication();
const router = express.Router();

router.post(
  "/work-schedule",
  userAuthentication.authMiddleware,
  workScheduleController.postWorkSchedule
);

router.get(
  "/work-schedule/days",
  userAuthentication.authMiddleware,
  workScheduleController.getDaysForMonth
);

router.get(
  "/work-schedule",
  userAuthentication.authMiddleware,
  workScheduleController.getWorkSchedule
);

export default router;
