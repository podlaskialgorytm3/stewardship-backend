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
}

export { ShiftService };
