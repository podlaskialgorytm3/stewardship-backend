import { DayRestrictionModal } from "../models/day-restriction";

import { v4 as uuidv4 } from "uuid";

import { DayRestrictionSchema } from "../types/day-restriction";

import GroupUserService from "./group-user";

class DayRestrictionService {
  groupUserService: GroupUserService;
  constructor() {
    this.groupUserService = new GroupUserService();
  }
  public createTable = async () => {
    DayRestrictionModal.sync({ alter: true })
      .then(() => {
        console.log("Skill table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the Skill table:",
          error
        );
      });
  };
  public createDayRestriction = async ({
    scheduleRuleId,
    dayOfWeek,
    maxFollowingDay,
    groupId,
    token,
  }: {
    scheduleRuleId: string;
    dayOfWeek: string;
    maxFollowingDay: number;
    groupId: string;
    token: string;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          message: "You are not authorized to create a day restriction",
          type: "error",
        };
      }
      const id = uuidv4();
      const { error } = DayRestrictionSchema.validate({
        scheduleRuleId,
        dayOfWeek,
        maxFollowingDay,
      });
      if (error) {
        return {
          message: error.details[0].message,
          type: "error",
        };
      }
      await DayRestrictionModal.create({
        id,
        scheduleRuleId,
        dayOfWeek,
        maxFollowingDay,
      });
      return {
        type: "success",
        message: "Day restriction created successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating day restriction: " + error,
      };
    }
  };
}

export { DayRestrictionService };
