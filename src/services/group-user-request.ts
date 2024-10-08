import { v4 as uuidv4 } from "uuid";

import GroupUserRequest from "../models/group-user-request";
import GroupUser from "../models/group-user";
import User from "../models/user";

import GroupUserService from "./group-user";

class GroupUserRequestService {
  public groupUserService = new GroupUserService();
  public createTable = async () => {
    GroupUserRequest.sync({ alter: true })
      .then(() => {
        console.log("GroupUserRequest table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the GroupUserRequest table:",
          error
        );
      });
  };
  public addRequest = async (userId: string, groupId: string) => {
    const groupUserRequestId = uuidv4();
    try {
      await GroupUserRequest.create({
        id: groupUserRequestId,
        groupId,
        userId,
        status: "pending",
      });
      return {
        message: "Request sent successfully",
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while sending the request: " + error,
        type: "error",
      };
    }
  };
  public getRequests = async (groupId: string, username: string) => {
    try {
      const requests = await GroupUserRequest.findAll({
        where: {
          groupId,
          status: "pending",
        },
      });
      const users = await User.findAll();
      const requestsData = requests.map((request) => {
        return {
          requestId: request.id,
          userId: request.userId,
        };
      });
      const usersId = requestsData.map((request) => request.userId);
      const userData = users.map((user) => {
        return {
          id: user.id,
          requestId: requestsData.find((request) => request.userId === user.id)
            ?.requestId,
          groupId: groupId,
          name: user.name,
          email: user.email,
          username: user.name,
          img: user.img,
        };
      });

      return {
        message: "Requests fetched successfully",
        type: "success",
        data: userData.filter(
          (user) =>
            user.name.includes(username) && usersId.includes(user.id) && user
        ),
      };
    } catch (error) {
      return {
        message: "An error occurred while fetching the requests: " + error,
        type: "error",
      };
    }
  };
  public getNotAddedUsers = async (groupId: string, username: string) => {
    try {
      const users = await User.findAll();
      const groupUsers = await GroupUser.findAll({
        attributes: ["userId", "groupId"],
      });
      const membersOfGroupIds = groupUsers
        .filter(
          (groupUser) =>
            String(groupUser.groupId) === groupId && groupUser.userId
        )
        .map((groupUser) => groupUser.userId);
      const userData = users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.name,
          img: user.img,
        };
      });
      return {
        message: "Users fetched successfully",
        type: "success",
        data: userData.filter(
          (user) =>
            user.name.includes(username) &&
            !membersOfGroupIds.includes(user.id) &&
            user
        ),
      };
    } catch (error) {
      return {
        message: "An error occurred while fetching the users: " + error,
        type: "error",
      };
    }
  };
  public changeStatus = async (
    groupId: string,
    userId: string,
    status: string,
    role: string
  ) => {
    try {
      if (role != "admin") {
        return {
          message: "You are not authorized to change the status",
          type: "error",
        };
      } else {
        if (status === "accepted") {
          await this.groupUserService.addUser(userId, "member", groupId, role);
          await GroupUserRequest.destroy({
            where: {
              groupId,
              userId,
            },
          });
          return {
            message: "Request accepted successfully",
            type: "success",
          };
        } else if (status === "rejected") {
          await GroupUserRequest.destroy({
            where: {
              groupId,
              userId,
            },
          });
          return {
            message: "Request rejected successfully",
            type: "success",
          };
        } else {
          return {
            message: "Invalid status",
            type: "error",
          };
        }
      }
    } catch (error) {
      return {
        message: "An error occurred while changing the status: " + error,
        type: "error",
      };
    }
  };
  public deleteRequest = (groupId: string, userId: string) => {
    try {
      GroupUserRequest.destroy({
        where: {
          groupId,
          userId,
        },
      });
      return {
        message: "Request deleted successfully",
        type: "success",
      };
    } catch (error) {
      return {
        message: "An error occurred while deleting the request: " + error,
        type: "error",
      };
    }
  };
}

export default GroupUserRequestService;
