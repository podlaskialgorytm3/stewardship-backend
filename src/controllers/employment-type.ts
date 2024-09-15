import { Request, Response } from "express";

import { EmploymentTypeService } from "../services/employment-type";

class EmploymentTypeController {
  employmentTypeService: EmploymentTypeService;
  constructor() {
    this.employmentTypeService = new EmploymentTypeService();
  }
  public postEmploymentType = async (request: Request, response: Response) => {
    try {
      const { groupId, employmentName, workingHours } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.employmentTypeService.createEmploymentType({
        groupId: groupId as string,
        employmentName: employmentName as string,
        workingHours: parseInt(workingHours as string),
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getEmploymentType = async (request: Request, response: Response) => {
    try {
      const { groupId } = request.query;
      const result = await this.employmentTypeService.getEmploymentTypes({
        groupId: groupId as string,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { EmploymentTypeController };
