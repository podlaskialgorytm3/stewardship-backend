import UserService from "./user";
import GroupService from "./group";
import TaskInfoService from "./task-info";

import GroupUser from "../models/group-user";
import TaskAffilation from "../models/task-affilation";

class DashboardService {
  token: string;
  userService: UserService;
  groupService: GroupService;
  taskInfoService: TaskInfoService;
  constructor({ token }: { token: string }) {
    this.token = token;
    this.userService = new UserService();
    this.groupService = new GroupService();
    this.taskInfoService = new TaskInfoService();
  }

  public getGroupsToUserDashboard = async () => {
    try {
      const groupIds = await this.getGroupIds();
      if (!groupIds) {
        return null;
      } else {
        const groups = Promise.all(
          groupIds.map(async (groupId) => {
            const group = await this.groupService.getGroup(groupId);
            return group.data;
          })
        );
        return groups;
      }
    } catch (error) {
      return {
        message: "An error occurred while fetching groups: " + error,
        type: "error",
      };
    }
  };
  public getTasksToUserDashboard = async () => {
    try {
      const taskInfoIds = await this.getTaskInfoIds();
      if (!taskInfoIds) {
        return null;
      } else {
        const tasks = Promise.all(
          taskInfoIds.map(async (taskInfoId) => {
            return await this.taskInfoService.getTaskInfo({ taskInfoId });
          })
        );
        return (await tasks).map((task) => {
          return {
            id: task.taskInfo?.id,
            name: task.taskInfo?.name,
            assignedBy: task.taskInfo?.assignedBy,
          };
        });
      }
    } catch (error) {
      return null;
    }
  };
  private getGroupIds = async () => {
    try {
      const userId = await this.userService.getUserIdByToken(this.token);
      const groupUserIds = await GroupUser.findAll({
        where: { userId },
        attributes: ["groupId"],
      });
      return groupUserIds.map((groupUserId) => groupUserId.groupId);
    } catch (error) {
      return null;
    }
  };
  private getTaskInfoIds = async (): Promise<string[] | null> => {
    try {
      const groupUserIds = await this.getGroupUsersIds();
      if (!groupUserIds) {
        return null;
      }
      const taskAffilationIds = await TaskAffilation.findAll({
        where: { groupUserId: groupUserIds },
        attributes: ["taskInfoId"],
      });
      return taskAffilationIds.map(
        (taskAffilationId) => taskAffilationId.taskInfoId
      );
    } catch (error) {
      return null;
    }
  };
  private getGroupUsersIds = async () => {
    try {
      const userId = await this.userService.getUserIdByToken(this.token);
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

export default DashboardService;
