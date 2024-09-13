import { Request, Response } from "express";

import { ScheduleRuleService } from "../services/schedule-rule";

class ScheduleRuleController {
  private scheduleRuleService: ScheduleRuleService;
  constructor() {
    this.scheduleRuleService = new ScheduleRuleService();
  }
  public postScheduleRule = async (request: Request, response: Response) => {
    try {
      const {
        groupId,
        scheduleRuleName,
        maxDailyHours,
        maxWeeklyHours,
        minRestBeetwenShifts,
        minWeeklyRest,
      } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.scheduleRuleService.createScheduleRule({
        groupId: groupId as string,
        scheduleRuleName: scheduleRuleName as string,
        maxDailyHours: Number(maxDailyHours) as number,
        maxWeeklyHours: Number(maxWeeklyHours) as number,
        minRestBeetwenShifts: Number(minRestBeetwenShifts) as number,
        minWeeklyRest: Number(minWeeklyRest) as number,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { ScheduleRuleController };
