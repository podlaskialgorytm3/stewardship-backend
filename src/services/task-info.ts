import { v4 as uuidv4 } from "uuid";

import TaskInfo from "../models/task-info";
import TaskAffilation from "../models/task-affilation";
import SubTask from "../models/sub-task";
import GroupUser from "../models/group-user";

import {
  TaskInfoCreation as TaskInfoInterface,
  SubtaskCreation,
  TaskAffilationsCreation,
  TaskInfoResquest,
} from "../types/task";

import TaskAffilationService from "./task-affilation";
import GroupUserService from "./group-user";
import SubTaskService from "./sub-task";

import { convertDate } from "../utils/task-info";

class TaskInfoService {
  public taskAffilationService = new TaskAffilationService();
  public groupUserService = new GroupUserService();
  public subTaskService = new SubTaskService();
  public createTable = async () => {
    TaskInfo.sync({ alter: true })
      .then(() => {
        console.log("TaskInfo table has been synchronized");
      })
      .catch((error) => {
        console.error(
          "An error occurred while synchronizing the TaskInfo table:",
          error
        );
      });
  };
  public createTaskInfo = async (
    taskInfo: TaskInfoInterface,
    subtasks: SubtaskCreation[],
    taskAffilations: TaskAffilationsCreation[],
    groupId: string,
    token: string
  ) => {
    try {
      const id = uuidv4();
      const user = (await this.groupUserService.getUserByTokenGroup(
        token,
        groupId
      )) as { id: string; role: string };
      if (user.role !== "admin") {
        return {
          message: "You are not authorized to create task info",
          type: "info",
        };
      } else {
        await TaskInfo.create({
          id: id,
          name: taskInfo["task-name"],
          startDate: taskInfo["start-date"],
          endDate: taskInfo["end-date"],
          status: taskInfo.status,
          priority: taskInfo.priority,
          comments: taskInfo.comments,
          assignedBy: user?.id,
        });
        if (subtasks.length > 0) {
          await Promise.all(
            subtasks.map(async (subtask) => {
              await this.subTaskService.createSubtaskWithCreatingTaskInfo({
                subtask,
                taskInfoId: id,
                memberId: user?.id,
              } as {
                subtask: SubtaskCreation;
                taskInfoId: string;
                memberId: string;
              });
            })
          );
        }
        await this.taskAffilationService.addTaskAffilation(
          id as string,
          user?.id,
          user?.role as string
        );
        if (taskAffilations.length > 0) {
          await Promise.all(
            taskAffilations.map(async (taskAffilation) => {
              await this.taskAffilationService.addTaskAffilation(
                id as string,
                taskAffilation.memberId,
                user?.role as string
              );
            })
          );
        }
        return {
          message: "Task info created successfully",
          type: "success",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while creating task info: " + error,
        type: "error",
      };
    }
  };

  public getTaskInfoToCard = async ({
    groupId,
    token,
    taskStatus,
  }: {
    groupId: string;
    token: string;
    taskStatus: string;
  }) => {
    try {
      const member = (await this.groupUserService.getUserByTokenGroup(
        token,
        groupId
      )) as { id: string };
      const taskInfoIds = (await this.taskAffilationService.getTaskInfoIds(
        member.id
      )) as string[];
      const tasks = await Promise.all(
        taskInfoIds.map(async (taskInfoId: string) => {
          return await this.getTaskInfo({
            taskInfoId,
          });
        })
      );
      const filteredTasks = tasks.filter((task) =>
        task.taskInfo?.status?.includes(taskStatus)
      );
      return filteredTasks;
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while getting task info to card: " + error,
      };
    }
  };

  public getTaskInfoToTaskPage = async ({
    taskInfoId,
    subtaskStatus,
  }: {
    taskInfoId: string;
    subtaskStatus: string;
  }) => {
    try {
      const taskInfo = await this.getTaskInfo({ taskInfoId });
      return {
        taskInfo: taskInfo.taskInfo,
        subTasks:
          subtaskStatus === ""
            ? taskInfo.subTasks
            : taskInfo.subTasks &&
              taskInfo.subTasks.filter(
                (subtask) => subtask.status === subtaskStatus
              ),
        precentOfDoneSubtasks: taskInfo.precentOfDoneSubtasks,
        members: taskInfo.members,
      };
    } catch (error) {
      return {
        type: "error",
        message:
          "An error occurred while getting task info to task page: " + error,
      };
    }
  };

