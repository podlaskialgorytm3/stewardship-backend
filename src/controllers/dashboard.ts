import UserController from "./user";
import GroupController from "./group";
import TaskInfoController from "./task-info";
import GroupUserController from "./group-user";

import GroupUser from "../models/group-user";
import TaskInfo from "../models/task-info";

class DashboardController {
  token: string;
  userController: UserController;
  groupController: GroupController;
  taskInfoController: TaskInfoController;
  groupUserController: GroupUserController;
  constructor({ token }) {
    this.token = token;
    this.userController = new UserController();
    this.groupController = new GroupController();
    this.taskInfoController = new TaskInfoController();
    this.groupUserController = new GroupUserController();
  }

  public getGroupsToUserDashboard = async () => {
    try {
      const groupUserIds = await this.getGroupUserIds();
      if (!groupUserIds) {
        return null;
      } else {
        const groups = groupUserIds.map(async (groupUserId) => {
          const group = await this.groupController.getGroup(groupUserId);
          return group.data;
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
  public getTasksToUserDashboard = async () => {
    try {
      const taskInfoIds = await this.getTaskInfoIds();
      if (!taskInfoIds) {
        return null;
      } else {
        const tasks = Promise.all(
          taskInfoIds.map(async (taskInfoId) => {
            return await this.taskInfoController.getTaskInfo({ taskInfoId });
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
  private getGroupUserIds = async () => {
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
  private getTaskInfoIds = async (): Promise<string[] | null> => {
    try {
      const groupUserIds = await this.getGroupUserIds();
      if (!groupUserIds) {
        return null;
      }
      const taskInfoIdsArrays = await Promise.all(
        groupUserIds.map(async (groupUserId) => {
          const taskInfoIds = await TaskInfo.findAll({
            where: { groupUserId },
            attributes: ["id"],
          });
          return taskInfoIds.map((taskInfo) => taskInfo.id);
        })
      );
      const taskInfoIds = taskInfoIdsArrays.flat();
      return taskInfoIds;
    } catch (error) {
      return null;
    }
  };
}

export default DashboardController;
