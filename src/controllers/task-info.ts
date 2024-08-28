import { Request, Response } from "express";

import TaskInfoService from "../services/task-info";
import GroupUserService from "../services/group-user";

import {
  TaskInfoCreation,
  SubtaskCreation,
  TaskAffilationsCreation,
} from "../types/task";

const groupUserService = new GroupUserService();
const taskInfoService = new TaskInfoService();

class TaskInfoController {
  public postTaskInfo = async (request: Request, response: Response) => {
    try {
      const {
        taskInfo,
        subtasks,
        taskAffilations,
        groupId,
      }: {
        taskInfo: TaskInfoCreation;
        subtasks: SubtaskCreation[];
        taskAffilations: TaskAffilationsCreation[];
        groupId: string;
      } = request.body;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await taskInfoService.createTaskInfo(
        taskInfo,
        subtasks,
        taskAffilations,
        groupId,
        token
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getTaskInfo = async (request: Request, response: Response) => {
    try {
      const { groupId, taskStatus } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1];
      const result = await taskInfoService.getTaskInfoToCard({
        groupId: groupId as string,
        token: token as string,
        taskStatus: taskStatus as string,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getTaskInfoById = async (request: Request, response: Response) => {
    try {
      const { id: taskInfoId } = request.params as { id: string };
      const subtaskStatus = request.query.subtaskStatus as string;
      const result = await taskInfoService.getTaskInfoToTaskPage({
        taskInfoId,
        subtaskStatus,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getIsAdminByTaskInfoId = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { taskInfoId } = request.params;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const groupId = (await taskInfoService.getGroupIdByTaskInfoId({
        taskInfoId,
      } as { taskInfoId: string })) as string;
      const result = await groupUserService.isAdminOfGroup({
        groupId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putTaskInfo = async (request: Request, response: Response) => {
    try {
      const { name, startDate, endDate, status, priority, comments } =
        request.body;
      const taskInfoId = request.params.id;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await taskInfoService.editTaskInfo({
        taskInfo: { name, startDate, endDate, status, priority, comments },
        taskInfoId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public deleteTaskInfo = async (request: Request, response: Response) => {
    try {
      const { taskInfoId } = request.params;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await taskInfoService.deleteTaskInfo({
        taskInfoId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getIsBelongToTask = async (request: Request, response: Response) => {
    try {
      const { id: taskInfoId } = request.params;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const groupId = await taskInfoService.getGroupIdByTaskInfoId({
        taskInfoId,
      } as { taskInfoId: string });
      const user = (await groupUserService.getUserByTokenGroup(
        token,
        groupId as string
      )) as { id: string; role: string };
      const result = await taskInfoService.isUserBelongToTask({
        memberId: user?.id,
        taskInfoId,
      } as { memberId: string; taskInfoId: string });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export default TaskInfoController;
