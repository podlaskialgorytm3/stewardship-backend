import TaskAffilation from "../models/task-affilation";
import GroupUser from "../models/group-user";
import GroupUserController from "./group-user";
import { v4 as uuidv4 } from "uuid";

import { Member } from "../types/member";

class TaskAffilationController {
  public groupUserController = new GroupUserController();
  public createTable = async () => {
    TaskAffilation.sync({ alter: true })
      .then(() => {
        console.log("Task Affilation table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the Task Affilation table:",
          error
        );
      });
  };
  public addTaskAffilation = async (
    taskInfoId: string,
    groupUserId: string,
    role: string
  ) => {
    try {
      const taskAffilationId = uuidv4();
      if (role !== "admin") {
        return {
          message: "You are not authorized to create task affilation",
          type: "info",
        };
      } else {
        const isTaskAffilation = await TaskAffilation.findOne({
          where: {
            taskInfoId,
            groupUserId,
          },
        });
        if (isTaskAffilation)
          return {
            message: "Task affilation already exists",
            type: "info",
          };
        await TaskAffilation.create({
          id: taskAffilationId,
          taskInfoId: taskInfoId,
          groupUserId: groupUserId,
        });
        return {
          message: "New task affilation created!",
          type: "success",
        };
      }
    } catch (error) {
      return {
        message:
          "An error occurred while creating a new task affilation: " + error,
        type: "error",
      };
    }
  };
  public getTaskAffilation = async (taskInfoId: string) => {
    try {
      const taskAffilations = await TaskAffilation.findAll({
        where: {
          taskInfoId,
        },
      });

      const groupUsersId = taskAffilations.map(
        (taskAffilation) => taskAffilation.groupUserId
      );

      const usersInfo = await Promise.all(
        groupUsersId.map(async (groupUserId) => {
          const userInfo = await this.groupUserController.getUserByGroupUserId(
            groupUserId
          );
          return userInfo;
        })
      );

      return usersInfo;
    } catch (error) {
      return {
        message: "An error occurred while fetching task affilation: " + error,
        type: "error",
      };
    }
  };
  private getMembersOffTask = async ({
    taskInfoId,
  }: {
    taskInfoId: string;
  }) => {
    try {
      const groupId = (await this.getGroupIdByTaskInfoId({
        taskInfoId,
      })) as string;
      const groupUsers = (await this.groupUserController.getUsersByGroupId({
        groupId,
      })) as Member[];
      const taskMembers = (await this.getTaskAffilation(
        taskInfoId
      )) as Member[];
      return groupUsers.filter(
        (groupUser) =>
          !taskMembers.some((memberOfTask) => memberOfTask.id === groupUser.id)
      );
    } catch (error) {
      return null;
    }
  };
  public searchMembersAddedToTask = async ({
    taskInfoId,
    username,
  }: {
    taskInfoId: string;
    username: string;
  }) => {
    try {
      const members = (await this.getTaskAffilation(taskInfoId)) as Member[];
      return members.filter(
        (member) =>
          username.includes(member.name) || member.name.includes(username)
      );
    } catch (error) {
      return {
        message: "An error occurred while searching task affilation: " + error,
        type: "error",
      };
    }
  };
  public searchMembersOffTask = async ({
    taskInfoId,
    username,
  }: {
    taskInfoId: string;
    username: string;
  }) => {
    try {
      const members = (await this.getMembersOffTask({
        taskInfoId,
      })) as Member[];
      return members.filter(
        (member) =>
          username.includes(member.name) || member.name.includes(username)
      );
    } catch (error) {
      return {
        message: "An error occurred while searching task affilation: " + error,
        type: "error",
      };
    }
  };

  public deleteTaskAffilation = async (
    taskInfoId: string,
    groupUserId: string,
    role: string
  ) => {
    try {
      if (role !== "admin") {
        return {
          message: "You are not authorized to delete task affilation",
          type: "info",
        };
      } else {
        await TaskAffilation.destroy({
          where: {
            taskInfoId,
            groupUserId,
          },
        });
        return {
          message: "Task affilation deleted successfully!",
          type: "success",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while deleting task affilation: " + error,
        type: "error",
      };
    }
  };
  public getTaskInfoIds = async (groupUserId: string) => {
    try {
      const taskAffilations = await TaskAffilation.findAll({
        where: {
          groupUserId,
        },
      });
      const taskInfoIds = taskAffilations.map(
        (taskAffilation) => taskAffilation.taskInfoId
      );
      return taskInfoIds;
    } catch (error) {
      return null;
    }
  };
  private getGroupUserIdByTaskInfoId = async ({
    taskInfoId,
  }: {
    taskInfoId: string;
  }) => {
    try {
      const taskAffilation = await TaskAffilation.findOne({
        where: {
          taskInfoId: taskInfoId,
        },
      });
      return taskAffilation?.groupUserId;
    } catch (error) {
      return {
        message:
          "An error occurred while getting group id by task info id: " + error,
        type: "error",
      };
    }
  };
  public getGroupIdByTaskInfoId = async ({
    taskInfoId,
  }: {
    taskInfoId: string;
  }) => {
    try {
      const groupUser = await GroupUser.findOne({
        where: {
          id: await this.getGroupUserIdByTaskInfoId({
            taskInfoId: taskInfoId,
          } as { taskInfoId: string }),
        },
        attributes: ["groupId"],
      });
      return groupUser?.groupId;
    } catch (error) {
      return {
        message:
          "An error occurred while getting group id by group user id: " + error,
        type: "error",
      };
    }
  };
}

export default TaskAffilationController;
