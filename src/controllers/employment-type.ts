import { Request, Response } from "express";

import { EmploymentTypeService } from "../services/employment-type";

class EmploymentTypeController {
  employmentTypeService: EmploymentTypeService;
  constructor() {
    this.employmentTypeService = new EmploymentTypeService();
  }
  public postEmploymentType = async (request: Request, response: Response) => {
    try {
      const { groupId, employmentName, workingHours } = request.body;
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
  public getEmploymentTypes = async (request: Request, response: Response) => {
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
  public getEmploymentType = async (request: Request, response: Response) => {
    try {
      const { employmentTypeId } = request.params;
      const result = await this.employmentTypeService.getEmploymentType({
        employmentTypeId: employmentTypeId as string,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putEmploymentType = async (request: Request, response: Response) => {
    try {
      const { groupId, employmentTypeId, employmentName, workingHours } =
        request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.employmentTypeService.updateEmploymentType({
        groupId: groupId as string,
        employmentTypeId: employmentTypeId as string,
        employmentName: employmentName as string,
        workingHours: parseInt(workingHours as string) as number,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public deleteEmploymentType = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { groupId, employmentTypeId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.employmentTypeService.deleteEmploymentType({
        groupId: groupId as string,
        employmentTypeId: employmentTypeId as string,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { EmploymentTypeController };
