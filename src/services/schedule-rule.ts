import { ScheduleRuleModal } from "../models/schedule-rule";

import GroupUserService from "./group-user";

import { ScheduleRuleSchema } from "../types/schedule-rule";

import { v4 as uuidv4 } from "uuid";

class ScheduleRuleService {
  groupUserService: GroupUserService;
  constructor() {
    this.groupUserService = new GroupUserService();
  }
  public createTable = async () => {
    ScheduleRuleModal.sync({ alter: true })
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
  public createScheduleRule = async ({
    groupId,
    scheduleRuleName,
    maxDailyHours,
    maxWeeklyHours,
    minRestBeetwenShifts,
    minWeeklyRest,
    token,
  }: {
    groupId: string;
    scheduleRuleName: string;
    maxDailyHours: number;
    maxWeeklyHours: number;
    minRestBeetwenShifts: number;
    minWeeklyRest: number;
    token: string;
  }) => {
    try {
      const role = (await this.groupUserService.getRole({
        groupId,
        token,
      })) as string;
      if (role !== "admin") {
        return {
          type: "info",
          message: "You are not authorized to create a schedule rule",
        };
      } else {
        const id = uuidv4();
        const { error } = ScheduleRuleSchema.validate({
          groupId,
          scheduleRuleName,
          maxDailyHours,
          maxWeeklyHours,
          minRestBeetwenShifts,
          minWeeklyRest,
        });
        if (error) {
          return {
            type: "error",
            message: error.details[0].message,
          };
        } else {
          await ScheduleRuleModal.create({
            id,
            groupId,
            scheduleRuleName,
            maxDailyHours,
            maxWeeklyHours,
            minRestBeetwenShifts,
            minWeeklyRest,
          });
          return {
            type: "success",
            message: "Schedule rule created successfully",
          };
        }
      }
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating a schedule rule: " + error,
      };
    }
  };
}

export { ScheduleRuleService };
