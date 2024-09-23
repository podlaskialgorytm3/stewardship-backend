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
      } = request.body;
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

  public getScheduleRules = async (request: Request, response: Response) => {
    try {
      const groupId = request.query.groupId as string;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.scheduleRuleService.getScheduleRules({
        groupId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };

  public getScheduleRuleById = async (request: Request, response: Response) => {
    try {
      const scheduleRuleId = request.params.scheduleRuleId as string;
      const result = await this.scheduleRuleService.getScheduleRuleById({
        scheduleRuleId,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };

  public putScheduleRule = async (request: Request, response: Response) => {
    try {
      const scheduleRuleId = request.params.scheduleRuleId as string;
      const {
        groupId,
        scheduleRuleName,
        maxDailyHours,
        maxWeeklyHours,
        minRestBeetwenShifts,
        minWeeklyRest,
      } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.scheduleRuleService.updateScheduleRule({
        groupId: groupId as string,
        scheduleRuleId: scheduleRuleId as string,
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

  deleteScheduleRule = async (request: Request, response: Response) => {
    try {
      const scheduleRuleId = request.params.scheduleRuleId as string;
      const groupId = request.query.groupId as string;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.scheduleRuleService.deleteScheduleRule({
        scheduleRuleId,
        groupId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { ScheduleRuleController };
