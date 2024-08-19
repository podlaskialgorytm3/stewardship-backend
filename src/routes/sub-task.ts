import express from "express";
import { Request, Response } from "express";
import SubTaskController from "../controllers/sub-task";
import GroupUserController from "../controllers/group-user";
import UserAuthentication from "../middlewares/auth";
import { SubtaskCreation } from "../types/task";
import { SubtaskUpdate } from "../types/sub-task";

const router = express.Router();

const subTaskController = new SubTaskController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post(
  "/sub-task",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { title, description, status } = request.body as SubtaskCreation;
      const { taskInfoId } = request.query as { taskInfoId: string };
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await subTaskController.createSubTask({
        subtask: { title, description, status },
        taskInfoId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {}
  }
);

router.get(
  "/sub-task/:subTaskId",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const subTaskId = request.params.subTaskId;
      const result = await subTaskController.getSubTask(subTaskId);
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.get(
  "/sub-task",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const { taskInfoId } = request.query as { taskInfoId: string };
      const result = await subTaskController.getSubTasks(taskInfoId);
      response.status(200).json({
        message: "Sub-tasks found",
        type: "success",
        data: result,
      });
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.delete(
  "/sub-task/:subTaskId",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const subtaskId = request.params.subTaskId as string;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await subTaskController.deleteSubTask({
        subtaskId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.put(
  "/sub-task/:subtaskId",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const subtaskId = request.params.subtaskId as string;
      const { title, description } = request.body as SubtaskUpdate;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await subTaskController.updateSubtask({
        subtask: { title, description },
        subtaskId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.put(
  "/sub-task/change-status/:subtaskId",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const subtaskId = request.params.subtaskId;
      const { status } = request.body;
      const result = await subTaskController.changeStatus({
        subtaskId,
        status,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

router.get(
  "/sub-task/has-right/:subtaskId",
  userAuthentication.authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const subtaskId = request.params.subtaskId;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await subTaskController.hasRightToHandleSubtask({
        subtaskId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  }
);

export default router;
