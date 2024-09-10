import { SkillModal } from "../models/skill";

import GroupUserService from "./group-user";

import { v4 as uuidv4 } from "uuid";

class SkillService {
  groupUserService: GroupUserService;
  constructor() {
    this.groupUserService = new GroupUserService();
  }
  public createTable = async () => {
    SkillModal.sync({ alter: true })
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
  public createSkill = async ({
    skillName,
    isRemote,
    groupId,
    token,
  }: {
    skillName: string;
    isRemote: boolean;
    groupId: string;
    token: string;
  }) => {
    try {
      const id = uuidv4();
      const role = (await this.groupUserService.getRole({
        groupId,
        token,
      })) as string;
      if (role !== "admin") {
        return {
          type: "info",
          message: "You are not authorized to create a skill",
        };
      } else {
        if (!skillName) {
          return {
            type: "error",
            message: "Skill name is required",
          };
        } else {
          SkillModal.create({
            id: id,
            skillName,
            isRemote: isRemote || false,
            groupId,
          });
          return {
            type: "success",
            message: "Skill created successfully",
          };
        }
      }
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while creating the skill: " + error,
      };
    }
  };
}

export { SkillService };
