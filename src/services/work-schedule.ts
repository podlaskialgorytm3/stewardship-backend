import { WorkScheduleModal } from "../models/work-schedule";

import { WorkScheduleSchema } from "../types/work-schedule";

import GroupUserService from "./group-user";

import { v4 as uuidv4 } from "uuid";

class WorkScheduleService {
  groupUserService: GroupUserService;
  constructor() {
    this.groupUserService = new GroupUserService();
  }
  public createTable = async () => {
    WorkScheduleModal.sync({ alter: true })
      .then(() => {
        console.log("Working Schedule table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the Working Schedule table:",
          error
        );
      });
  };
  public createWorkSchedule = async ({
    groupId,
    groupUserId,
    year,
    month,
    day,
    isWorkingDay,
    start,
    end,
    token,
  }: {
    groupId: string;
    groupUserId: string;
    year: number;
    month: number;
    day: number;
    isWorkingDay: boolean;
    start: string;
    end: string;
    token: string;
  }) => {
    try {
      const role = (await this.groupUserService.getRole({
        groupId,
        token,
      })) as string;
      if (role !== "admin") {
        return {
          type: "error",
          message: "You are not authorized to perform this action",
        };
      }
      const { error } = WorkScheduleSchema.validate({
        groupUserId,
        year,
        month,
        day,
        isWorkingDay,
        start,
        end,
      });
      if (error) {
        return {
          type: "error",
          message: error.details[0].message,
        };
      }
      const id = uuidv4();
      await WorkScheduleModal.create({
        id,
        groupUserId,
        year,
        month,
        day,
        isWorkingDay,
        start,
        end,
      });
      return {
        type: "success",
        message: "Work Schedule created successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating the Work Schedule: " + error,
      };
    }
  };
}

export { WorkScheduleService };
