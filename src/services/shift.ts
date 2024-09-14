import { ShiftModal } from "../models/shift";

import { v4 as uuidv4 } from "uuid";

import { ShiftInterface, ShiftSchema } from "../types/shift";

import GroupUserSerivce from "./group-user";

class ShiftService {
  groupUserService: GroupUserSerivce;
  constructor() {
    this.groupUserService = new GroupUserSerivce();
  }
  public createTable = async () => {
    ShiftModal.sync({ alter: true })
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
  public createShift = async ({
    groupId,
    nameOfShift,
    startFrom,
    startTo,
    endFrom,
    endTo,
    minDailyHours,
    maxDailyHours,
    token,
  }: {
    groupId: string;
    nameOfShift: string;
    startFrom: string;
    startTo: string;
    endFrom: string;
    endTo: string;
    minDailyHours: number;
    maxDailyHours: number;
    token: string;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          message: "You are not authorized to create a shift",
          type: "error",
        };
      }
      const id = uuidv4();
      const { error } = ShiftSchema.validate({
        groupId,
        nameOfShift,
        startFrom,
        startTo,
        endFrom,
        endTo,
        minDailyHours,
        maxDailyHours,
      });
      if (error) {
        return {
          message: error.details[0].message,
          type: "error",
        };
      }
      await ShiftModal.create({
        id,
        groupId,
        nameOfShift,
        startFrom,
        startTo,
        endFrom,
        endTo,
        minDailyHours,
        maxDailyHours,
      });
      return {
        message: "Shift created successfully",
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while creating the shift: " + error,
        type: "error",
      };
    }
  };
  public getShifts = async ({ groupId }: { groupId: string }) => {
    try {
      const shifts = await ShiftModal.findAll({ where: { groupId } });
      const shiftsArray = shifts.map((shift: ShiftInterface) => {
        return {
          id: shift.id,
          groupId: shift.groupId,
          nameOfShift: shift.nameOfShift,
          startFrom: shift.startFrom,
          startTo: shift.startTo,
          endFrom: shift.endFrom,
          endTo: shift.endTo,
          minDailyHours: shift.minDailyHours,
          maxDailyHours: shift.maxDailyHours,
        };
      });
      return shiftsArray;
    } catch (error) {
      return {
        message: "An error occurred while fetching the shifts: " + error,
        type: "error",
      };
    }
  };
  public getShiftById = async ({ shiftId }: { shiftId: string }) => {
    try {
      const shift = await ShiftModal.findOne({ where: { id: shiftId } });
      if (shift) {
        return {
          id: shift.id,
          groupId: shift.groupId,
          nameOfShift: shift.nameOfShift,
          startFrom: shift.startFrom,
          startTo: shift.startTo,
          endFrom: shift.endFrom,
          endTo: shift.endTo,
          minDailyHours: shift.minDailyHours,
          maxDailyHours: shift.maxDailyHours,
        };
      } else {
        return {
          message: "Shift not found",
          type: "error",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while fetching the shift: " + error,
        type: "error",
      };
    }
  };
}

export { ShiftService };
