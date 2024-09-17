import { Request, Response } from "express";

import { WorkScheduleService } from "../services/work-schedule";

class WorkScheduleController {
  workScheduleService: WorkScheduleService;
  constructor() {
    this.workScheduleService = new WorkScheduleService();
  }
  public postWorkSchedule = async (request: Request, response: Response) => {
    try {
      const {
        groupId,
        groupUserId,
        year,
        month,
        day,
        isWorkingDay,
        start,
        end,
      } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1];
      const result =
        await this.workScheduleService.createWorkScheduleForOneMonth({
          groupId: groupId as string,
          groupUserId: groupUserId as string,
          year: Number(year),
          month: Number(month),
          day: day as string,
          isWorkingDay: isWorkingDay as string,
          start: start as string,
          end: end as string,
          token: token as string,
        });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { WorkScheduleController };
