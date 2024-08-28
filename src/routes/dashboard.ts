import express from "express";
import UserAuthentication from "../middlewares/auth";
import DashboardController from "../controllers/dashboard";

const router = express.Router();
const userAuthentication = new UserAuthentication();
const dashboardController = new DashboardController();

router.get(
  "/dashboard/groups",
  userAuthentication.authMiddleware,
  dashboardController.getDashbaordGroups
);

router.get(
  "/dashboard/tasks",
  userAuthentication.authMiddleware,
  dashboardController.getDashbaordTasks
);

export default router;
