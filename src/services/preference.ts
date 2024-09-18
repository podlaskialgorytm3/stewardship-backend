import { PreferenceModal } from "../models/preference";
import GroupUserModal from "../models/group-user";

import GroupUserService from "./group-user";

import { PreferenceSchema } from "../types/preference";

import { v4 as uuidv4 } from "uuid";

class PreferenceService {
  groupUserService: GroupUserService;
  month: number;
  year: number;
  constructor() {
    this.groupUserService = new GroupUserService();
    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
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
      if (
        !(await this.isPreferenceNotExist({
          groupUserId: groupUser.id,
          month: this.month,
          year: this.year,
        }))
      ) {
        return {
          type: "info",
          message: "Preference for this month already exist, please update it",
        };
      }
      if (groupUser.id === null) {
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
        month: this.month,
        year: this.year,
        groupUserId: groupUser.id,
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
  private isPreferenceNotExist = async ({
    groupUserId,
    month,
    year,
  }: {
    groupUserId: string;
    month: number;
    year: number;
  }) => {
    try {
      const preferences = await PreferenceModal.findAll({
        where: {
          groupUserId,
          month,
          year,
        },
      });
      if (preferences.length > 0) {
        return false;
      }
      return true;
    } catch (error) {
      return {
        type: "error",
        message:
          "An error occurred while checking if the preference is single: " +
          error,
      };
    }
  };
  public getPreferences = async ({
    groupId,
    token,
    month,
    year,
  }: {
    groupId: string;
    token: string;
    month: number;
    year: number;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          type: "error",
          message: "You don't have permission to get the preferences",
        };
      }
      const groupUser = await GroupUserModal.findAll({
        where: {
          groupId,
        },
      });
      const groupUserIds = groupUser.map((user) => user.id);
      const preferences = await PreferenceModal.findAll({
        where: {
          groupUserId: groupUserIds,
          month,
          year,
        },
      });
      const preferncesArray = preferences.map((preference) => {
        return {
          id: preference.id,
          month: preference.month,
          year: preference.year,
          shiftId: preference.shiftId,
          preferedDays: preference.preferedDays,
          employmentTypeId: preference.employmentTypeId,
        };
      });
      return preferncesArray;
    } catch (error) {
      return null;
    }
  };
  public getPreference = async ({
    groupId,
    groupUserId,
    token,
    month,
    year,
  }: {
    groupId: string;
    groupUserId: string;
    token: string;
    month: number;
    year: number;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin" && role !== "user") {
        return {
          type: "error",
          message: "You don't have permission to get the preferences",
        };
      }
      const preferences = await PreferenceModal.findAll({
        where: {
          groupUserId,
          month,
          year,
        },
      });
      const preferncesArray = preferences.map((preference) => {
        return {
          id: preference.id,
          month: preference.month,
          year: preference.year,
          shiftId: preference.shiftId,
          preferedDays: preference.preferedDays,
          employmentTypeId: preference.employmentTypeId,
        };
      });
      return preferncesArray[0];
    } catch (error) {
      return null;
    }
  };
  public updatePreference = async ({
    groupId,
    preferenceId,
    shiftId,
    preferedDays,
    employmentTypeId,
    token,
  }: {
    groupId: string;
    preferenceId: string;
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
      const groupUserId = await this.getGroupUserIdByPreferenceId({
        preferenceId,
      });
      if (groupUser.id !== groupUserId) {
        return {
          type: "error",
          message: "You don't have permission to update this preference",
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
      await PreferenceModal.update(
        {
          shiftId,
          preferedDays,
          employmentTypeId,
        },
        {
          where: {
            id: preferenceId,
          },
        }
      );
      return {
        type: "success",
        message: "Preference updated successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while updating the preference: " + error,
      };
    }
  };
  private getGroupUserIdByPreferenceId = async ({
    preferenceId,
  }: {
    preferenceId: string;
  }) => {
    try {
      const preference = await PreferenceModal.findOne({
        where: {
          id: preferenceId,
        },
      });
      return preference?.groupUserId;
    } catch (error) {
      return {
        type: "error",
        message:
          "An error occurred while getting the group user id by preference id: " +
          error,
      };
    }
  };
  public deletePreference = async ({
    groupId,
    preferenceId,
    token,
  }: {
    groupId: string;
    preferenceId: string;
    token: string;
  }) => {
    try {
      const groupUser = (await this.groupUserService.getUserByTokenGroup(
        token,
        groupId
      )) as { id: string };
      const groupUserId = await this.getGroupUserIdByPreferenceId({
        preferenceId,
      });
      if (groupUser.id !== groupUserId) {
        return {
          type: "error",
          message: "You don't have permission to delete this preference",
        };
      }
      await PreferenceModal.destroy({
        where: {
          id: preferenceId,
        },
      });
      return {
        type: "success",
        message: "Preference deleted successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while deleting the preference: " + error,
      };
    }
  };
}

export { PreferenceService };
