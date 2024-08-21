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
      const { groupId, taskStatus } = request.query;
      const token = request.headers["authorization"]?.split(" ")[1];
      const result = await taskInfoController.getTaskInfoToCard({
        groupId: groupId as string,
        token: token as string,
        taskStatus: taskStatus as string,
      });
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
      const { id: taskInfoId } = request.params as { id: string };
      const subtaskStatus = request.query.subtaskStatus as string;
      const result = await taskInfoController.getTaskInfoToTaskPage({
        taskInfoId,
        subtaskStatus,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.get(
  "/task-info/is-admin/:taskInfoId",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { taskInfoId } = request.params;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const groupId = (await taskInfoController.getGroupIdByTaskInfoId({
        taskInfoId,
      } as { taskInfoId: string })) as string;
      const result = await groupUserController.isAdminOfGroup({
        groupId,
        token,
      });
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
  "/task-info/:taskInfoId",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { taskInfoId } = request.params;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await taskInfoController.deleteTaskInfo({
        taskInfoId,
        token,
      });
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
