import express from "express";
import { Request, Response } from "express";
import UserAuthentication from "../middlewares/auth";

import DashboardController from "../controllers/dashboard";

const router = express.Router();
const userAuthentication = new UserAuthentication();

router.get(
  "/dashboard/groups",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const dashboardController = new DashboardController({ token });
      const result = await dashboardController.getGroupsToUserDashboard();
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.get(
  "/dashboard/tasks",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const dashboardController = new DashboardController({ token });
      const result = await dashboardController.getTasksToUserDashboard();
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

export default router;
