import { Response, Request } from "express";

import { DayRestrictionService } from "../services/day-restriction";

class DayRestrictionController {
  dayRestrictionService: DayRestrictionService;
  constructor() {
    this.dayRestrictionService = new DayRestrictionService();
  }
  public postDayRestriction = async (request: Request, response: Response) => {
    try {
      const { scheduleRuleId, dayOfWeek, maxFollowingDay, groupId } =
        request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await this.dayRestrictionService.createDayRestriction({
        scheduleRuleId: scheduleRuleId as string,
        dayOfWeek: dayOfWeek as string,
        maxFollowingDay: Number(maxFollowingDay) as number,
        groupId: groupId as string,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export { DayRestrictionController };
