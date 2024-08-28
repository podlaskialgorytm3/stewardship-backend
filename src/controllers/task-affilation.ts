import { Request, Response } from "express";

import TaskAffilationService from "../services/task-affilation";
import GroupUserService from "../services/group-user";
import TaskInfoService from "../services/task-info";

const groupUserService = new GroupUserService();
const taskInfoService = new TaskInfoService();
const taskAffilationService = new TaskAffilationService();

class TaskAffilationController {
  public postTaskAffilation = async (request: Request, response: Response) => {
    try {
      const { taskInfoId, groupUserId } = request.body;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const groupId = await taskInfoService.getGroupIdByTaskInfoId({
        taskInfoId,
      } as { taskInfoId: string });
      const user = (await groupUserService.getUserByTokenGroup(
        token,
        groupId as unknown as string
      )) as { id: string; role: string };
      const result = await taskAffilationService.addTaskAffilation(
        taskInfoId as string,
        groupUserId as string,
        user?.role as string
      );
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getTaskAffilation = async (request: Request, response: Response) => {
    try {
      const { taskInfoId, username } = request.query as {
        taskInfoId: string;
        username: string;
      };
      const result = await taskAffilationService.searchMembersAddedToTask({
        taskInfoId,
        username,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getTaskAffilationOffTask = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { taskInfoId, username } = request.query as {
        taskInfoId: string;
        username: string;
      };
      const result = await taskAffilationService.searchMembersOffTask({
        taskInfoId,
        username,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public deleteTaskAffilation = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { taskInfoId, groupUserId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const groupId = await taskInfoService.getGroupIdByTaskInfoId({
        taskInfoId,
      } as { taskInfoId: string });
      const user = (await groupUserService.getUserByTokenGroup(
        token,
        groupId as string
      )) as { id: string; role: string };
      const result = await taskAffilationService.deleteTaskAffilation(
        taskInfoId as string,
        groupUserId as string,
        user?.role as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export default TaskAffilationController;
