import express from "express";
import UserAuthentication from "../middlewares/auth";
import { ScheduleRuleController } from "../controllers/schedule-rule";

const userAuthentication = new UserAuthentication();
const router = express.Router();
const scheduleRuleController = new ScheduleRuleController();

router.post(
  "/schedule-rule",
  userAuthentication.authMiddleware,
  scheduleRuleController.postScheduleRule
);

router.get(
  "/schedule-rule",
  userAuthentication.authMiddleware,
  scheduleRuleController.getScheduleRules
);

router.get(
  "/schedule-rule/:scheduleRuleId",
  userAuthentication.authMiddleware,
  scheduleRuleController.getScheduleRuleById
);

router.put(
  "/schedule-rule/:scheduleRuleId",
  userAuthentication.authMiddleware,
  scheduleRuleController.putScheduleRule
);

export default router;
