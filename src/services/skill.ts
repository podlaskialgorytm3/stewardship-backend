import { SkillModal } from "../models/skill";
import { GroupSkillModal } from "../models/group-skill";

import GroupUserService from "./group-user";

import { v4 as uuidv4 } from "uuid";

import { SkillInterface } from "../types/skill";

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
  public getSkills = async ({ groupId }: { groupId: string }) => {
    try {
      const skills = await SkillModal.findAll({
        where: {
          groupId,
        },
      });
      if (skills.length === 0) {
        return [];
      }
      return skills.map((skill) => {
        return {
          id: skill.id,
          groupId: skill.groupId,
          skillName: skill.skillName,
          isRemote: skill.isRemote,
        };
      });
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while getting the skills: " + error,
      };
    }
  };
  public deleteSkill = async ({
    skillId,
    groupId,
    token,
  }: {
    skillId: string;
    groupId: string;
    token: string;
  }) => {
    const role = (await this.groupUserService.getRole({
      groupId,
      token,
    })) as string;
    if (role !== "admin") {
      return {
        type: "info",
        message: "You are not authorized to delete a skill",
      };
    } else {
      try {
        const skill = await SkillModal.findOne({
          where: {
            id: skillId,
            groupId,
          },
        });
        await GroupSkillModal.destroy({
          where: {
            skillId,
          },
        });
        if (!skill) {
          return {
            type: "info",
            message: "Skill not found",
          };
        } else {
          await skill.destroy();
          return {
            type: "success",
            message: "Skill deleted successfully",
          };
        }
      } catch (error) {
        return {
          type: "error",
          message: "An error occurred while deleting the skill: " + error,
        };
      }
    }
  };
  public getSkillById = async ({ skillId }: { skillId: string }) => {
    try {
      const skill = (await SkillModal.findOne({
        where: {
          id: skillId,
        },
      })) as SkillInterface;
      return {
        id: skill.id,
        groupId: skill.groupId,
        skillName: skill.skillName,
        isRemote: skill.isRemote,
      };
    } catch (error) {
      return null;
    }
  };
}

export { SkillService };
