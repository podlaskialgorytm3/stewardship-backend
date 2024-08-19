import express from "express";
import { Request, Response } from "express";

import TaskInfoController from "../controllers/task-info";
import UserAuthentication from "../middlewares/auth";
import GroupUserController from "../controllers/group-user";
import {
  TaskInfoCreation,
  SubtaskCreation,
  TaskAffilationsCreation,
} from "../types/task";

const router = express.Router();

const taskInfoController = new TaskInfoController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post(
  "/task-info",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
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
      const result = await taskInfoController.createTaskInfo(
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
  }
);
router.get(
  "/task-info",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { groupId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await taskInfoController.getTaskInfoToCard(
        groupId as string,
        token as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.get(
  "/task-info/:id",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const taskInfoId = request.params.id;
      const result = await taskInfoController.getTaskInfo(taskInfoId);
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.get(
  "/task-info/is-admin/:id",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { taskInfoId } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const groupId = await taskInfoController.getGroupIdByTaskInfoId({
        taskInfoId,
      } as { taskInfoId: string });
      const result = await groupUserController.isAdminOfGroup(
        token,
        groupId as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.put(
  "/task-info/:id",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { name, startDate, endDate, status, priority, comments } =
        request.body;
      const taskInfoId = request.params.id;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await taskInfoController.editTaskInfo({
        taskInfo: { name, startDate, endDate, status, priority, comments },
        taskInfoId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.delete(
  "/task-info/:id",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { groupId } = request.query;
      const taskInfoId = request.params.id;
      const groupUser = (await groupUserController.getUserByTokenGroup(
        request.headers["authorization"]?.split(" ")[1] as string,
        groupId as string
      )) as { id: number; role: string };
      const result = await taskInfoController.deleteTaskInfo(
        taskInfoId,
        groupUser?.role as string
      );
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);
router.get(
  "/task-info/is-belong-to-task/:id",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { id: taskInfoId } = request.params;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const groupId = await taskInfoController.getGroupIdByTaskInfoId({
        taskInfoId,
      } as { taskInfoId: string });
      const user = (await groupUserController.getUserByTokenGroup(
        token,
        groupId as string
      )) as { id: string; role: string };
      const result = await taskInfoController.isUserBelongToTask({
        memberId: user?.id,
        taskInfoId,
      } as { memberId: string; taskInfoId: string });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

export default router;
