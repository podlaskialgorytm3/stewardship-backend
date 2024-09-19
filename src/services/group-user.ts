import { v4 as uuidv4 } from "uuid";

import GroupUser from "../models/group-user";
import GroupUserRequest from "../models/group-user-request";
import TaskAffilation from "../models/task-affilation";
import User from "../models/user";
import Group from "../models/group";

class GroupUserService {
  public createTable = async () => {
    GroupUser.sync({ alter: true })
      .then(() => {
        console.log("GroupUser table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the GroupUser table:",
          error
        );
      });
  };
  public getRole = async ({
    groupId,
    token,
  }: {
    groupId: string;
    token: string;
  }) => {
    try {
      const member = (await this.getUserByTokenGroup(token, groupId)) as {
        role: string;
      };
      return member.role;
    } catch (error) {
      return null;
    }
  };
  public addUser = async (
    userId: string,
    role: string,
    groupId: string,
    addingPersonRole: string
  ) => {
    try {
      if (addingPersonRole !== "admin") {
        return {
          message: "You are not authorized to add the user",
          type: "error",
        };
      } else {
        const groupUser = await GroupUser.findOne({
          where: {
            groupId,
            userId,
          },
        });
        if (groupUser) {
          return {
            message: "User already exists in the group",
            type: "error",
          };
        } else {
          await GroupUser.create({
            id: uuidv4(),
            userId,
            groupId,
            role,
          });
          await GroupUserRequest.destroy({
            where: {
              userId,
              groupId,
            },
          });
          return {
            message: "User added successfully",
            type: "success",
          };
        }
      }
    } catch (error) {
      return {
        message: "An error occurred while adding the user: " + error,
        type: "error",
      };
    }
  };
  public getUser = async (groupId: string, userId: string) => {
    try {
      const groupUser = await GroupUser.findOne({
        where: {
          groupId,
          userId,
        },
      });
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      return {
        id: groupUser?.id as string,
        name: user?.name as string,
        email: user?.email as string,
        group: group?.name as string,
        img: user?.img as string,
        role: groupUser?.role as string,
      };
    } catch (error) {
      return error;
    }
  };
  public getUsers = async (groupId: string, name: string) => {
    try {
      const groupUsers = await GroupUser.findAll({
        where: {
          groupId,
        },
      });
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      const users = await Promise.all(
        groupUsers.map(async (groupUser) => {
          const user = await User.findOne({
            where: {
              id: groupUser.userId,
            },
          });
          return {
            id: groupUser?.id as string,
            userId: groupUser.userId as string,
            name: user?.name as string,
            group: group?.name as string,
            email: user?.email as string,
            img: user?.img as string,
            role: groupUser.role,
            position: groupUser.position as string,
          };
        })
      );
      return {
        message: "Users retrieved successfully",
        data: users.filter((user) => user.name.includes(name)),
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while getting the users: " + error,
        type: "error",
      };
    }
  };
  public getUsersByGroupId = async ({ groupId }: { groupId: string }) => {
    try {
      const groupUsers = await GroupUser.findAll({
        where: {
          groupId,
        },
      });
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      const users = await Promise.all(
        groupUsers.map(async (groupUser) => {
          const user = await User.findOne({
            where: {
              id: groupUser.userId,
            },
          });
          return {
            id: groupUser?.id as string,
            name: user?.name as string,
            position: groupUser?.position as string,
            scheduleRuleId: groupUser?.scheduleRuleId as string,
            group: group?.name as string,
            email: user?.email as string,
            img: user?.img as string,
            role: groupUser.role,
          };
        })
      );
      return users;
    } catch (error) {
      return null;
    }
  };
  public getUsersWithoutCreator = async (
    groupId: string,
    name: string,
    token: string
  ) => {
    try {
      const creatorUser = (await this.getUserByTokenGroup(token, groupId)) as {
        id: string;
      };
      const groupUsers = await GroupUser.findAll({
        where: {
          groupId,
        },
      });
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      const users = await Promise.all(
        groupUsers.map(async (groupUser) => {
          const user = await User.findOne({
            where: {
              id: groupUser.userId,
            },
          });
          return {
            id: groupUser?.id as string,
            userId: groupUser.userId as string,
            name: user?.name as string,
            group: group?.name as string,
            email: user?.email as string,
            img: user?.img as string,
            role: groupUser.role,
          };
        })
      );
      return {
        message: "Users retrieved successfully",
        data: users.filter(
          (user) => user.name.includes(name) && user.id !== creatorUser.id
        ),
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while getting the users: " + error,
        type: "error",
      };
    }
  };
  public getUserByGroupUserId = async (groupUserId: string) => {
    try {
      const groupUser = await GroupUser.findOne({
        where: {
          id: groupUserId,
        },
      });
      const user = await User.findOne({
        where: {
          id: groupUser?.userId,
        },
      });
      const group = await Group.findOne({
        where: {
          id: groupUser?.groupId,
        },
      });
      return {
        id: groupUser?.id as string,
        name: user?.name as string,
        email: user?.email as string,
        group: group?.name as string,
        img: user?.img as string,
        role: groupUser?.role as string,
      };
    } catch (error) {
      return (
        "An error occurred while getting the user by group user id: " + error
      );
    }
  };
  public getUserByToken = async (token: string) => {
    try {
      const user = await User.findOne({
        where: {
          accessToken: token,
        },
      });
      const groupUser = await GroupUser.findOne({
        where: {
          userId: user?.id,
        },
      });
      const group = await Group.findOne({
        where: {
          id: groupUser?.groupId,
        },
      });
      return {
        id: groupUser?.id as string,
        name: user?.name as string,
        email: user?.email as string,
        group: group?.name as string,
        img: user?.img as string,
        role: groupUser?.role as string,
      };
    } catch (error) {
      return error;
    }
  };
  public getUserByTokenGroup = async (token: string, groupId: string) => {
    try {
      const user = await User.findOne({
        where: {
          accessToken: token,
        },
      });
      const groupUser = await GroupUser.findOne({
        where: {
          userId: user?.id,
          groupId: groupId,
        },
      });
      const group = await Group.findOne({
        where: {
          id: groupUser?.groupId,
        },
      });
      return {
        id: groupUser?.id as string,
        name: user?.name as string,
        email: user?.email as string,
        group: group?.name as string,
        img: user?.img as string,
        role: groupUser?.role as string,
      };
    } catch (error) {
      return error;
    }
  };
  public deleteGroupUsers = async (groupId: string) => {
    try {
      await GroupUser.destroy({
        where: {
          groupId,
        },
      });
      return "Group users deleted successfully";
    } catch (error) {
      return error;
    }
  };
  public deleteGroupUser = async (
    groupUserId: string,
    role: string,
    groupId: string
  ) => {
    try {
      const quantityOfUsers = await this.getQuantityOfUsers(groupId);
      if (quantityOfUsers === 1) {
        return {
          message: "You cannot delete the last user",
          type: "error",
        };
      }
      if (role !== "admin") {
        return {
          message: "You are not authorized to delete the user",
          type: "error",
        };
      } else {
        await TaskAffilation.destroy({
          where: {
            groupUserId,
          },
        });
        await GroupUser.destroy({
          where: {
            id: groupUserId,
          },
        });
        return {
          message: "User deleted successfully",
          type: "success",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while deleting the user: " + error,
        type: "error",
      };
    }
  };
  private getQuantityOfAdmins = async (groupId: string) => {
    try {
      const groupUsers = await GroupUser.findAll({
        where: {
          groupId: groupId,
          role: "admin",
        },
      });
      return groupUsers.length;
    } catch (error) {
      return error;
    }
  };
  private getQuantityOfUsers = async (groupId: string) => {
    try {
      const groupUsers = await GroupUser.findAll({
        where: {
          groupId: groupId,
        },
      });
      return groupUsers.length;
    } catch (error) {
      return error;
    }
  };
  public changeRole = async (
    groupId: string,
    userId: string,
    changingPersonRole: string
  ) => {
    try {
      const groupUser = (await this.getUser(groupId, userId)) as {
        role: string;
      };
      const quantityOfAdmins = await this.getQuantityOfAdmins(groupId);
      const role = groupUser?.role === "admin" ? "member" : "admin";
      if (quantityOfAdmins === 1 && groupUser?.role === "admin") {
        return {
          message: "You cannot change the role of the last admin",
          type: "error",
        };
      } else if (changingPersonRole !== "admin") {
        return {
          message: "You are not authorized to change the role",
          type: "error",
        };
      } else {
        await GroupUser.update(
          {
            role,
          },
          {
            where: {
              groupId,
              userId,
            },
          }
        );
        return {
          message: "Role changed successfully",
          type: "success",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while changing the role: " + error,
        type: "error",
      };
    }
  };
  public isMemberOfGroup = async (groupId: string, userId: string) => {
    try {
      const groupUser = await GroupUser.findOne({
        where: {
          groupId,
          userId,
        },
      });
      if (groupUser) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  public isAdminOfGroup = async ({
    groupId,
    token,
  }: {
    groupId: string;
    token: string;
  }) => {
    try {
      const user = await User.findOne({
        where: {
          accessToken: token,
        },
      });
      const groupUser = await GroupUser.findOne({
        where: {
          userId: user?.id,
          groupId: groupId,
        },
      });
      return groupUser?.role === "admin";
    } catch (error) {
      return {
        message:
          "An error occurred while checking if user is admin of group: " +
          error,
        type: "error",
      };
    }
  };
  public updatePosition = async ({
    position,
    groupUserId,
    token,
  }: {
    position: string;
    groupUserId: string;
    token: string;
  }) => {
    try {
      const groupId = await this.getGroupIdByGroupUserId({ groupUserId });
      const changer = (await this.getUserByTokenGroup(
        token,
        groupId as string
      )) as { role: string };
      if (changer.role !== "admin") {
        return {
          message: "You are not authorized to update the position",
          type: "error",
        };
      } else {
        await GroupUser.update(
          {
            position,
          },
          {
            where: {
              id: groupUserId,
            },
          }
        );
        return {
          message: "Position updated successfully",
          type: "success",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while updating the position: " + error,
        type: "error",
      };
    }
  };
  public updateScheduleRule = async ({
    scheduleRuleId,
    groupUserId,
    token,
  }: {
    scheduleRuleId: string;
    groupUserId: string;
    token: string;
  }) => {
    try {
      const groupId = await this.getGroupIdByGroupUserId({ groupUserId });
      const changer = (await this.getUserByTokenGroup(
        token,
        groupId as string
      )) as { role: string };
      if (changer.role !== "admin") {
        return {
          type: "info",
          message: "You are not authorized to update a schedule rule",
        };
      }
      await GroupUser.update(
        {
          scheduleRuleId,
        },
        {
          where: {
            id: groupUserId,
          },
        }
      );
      return {
        type: "success",
        message: "Schedule rule updated successfully",
      };
    } catch (error) {
      return {
        message: "An error occurred while updating schedule rule: " + error,
        type: "error",
      };
    }
  };

  public getGroupIdByGroupUserId = async ({
    groupUserId,
  }: {
    groupUserId: string;
  }) => {
    try {
      const group = await GroupUser.findOne({
        where: {
          id: groupUserId,
        },
      });
      return group?.groupId;
    } catch (error) {
      return {
        message:
          "An error occurred while getting the group id by group user id: " +
          error,
        type: "error",
      };
    }
  };
  public getGroupNameByGroupUserId = async ({
    groupUserId,
  }: {
    groupUserId: string;
  }) => {
    try {
      const groupId = await this.getGroupIdByGroupUserId({ groupUserId });
      const group = await Group.findOne({
        where: {
          id: groupId,
        },
      });
      return group?.name;
    } catch (error) {
      return null;
    }
  };
}

export default GroupUserService;
