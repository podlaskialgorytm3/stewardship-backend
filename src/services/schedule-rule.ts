import { ScheduleRuleModal } from "../models/schedule-rule";
import GroupUserModal from "../models/group-user";

import GroupUserService from "./group-user";

import {
  ScheduleRuleSchema,
  ScheduleRuleInterface,
} from "../types/schedule-rule";

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
  public getScheduleRules = async ({
    groupId,
    token,
  }: {
    groupId: string;
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
          message: "You are not authorized to get schedule rules",
        };
      }
      const scheduleRules = await ScheduleRuleModal.findAll({
        where: {
          groupId,
        },
      });
      const scheduleRuleArray = scheduleRules.map(
        (scheduleRule: ScheduleRuleInterface) => {
          return {
            id: scheduleRule.id,
            scheduleRuleName: scheduleRule.scheduleRuleName,
            maxDailyHours: scheduleRule.maxDailyHours,
            maxWeeklyHours: scheduleRule.maxWeeklyHours,
            minRestBeetwenShifts: scheduleRule.minRestBeetwenShifts,
            minWeeklyRest: scheduleRule.minWeeklyRest,
          };
        }
      );
      return scheduleRuleArray;
    } catch (error) {
      return {
        message: "An error occurred while getting schedule rules: " + error,
        type: "error",
      };
    }
  };
  public getScheduleRuleById = async ({
    scheduleRuleId,
  }: {
    scheduleRuleId: string;
  }) => {
    try {
      const scheduleRule = await ScheduleRuleModal.findOne({
        where: {
          id: scheduleRuleId,
        },
      });
      const scheduleRuleObject = scheduleRule?.get() as ScheduleRuleInterface;
      return {
        id: scheduleRuleObject.id,
        scheduleRuleName: scheduleRuleObject.scheduleRuleName,
        maxDailyHours: scheduleRuleObject.maxDailyHours,
        maxWeeklyHours: scheduleRuleObject.maxWeeklyHours,
        minRestBeetwenShifts: scheduleRuleObject.minRestBeetwenShifts,
        minWeeklyRest: scheduleRuleObject.minWeeklyRest,
      };
    } catch (error) {
      return {
        message:
          "An error occurred while getting schedule rule by id: " + error,
        type: "error",
      };
    }
  };
  public updateScheduleRule = async ({
    groupId,
    scheduleRuleId,
    scheduleRuleName,
    maxDailyHours,
    maxWeeklyHours,
    minRestBeetwenShifts,
    minWeeklyRest,
    token,
  }: {
    groupId: string;
    scheduleRuleId: string;
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
          message: "You are not authorized to update a schedule rule",
        };
      } else {
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
        }
        const scheduleRule = await ScheduleRuleModal.findOne({
          where: {
            id: scheduleRuleId,
          },
        });
        if (!scheduleRule) {
          return {
            type: "info",
            message: "Schedule rule not found",
          };
        }
        await ScheduleRuleModal.update(
          {
            scheduleRuleName,
            maxDailyHours,
            maxWeeklyHours,
            minRestBeetwenShifts,
            minWeeklyRest,
          },
          {
            where: {
              id: scheduleRuleId,
            },
          }
        );
        return {
          type: "success",
          message: "Schedule rule updated successfully",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while updating schedule rule: " + error,
        type: "error",
      };
    }
  };

  public deleteScheduleRule = async ({
    scheduleRuleId,
    groupId,
    token,
  }: {
    scheduleRuleId: string;
    groupId: string;
    token: string;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          type: "info",
          message: "You are not authorized to delete a schedule rule",
        };
      }
      await ScheduleRuleModal.destroy({
        where: {
          id: scheduleRuleId,
        },
      });
      await GroupUserModal.update(
        {
          scheduleRuleId: "",
        },
        { where: { groupId } }
      );
      return {
        type: "success",
        message: "Schedule rule deleted successfully",
      };
    } catch (error) {
      return {
        message: "An error occurred while deleting schedule rule: " + error,
        type: "error",
      };
    }
  };
}

export { ScheduleRuleService };
