import express from "express";
import { Request, Response } from "express";

import TaskInfoController from "../controllers/task-info";
import UserAuthentication from "../middlewares/auth";
import UserController from "../controllers/user";
import { TaskInfoCreation } from "../types/task";

const router = express.Router();

const taskInfoController = new TaskInfoController();
const userAuthentication = new UserAuthentication();
const userController = new UserController();

router.post("/task-info", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskId, startDate, endDate, status, priority, comments  } = request.query;
    const taskInfo = { taskId, startDate, endDate, status, priority, comments } as unknown as TaskInfoCreation;
    const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
    const responseText = await taskInfoController.createTaskInfo(taskInfo, user?.id as number);
    response.status(201).json({ message: responseText });
})

export default router;