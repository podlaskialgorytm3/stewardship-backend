import { PreferenceModal } from "../models/preference";

import GroupUserService from "./group-user";

import { PreferenceSchema } from "../types/preference";

import { v4 as uuidv4 } from "uuid";

class PreferenceService {
  groupUserService: GroupUserService;
  constructor() {
    this.groupUserService = new GroupUserService();
  }
  public createTable = async () => {
    PreferenceModal.sync({ alter: true })
      .then(() => {
        console.log("Preferences table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the Preferences table:",
          error
        );
      });
  };
  public createPreference = async ({
    groupId,
    shiftId,
    preferedDays,
    employmentTypeId,
    token,
  }: {
    groupId: string;
    shiftId: string;
    preferedDays: string;
    employmentTypeId: string;
    token: string;
  }) => {
    try {
      const groupUser = (await this.groupUserService.getUserByTokenGroup(
        token,
        groupId
      )) as { id: string };
      const groupUserId = groupUser.id;
      const month =
        new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
      const year =
        month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
      // in here will be written the logic to valid if preference in given mounth is single
      if (groupUserId) {
        return {
          type: "error",
          message: "This user not exist in this group",
        };
      }
      const { error } = PreferenceSchema.validate({
        shiftId,
        preferedDays,
        employmentTypeId,
      });
      if (error) {
        return {
          type: "error",
          message: error.details[0].message,
        };
      }
      await PreferenceModal.create({
        id: uuidv4(),
        month,
        year,
        groupUserId,
        shiftId,
        preferedDays,
        employmentTypeId,
      });
      return {
        type: "success",
        message: "Preference created successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating the preference: " + error,
      };
    }
  };
}

export { PreferenceService };
