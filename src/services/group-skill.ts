import { GroupSkillModal } from "../models/group-skill";
import { SkillModal } from "../models/skill";
import GroupUserService from "./group-user";

import { v4 as uuidv4 } from "uuid";

class GroupSkillService {
  private groupUserService: GroupUserService;
  constructor() {
    this.groupUserService = new GroupUserService();
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
}

export { GroupSkillService };