  public getTaskInfo = async ({ taskInfoId }: { taskInfoId: string }) => {
    try {
      const taskInfo = await TaskInfo.findOne({
        where: {
          id: taskInfoId,
        },
      });
      const taskAffilations =
        await this.taskAffilationService.getTaskAffilation(taskInfoId);
      const subTasks = await this.subTaskService.getSubTasks(taskInfoId);
      return {
        taskInfo: {
          id: taskInfo?.id,
          name: taskInfo?.name,
          startDate: taskInfo?.startDate,
          endDate: taskInfo?.endDate,
          status: taskInfo?.status,
          priority: taskInfo?.priority,
          assignedBy: await this.groupUserService.getUserByGroupUserId(
            taskInfo?.assignedBy as string
          ),
          comments: taskInfo?.comments,
          time:
            taskInfo?.endDate && taskInfo?.startDate
              ? (new Date(taskInfo.endDate).getTime() -
                  new Date(taskInfo.startDate).getTime()) /
                (1000 * 60 * 60)
              : undefined,
        },
        subTasks: subTasks,
        precentOfDoneSubtasks: await this.subTaskService.precentOfDoneSubtask(
          taskInfoId
        ),
        members: taskAffilations,
      };
    } catch (error) {
      return {
        message: "An error occurred while getting task info: " + error,
        type: "error",
      };
    }
  };

  public editTaskInfo = async ({
    taskInfo,
    taskInfoId,
    token,
  }: {
    taskInfo: TaskInfoResquest;
    taskInfoId: string;
    token: string;
  }) => {
    try {
      const groupId = (await this.getGroupIdByTaskInfoId({
        taskInfoId,
      })) as string;
      const user = (await this.groupUserService.getUserByTokenGroup(
        token,
        groupId
      )) as { role: string };
      if (user.role !== "admin") {
        return {
          message: "You are not authorized to edit this task info",
          type: "info",
        };
      } else {
        await TaskInfo.update(
          {
            name: taskInfo.name,
            startDate: convertDate(taskInfo.startDate),
            endDate: convertDate(taskInfo.endDate),
            status: taskInfo.status,
            priority: taskInfo.priority,
            comments: taskInfo.comments,
          },
          {
            where: {
              id: taskInfoId,
            },
          }
        );
        return {
          message: "Task info updated successfully",
          type: "success",
        };
      }
    } catch (error) {
      return {
        message: "An error occurred while updating task info: " + error,
        type: "error",
      };
    }
  };
  public deleteTaskInfo = async ({
    taskInfoId,
    token,
  }: {
    taskInfoId: string;
    token: string;
  }) => {
    const groupId = (await this.getGroupIdByTaskInfoId({
      taskInfoId,
    })) as string;
    const user = (await this.groupUserService.getUserByTokenGroup(
      token,
      groupId
    )) as { role: string };
    if (user.role !== "admin") {
      return {
        message: "You are not authorized to delete this task info",
        type: "info",
      };
    } else {
      try {
        await TaskInfo.destroy({
          where: {
            id: taskInfoId,
          },
        });
        await TaskAffilation.destroy({
          where: {
            taskInfoId: taskInfoId,
          },
        });
        await SubTask.destroy({
          where: {
            taskInfoId: taskInfoId,
          },
        });
        return {
          message: "Task info deleted successfully",
          type: "success",
        };
      } catch (error) {
        return {
          message: "An error occurred while deleting task info: " + error,
          type: "error",
        };
      }
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
      return null;
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
      return null;
    }
  };
  public isUserBelongToTask = async ({
    memberId,
    taskInfoId,
  }: {
    memberId: string;
    taskInfoId: string;
  }) => {
    try {
      const taskAffilation = await TaskAffilation.findOne({
        where: {
          groupUserId: memberId,
          taskInfoId: taskInfoId,
        },
      });
      return taskAffilation ? true : false;
    } catch (error) {
      return {
        message:
          "An error occurred while checking if user belong to task: " + error,
        type: "error",
      };
    }
  };
}
export default TaskInfoService;
