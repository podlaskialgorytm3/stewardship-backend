import { WorkScheduleModal } from "../../models/work-schedule";

import { WorkScheduleSchema } from "../../types/work-schedule";

import { v4 as uuidv4 } from "uuid";

class SingleDay {
  month: number;
  year: number;
  constructor() {
    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
  }
  public createSchedule = async ({
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
  public updateSingleDay = async ({
    workScheduleId,
    isWorkingDay,
    day,
    start,
    end,
  }: {
    workScheduleId: string;
    isWorkingDay: boolean;
    day: number;
    start: string;
    end: string;
  }) => {
    try {
      await WorkScheduleModal.update(
        {
          isWorkingDay,
          start: isWorkingDay ? start : null,
          end: isWorkingDay ? end : null,
        },
        {
          where: {
            id: workScheduleId,
          },
        }
      );
      return {
        type: "success",
        message: "Work Schedule has been updated successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while updating the Work Schedule: " + error,
      };
    }
  };
}

export { SingleDay };
