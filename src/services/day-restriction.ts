import { DayRestrictionModal } from "../models/day-restriction";

import { v4 as uuidv4 } from "uuid";

import {
  DayRestrictionSchema,
  DayRestrictionInterface,
  DayRestrictionUpdateSchema,
} from "../types/day-restriction";

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
      const dayRestrictions = await this.getDayRestrictions({ scheduleRuleId });
      const dayRestrictionExists = dayRestrictions?.find(
        (dayRestriction) =>
          dayRestriction.dayOfWeek === dayOfWeek &&
          dayRestriction.maxFollowingDay === maxFollowingDay
      );
      if (dayRestrictionExists) {
        return {
          message: "Day restriction already exists",
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
  public getDayRestrictions = async ({
    scheduleRuleId,
  }: {
    scheduleRuleId: string;
  }) => {
    try {
      const dayRestrictions = await DayRestrictionModal.findAll({
        where: {
          scheduleRuleId,
        },
      });
      const dayRestrictionArray = await Promise.all(
        dayRestrictions.map(async (dayRestriction) => {
          return {
            id: dayRestriction.id,
            scheduleRuleId: dayRestriction.scheduleRuleId,
            dayOfWeek: dayRestriction.dayOfWeek,
            maxFollowingDay: dayRestriction.maxFollowingDay,
          };
        })
      );
      return dayRestrictionArray;
    } catch (error) {
      return null;
    }
  };
  public getDayRestriction = async ({
    dayRestrictionId,
  }: {
    dayRestrictionId: string;
  }) => {
    try {
      const dayRestriction = (await DayRestrictionModal.findOne({
        where: {
          id: dayRestrictionId,
        },
      })) as DayRestrictionInterface;
      const dayRestrictionObject = {
        id: dayRestriction.id,
        scheduleRuleId: dayRestriction.scheduleRuleId,
        dayOfWeek: dayRestriction.dayOfWeek,
        maxFollowingDay: dayRestriction.maxFollowingDay,
      };
      return dayRestrictionObject;
    } catch (error) {
      return null;
    }
  };
  public updateDayRestriction = async ({
    groupId,
    dayRestrictionId,
    dayOfWeek,
    maxFollowingDay,
    token,
  }: {
    groupId: string;
    dayRestrictionId: string;
    dayOfWeek: string;
    maxFollowingDay: number;
    token: string;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          message: "You are not authorized to update a day restriction",
          type: "error",
        };
      }
      const { error } = DayRestrictionUpdateSchema.validate({
        dayOfWeek,
        maxFollowingDay,
      });
      if (error) {
        return {
          message: error.details[0].message,
          type: "error",
        };
      }
      await DayRestrictionModal.update(
        {
          dayOfWeek,
          maxFollowingDay,
        },
        {
          where: {
            id: dayRestrictionId,
          },
        }
      );
      return {
        type: "success",
        message: "Day restriction updated successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while updating day restriction: " + error,
      };
    }
  };
  public deleteDayRestriction = async ({
    groupId,
    dayRestrictionId,
    token,
  }: {
    groupId: string;
    dayRestrictionId: string;
    token: string;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          message: "You are not authorized to delete a day restriction",
          type: "error",
        };
      }
      await DayRestrictionModal.destroy({
        where: {
          id: dayRestrictionId,
        },
      });
      return {
        type: "success",
        message: "Day restriction deleted successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while deleting day restriction: " + error,
      };
    }
  };
}

export { DayRestrictionService };
