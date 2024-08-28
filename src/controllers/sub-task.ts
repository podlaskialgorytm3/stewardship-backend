import { Request, Response } from "express";

import { SubtaskCreation } from "../types/task";
import { SubtaskUpdate } from "../types/sub-task";

import SubtaskService from "../services/sub-task";

const subtaskService = new SubtaskService();

class SubtaskController {
  public postSubtask = async (request: Request, response: Response) => {
    try {
      const { title, description, status } = request.body as SubtaskCreation;
      const { taskInfoId } = request.query as { taskInfoId: string };
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await subtaskService.createSubTask({
        subtask: { title, description, status },
        taskInfoId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {}
  };
  public deleteSubtask = async (request: Request, response: Response) => {
    try {
      const subtaskId = request.params.subtaskId as string;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await subtaskService.deleteSubTask({
        subtaskId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putSubtask = async (request: Request, response: Response) => {
    try {
      const subtaskId = request.params.subtaskId as string;
      const { title, description } = request.body as SubtaskUpdate;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await subtaskService.updateSubtask({
        subtask: { title, description },
        subtaskId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public putChangeStatus = async (request: Request, response: Response) => {
    try {
      const subtaskId = request.params.subtaskId;
      const { status } = request.body;
      const result = await subtaskService.changeStatus({
        subtaskId,
        status,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
  public getHasRight = async (request: Request, response: Response) => {
    try {
      const subtaskId = request.params.subtaskId;
      const token = request.headers["authorization"]?.split(" ")[1] as string;
      const result = await subtaskService.hasRightToHandleSubtask({
        subtaskId,
        token,
      });
      response.status(200).json(result);
    } catch (error) {
      response.status(400).json(error);
    }
  };
}

export default SubtaskController;
