import UserController from "./user";
import GroupController from "./group";

import GroupUser from "../models/group-user";

class DashboardController {
  token: string;
  userController: UserController;
  groupController: GroupController;
  constructor({ token }) {
    this.token = token;
    this.userController = new UserController();
    this.groupController = new GroupController();
  }

  public getGroupsToUserDashboard = async () => {
    try {
      const groupUserIds = await this.getGroupUserIdsToken();
      if (!groupUserIds) {
        return null;
      } else {
        const groups = groupUserIds.map(async (groupUserId) => {
          const group = await this.groupController.getGroup(groupUserId);
          return group;
        });
        return groups;
      }
    } catch (error) {
      return {
        message: "An error occurred while fetching groups: " + error,
        type: "error",
      };
    }
  };
  private getGroupUserIdsToken = async () => {
    try {
      const userId = this.userController.getUserIdByToken(this.token);
      const groupUserIds = await GroupUser.findAll({
        where: { userId },
        attributes: ["id"],
      });
      return groupUserIds.map((groupUserId) => groupUserId.id);
    } catch (error) {
      return null;
    }
  };
}

export default DashboardController;
