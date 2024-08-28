import { Request, Response } from "express";

import DashboardService from "../services/dashboard";

class DashboardController {
  public getDashbaordGroups = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const dasboardService = new DashboardService({ token });
      const result = await dasboardService.getGroupsToUserDashboard();
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getDashbaordTasks = async (request: Request, response: Response) => {
    try {
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const dasboardService = new DashboardService({ token });
      const result = await dasboardService.getTasksToUserDashboard();
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export default DashboardController;
