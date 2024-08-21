import Group from "../models/group";
import GroupUser from "../models/group-user";
import GroupUserRequest from "../models/group-user-request";
import { v4 as uuidv4 } from "uuid";

import GroupUserController from "./group-user";
import UserController from "./user";

class GroupController {
  public groupUserController = new GroupUserController();
  public userController = new UserController();
  public createTable = async () => {
    Group.sync({ alter: true })
      .then(() => {
        console.log("Group table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the Group table:",
          error
        );
      });
  };
  public createGroup = async (
    name: string,
    category: string,
    userId: string
  ) => {
    const groupId = uuidv4() as string;
    try {
      await Group.create({
        id: groupId,
        name,
        category,
      });
      await this.groupUserController.addUser(userId, "admin", groupId, "admin");
      return {
        message: "Group created successfully",
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while creating the group: " + error,
        type: "error",
      };
    }
  };
  public getGroups = async (name: string) => {
    try {
      const groups = await Group.findAll({
        attributes: ["id", "name", "category"],
      });
      return {
        message: "Groups retrieved successfully",
        data: groups.filter((group) => group.name.includes(name) && group),
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while retrieving the groups: " + error,
        type: "error",
      };
    }
  };
  public getGroup = async (id: string) => {
    try {
      const group = await Group.findByPk(id);
      return {
        message: "Group retrieved successfully",
        data: {
          id: group?.id,
          name: group?.name,
          category: group?.category,
        },
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while retrieving the group: " + error,
        type: "error",
      };
    }
  };
  public editGroup = async (
    id: string,
    name: string,
    category: string,
    token: string
  ) => {
    const user = (await this.groupUserController.getUserByTokenGroup(
      token,
      id
    )) as { role: string };
    const role = user?.role as string;
    if (role === "admin") {
      try {
        await Group.update(
          {
            name,
            category,
          },
          {
            where: {
              id,
            },
          }
        );
        return {
          message: "Group updated successfully",
          type: "success",
        };
      } catch (error) {
        return {
          message: "An error occurred while updating the group: " + error,
          type: "error",
        };
      }
    } else {
      return {
        message: "You do not have the permission to edit this group",
        type: "error",
      };
    }
  };
  public deleteGroup = async (id: string, userId: string) => {
    const user = (await this.groupUserController.getUser(id, userId)) as {
      role: string;
    };
    const role = user?.role as string;
    if (role === "admin") {
      try {
        await Group.destroy({
          where: {
            id,
          },
        });
        await this.groupUserController.deleteGroupUsers(id);
        return {
          message: "Group deleted successfully",
          type: "success",
        };
      } catch (error) {
        return {
          message: "An error occurred while deleting the group: " + error,
          type: "error",
        };
      }
    } else {
      return {
        message: "You do not have the permission to delete this group",
        type: "error",
      };
    }
  };
  public isMembership = async (groupId: string, token: string) => {
    try {
      const userId = await this.userController.getUserIdByToken(token);
      const groupUsers = await GroupUser.findAll();
      const groupUserRequests = await GroupUserRequest.findAll({
        where: {
          status: "pending",
        },
      });

      const groupUserData = groupUsers.map((groupUser) => {
        return {
          userId: groupUser.userId,
          groupId: groupUser.groupId,
        };
      });

      const groupUserRequestsData = groupUserRequests.map(
        (groupUserRequest) => {
          return {
            userId: groupUserRequest.userId,
            groupId: groupUserRequest.groupId,
          };
        }
      );

      const isMember = groupUserData.map((groupUser) => {
        if (
          groupUser.userId === userId &&
          String(groupUser.groupId) === groupId
        ) {
          return true;
        }
      });

      const isPending = groupUserRequestsData.map((groupUser) => {
        if (
          groupUser.userId === userId &&
          String(groupUser.groupId) === groupId
        ) {
          return true;
        }
      });

      if (isMember.includes(true)) {
        return "member";
      } else if (isPending.includes(true)) {
        return "pending";
      } else {
        return "none";
      }
    } catch (error) {
      return "none";
    }
  };
  public getGroupsByName = async (name: string, token: string) => {
    try {
      const groups = await Group.findAll({
        limit: 10,
      });

      const groupsData = await Promise.all(
        groups.map(async (group) => {
          return {
            id: group.id,
            name: group.name,
            category: group.category,
            membership: await this.isMembership(String(group.id), token),
          };
        })
      );

      const filteredGroups = groupsData.filter(
        (group) => group.name.includes(name) && group
      );

      return {
        message: "Groups retrieved successfully",
        data: filteredGroups,
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while retrieving the groups: " + error,
        type: "error",
      };
    }
  };
}

export default GroupController;
