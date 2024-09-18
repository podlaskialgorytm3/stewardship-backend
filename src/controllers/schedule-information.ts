import { Request, Response } from "express";

import { ScheduleInformationService } from "../services/schedule-information";

class ScheduleInformationController {
  scheudleInformationService: ScheduleInformationService;
  constructor() {
    this.scheudleInformationService = new ScheduleInformationService();
  }
  public getScheduleInfomationByGroupId = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { groupId, month, year } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result =
        await this.scheudleInformationService.getScheduleInfomationByGroupId({
          groupId: groupId as string,
          month: Number(month),
          year: Number(year),
          token: token as string,
        });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getScheduleInformationByPosition = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { groupId, position, month, year } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result =
        await this.scheudleInformationService.getScheduleInformationByPosition({
          groupId: groupId as string,
          position: position as string,
          month: Number(month),
          year: Number(year),
          token: token as string,
        });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { ScheduleInformationController };
