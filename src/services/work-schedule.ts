import { WorkScheduleModal } from "../models/work-schedule";

import { WorkScheduleSchema } from "../types/work-schedule";

import GroupUserService from "./group-user";

import { v4 as uuidv4 } from "uuid";

class WorkScheduleService {
  groupUserService: GroupUserService;
  month: number;
  year: number;
  monthDays: { [key: number]: number };
  constructor() {
    this.groupUserService = new GroupUserService();
    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
    this.monthDays = {
      1: 31,
      2: this.year % 4 === 0 ? 29 : 28,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };
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
  public createWorkScheduleForOneMonth = async ({
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
    day: string;
    isWorkingDay: string;
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
          message: "You are not authorized to perform this operation",
        };
      }
      const starts = start.split(",").map(Number);
      const ends = end.split(",").map(Number);
      const days = day.split(",");
      const workingDays = isWorkingDay.split(",");
      const quantityOfDays = days.length as number;
      if (
        starts.length !== quantityOfDays ||
        ends.length !== quantityOfDays ||
        workingDays.length !== quantityOfDays
      ) {
        return {
          type: "error",
          message: "You don't have enough data.",
        };
      }
      if (this.isDayOffMonth({ days, month, quantityOfDays })) {
        return {
          type: "error",
          message: "The days are not valid",
        };
      }
      for (let i = 0; i < quantityOfDays; i++) {
        await this.createWorkSchedule({
          groupUserId,
          year,
          month,
          day: Number(days[i]),
          isWorkingDay: workingDays[i] === "true",
          start: starts[i].toString(),
          end: ends[i].toString(),
        });
      }
      return {
        type: "success",
        message: "Work Schedule has been created successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating the Work Schedule: " + error,
      };
    }
  };
  private createWorkSchedule = async ({
    groupUserId,
    year,
    month,
    day,
    isWorkingDay,
    start,
    end,
  }: {
    groupUserId: string;
    year: number;
    month: number;
    day: number;
    isWorkingDay: boolean;
    start: string;
    end: string;
  }) => {
    try {
      const { error } = WorkScheduleSchema.validate({
        groupUserId,
        day,
        isWorkingDay,
        start,
        end,
      });
      if (error) {
        return {
          type: "error",
          message: "Validation Error: " + error.details[0].message,
        };
      }
      const id = uuidv4();
      await WorkScheduleModal.create({
        id,
        groupUserId,
        year: year || this.year,
        month: month || this.month,
        day,
        isWorkingDay,
        start,
        end,
      });
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating the Work Schedule: " + error,
      };
    }
  };
  private isDayOffMonth = ({
    days,
    month,
    quantityOfDays,
  }: {
    days: string[];
    month: number;
    quantityOfDays: number;
  }) => {
    try {
      for (let i = 0; i < quantityOfDays; i++) {
        const dayNumber = parseInt(days[i]);
        if (dayNumber < 1 || dayNumber > this.monthDays[month]) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while validating the days: " + error,
      };
    }
  };
}

export { WorkScheduleService };
