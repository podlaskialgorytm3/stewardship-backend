import { GroupSkillModal } from "../models/group-skill";
import { SkillModal } from "../models/skill";

import GroupUserService from "./group-user";
import { SkillService } from "./skill";

import { v4 as uuidv4 } from "uuid";

class GroupSkillService {
  private groupUserService: GroupUserService;
  private skillService: SkillService;
  constructor() {
    this.groupUserService = new GroupUserService();
    this.skillService = new SkillService();
  }
  public createTable = async () => {
    GroupSkillModal.sync({ alter: true })
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
  public addSkillToUser = async ({
    groupUserId,
    skillId,
    token,
  }: {
    groupUserId: string;
    skillId: string;
    token: string;
  }) => {
    try {
      const id = uuidv4();
      const groupId = (await this.groupUserService.getGroupIdByGroupUserId({
        groupUserId,
      } as { groupUserId: string })) as string;
      const role = (await this.groupUserService.getRole({
        groupId,
        token,
      })) as string;
      const isSkillExistForGroup = await this.isSkillExistForGroup({
        groupId,
        skillId,
      });
      if (!isSkillExistForGroup) {
        return {
          type: "error",
          message: "Skill does not exist for this group",
        };
      }
      if (role !== "admin") {
        return {
          type: "error",
          message: "You are not authorized to add skill to user",
        };
      } else {
        await GroupSkillModal.create({
          id,
          groupUserId,
          skillId,
        });
        return {
          type: "success",
          message: "Skill added to user successfully",
        };
      }
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while adding skill to user",
      };
    }
  };
  private isSkillExistForGroup = async ({
    groupId,
    skillId,
  }: {
    groupId: string;
    skillId: string;
  }) => {
    try {
      const skill = await SkillModal.findOne({
        where: {
          id: skillId,
          groupId,
        },
      });
      return skill ? true : false;
    } catch (error) {
      return false;
    }
  };
  public getBelongingSkills = async ({
    groupId,
    token,
  }: {
    groupId: string;
    token: string;
  }) => {
    try {
      const groupUser = (await this.groupUserService.getUserByTokenGroup(
        token,
        groupId
      )) as { id: string };
      const groupUserId = groupUser.id;
      const groupSkills = await GroupSkillModal.findAll({
        where: {
          groupUserId,
        },
        attributes: ["skillId"],
      });
      const skills = await Promise.all(
        groupSkills.map(async (groupSkill) => {
          return await this.skillService.getSkillById({
            skillId: groupSkill.skillId,
          });
        })
      );
      return skills;
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while getting skills",
      };
    }
  };
  public getNotBelongingSkills = async ({
    groupId,
    token,
  }: {
    groupId: string;
    token: string;
  }) => {
    try {
      const groupUser = (await this.groupUserService.getUserByTokenGroup(
        token,
        groupId
      )) as { id: string };
      const groupUserId = groupUser.id;
      const groupUserSkills = await GroupSkillModal.findAll({
        where: {
          groupUserId,
        },
        attributes: ["skillId"],
      });
      const groupUserSkillsId = groupUserSkills.map((skill) => skill.skillId);
      const groupSkills = await SkillModal.findAll({
        where: {
          groupId,
        },
        attributes: ["id"],
      });
      const groupSkillsId = groupSkills.map((skill) => skill.id);
      const notBelongingSkillsId = groupSkillsId.filter(
        (skillId) => !groupUserSkillsId.includes(skillId)
      );
      const notBelongingSkills = await Promise.all(
        notBelongingSkillsId.map(async (skillId) => {
          return await this.skillService.getSkillById({
            skillId,
          });
        })
      );
      return notBelongingSkills;
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while getting not belonging skills",
      };
    }
  };
  public deleteSkillFromUser = async ({
    skillId,
    groupUserId,
    token,
  }: {
    skillId: string;
    groupUserId: string;
    token: string;
  }) => {
    try {
      const groupId = (await this.groupUserService.getGroupIdByGroupUserId({
        groupUserId,
      } as { groupUserId: string })) as string;
      const role = (await this.groupUserService.getRole({
        groupId,
        token,
      })) as string;
      if (role !== "admin") {
        return {
          type: "error",
          message: "You are not authorized to delete skill from user",
        };
      } else {
        await GroupSkillModal.destroy({
          where: {
            skillId,
            groupUserId,
          },
        });
        return {
          type: "success",
          message: "Skill deleted from user successfully",
        };
      }
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while deleting skill from user",
      };
    }
  };
}

export { GroupSkillService };
