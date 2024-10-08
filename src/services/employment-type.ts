import { EmploymentTypeModal } from "../models/employment-type";

import GroupUserService from "./group-user";

import {
  EmploymentTypeSchema,
  EmploymentTypeInterface,
} from "../types/employment-type";

import { v4 as uuidv4 } from "uuid";

class EmploymentTypeService {
  groupUserService: GroupUserService;
  constructor() {
    this.groupUserService = new GroupUserService();
  }
  public createTable = async () => {
    EmploymentTypeModal.sync({ alter: true })
      .then(() => {
        console.log("EmploymentType table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the EmploymentType table:",
          error
        );
      });
  };
  public createEmploymentType = async ({
    groupId,
    employmentName,
    workingHours,
    token,
  }: {
    groupId: string;
    employmentName: string;
    workingHours: number;
    token: string;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          type: "error",
          message: "You must be an admin to create an employment type",
        };
      }
      const { error } = EmploymentTypeSchema.validate({
        groupId,
        employmentName,
        workingHours,
      });
      if (error) {
        return {
          type: "error",
          message: error.message,
        };
      }
      const id = uuidv4();
      await EmploymentTypeModal.create({
        id,
        groupId,
        employmentName,
        workingHours,
      });
      return {
        type: "success",
        message: "Employment type created successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating employment type: " + error,
      };
    }
  };
  public getEmploymentTypes = async ({ groupId }: { groupId: string }) => {
    try {
      const employmentTypes = await EmploymentTypeModal.findAll({
        where: {
          groupId,
        },
      });
      const employmentTypesArray = await Promise.all(
        employmentTypes.map(async (employmentType) => {
          return {
            id: employmentType.id,
            employmentName: employmentType.employmentName,
            workingHours: employmentType.workingHours,
          };
        })
      );
      return employmentTypesArray;
    } catch (error) {
      return null;
    }
  };
  public getEmploymentType = async ({
    employmentTypeId,
  }: {
    employmentTypeId: string;
  }) => {
    try {
      const employmentType = await EmploymentTypeModal.findOne({
        where: {
          id: employmentTypeId,
        },
      });
      if (!employmentType) {
        return null;
      }
      const employmentTypeObject = {
        id: employmentType.id,
        employmentName: employmentType.employmentName,
        workingHours: employmentType.workingHours,
      };
      return employmentTypeObject;
    } catch (error) {
      return null;
    }
  };
  public updateEmploymentType = async ({
    groupId,
    employmentTypeId,
    employmentName,
    workingHours,
    token,
  }: EmploymentTypeInterface & {
    groupId: string;
    token: string;
    employmentTypeId: string;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          type: "error",
          message: "You must be an admin to update an employment type",
        };
      }
      const { error } = EmploymentTypeSchema.validate({
        groupId,
        employmentName,
        workingHours,
      });
      if (error) {
        return {
          type: "error",
          message: error.message,
        };
      }
      if (!employmentTypeId) {
        return {
          type: "error",
          message: "Employment type ID is required",
        };
      }
      await EmploymentTypeModal.update(
        {
          employmentName,
          workingHours,
        },
        {
          where: {
            id: employmentTypeId,
          },
        }
      );
      return {
        type: "success",
        message: "Employment type updated successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while updating employment type: " + error,
      };
    }
  };
  public deleteEmploymentType = async ({
    groupId,
    employmentTypeId,
    token,
  }: {
    groupId: string;
    employmentTypeId: string;
    token: string;
  }) => {
    try {
      const role = await this.groupUserService.getRole({ groupId, token });
      if (role !== "admin") {
        return {
          type: "error",
          message: "You must be an admin to delete an employment type",
        };
      }
      if (!employmentTypeId) {
        return {
          type: "error",
          message: "Employment type ID is required",
        };
      }
      await EmploymentTypeModal.destroy({
        where: {
          id: employmentTypeId,
        },
      });
      return {
        type: "success",
        message: "Employment type deleted successfully",
      };
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while deleting employment type: " + error,
      };
    }
  };
}

export { EmploymentTypeService };
