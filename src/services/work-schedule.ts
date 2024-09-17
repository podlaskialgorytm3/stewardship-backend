import { WorkScheduleModal } from "../models/work-schedule";
import GroupUserModal from "../models/group-user";
import UserModal from "../models/user";

import GroupUserService from "./group-user";
import { WorkScheduleValidate } from "./work-schedule/work-schedule-validate";
import { SingleDay } from "./work-schedule/single-day";

class WorkScheduleService {
  groupUserService: GroupUserService;
  workScheduleValidate: WorkScheduleValidate;
  singleDay: SingleDay;
  month: number;
  year: number;
  constructor() {
    this.groupUserService = new GroupUserService();
    this.workScheduleValidate = new WorkScheduleValidate();
    this.singleDay = new SingleDay();
    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
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
      if (
        this.workScheduleValidate.isDayOffMonth({ days, month, quantityOfDays })
      ) {
        return {
          type: "error",
          message: "The days are not valid",
        };
      }
      if (
        await this.workScheduleValidate.isDayUsed({
          groupUserId,
          days,
          month,
          year,
        })
      ) {
        return {
          type: "error",
          message: "The days are already used",
        };
      }
      if (this.workScheduleValidate.checkIfDaysAreSame({ days })) {
        return {
          type: "error",
          message: "The days are the same",
        };
      }
      for (let i = 0; i < quantityOfDays; i++) {
        await this.singleDay.createSchedule({
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
  public getDaysForMonth = async ({ month }: { month: number }) => {
    try {
      if (month < 1 || month > 12) {
        return {
          type: "error",
          message: "The month is not valid",
          days: 0,
        };
      }
      return {
        type: "success",
        message: "The days for the month have been retrieved successfully",
        days: this.workScheduleValidate.monthDays[month || this.month],
      };
    } catch (error) {
      return {
        type: "error",
        message:
          "An error occurred while getting the days for the month: " + error,
        days: 0,
      };
    }
  };
  public getWorkScheduleForMembersGroup = async ({
    groupId,
    month,
    year,
    token,
  }: {
    groupId: string;
    month: number;
    year: number;
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
          schedule: null,
        };
      }
      const groupUsers = await GroupUserModal.findAll({
        where: {
          groupId,
        },
      });
      const groupUserIds = groupUsers.map((groupUser) => groupUser.id);
      const schedules = await WorkScheduleModal.findAll({
        where: {
          groupUserId: groupUserIds,
          month,
          year,
        },
        order: [["day", "ASC"]],
      });
      const workSchedule = schedules.reduce(
        (
          acc: {
            groupUserId: string;
            name: string;
            img: string;
            year: number;
            month: number;
            schedule: {
              id: string;
              isWorkingDay: boolean;
              day: number;
              start: string | null;
              end: string | null;
            }[];
          }[],
          schedule: {
            id: string;
            groupUserId: string;
            year: number;
            month: number;
            day: number;
            isWorkingDay: boolean;
            start: string | null;
            end: string | null;
          }
        ) => {
          const {
            id,
            groupUserId,
            year,
            month,
            isWorkingDay,
            day,
            start,
            end,
          } = schedule;
          let existingEntry = acc.find(
            (entry) =>
              entry.groupUserId === groupUserId &&
              entry.year === year &&
              entry.month === month
          );
          if (!existingEntry) {
            existingEntry = {
              groupUserId,
              name: "",
              img: "",
              year,
              month,
              schedule: [],
            };
            acc.push(existingEntry);
          }
          existingEntry.schedule.push({
            id,
            isWorkingDay,
            day,
            start: isWorkingDay ? start : null,
            end: isWorkingDay ? end : null,
          });

          return acc;
        },
        []
      );
      const scheduleWithNames = await Promise.all(
        workSchedule.map(async (schedule) => {
          const groupUser = (await this.groupUserService.getUserByGroupUserId(
            schedule.groupUserId
          )) as { name: string; img: string };
          return {
            ...schedule,
            name: groupUser.name,
            img: groupUser.img,
          };
        })
      );
      return scheduleWithNames;
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while getting the work schedule: " + error,
        schedule: null,
      };
    }
  };
  public getWorkScheduleForOneUser = async ({
    month,
    year,
    token,
  }: {
    month: number;
    year: number;
    token: string;
  }) => {
    try {
      const user = await UserModal.findOne({
        where: {
          accessToken: token,
        },
      });
      const userId = user?.id;
      const groupUser = await GroupUserModal.findAll({
        where: {
          userId,
        },
      });
      const groupUserId = groupUser.map((groupUser) => groupUser.id);

      const schedules = await WorkScheduleModal.findAll({
        where: {
          groupUserId,
          month: Number(month),
          year: Number(year),
        },
        order: [["day", "ASC"]],
      });

      const formattedSchedules = await Promise.all(
        groupUserId.map(async (id) => ({
          groupUserId: id,
          groupName: await this.groupUserService.getGroupNameByGroupUserId({
            groupUserId: id,
          }),
          month,
          year,
          schedule: schedules
            .filter((schedule) => schedule.groupUserId === id)
            .map((schedule) => ({
              isWorkingDay: schedule.isWorkingDay,
              day: schedule.day,
              start: schedule.isWorkingDay ? schedule.start : null,
              end: schedule.isWorkingDay ? schedule.end : null,
            })),
        }))
      );
      return formattedSchedules.filter(
        (schedule) => schedule.schedule.length > 0
      );
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while getting the work schedule: " + error,
        schedule: null,
      };
    }
  };
}

export { WorkScheduleService };
