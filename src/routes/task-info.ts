import express from "express";
import { Request, Response } from "express";

import TaskInfoController from "../controllers/task-info";
import UserAuthentication from "../middlewares/auth";
import UserController from "../controllers/user";
import GroupUserController from "../controllers/group-user";
import { TaskInfoCreation } from "../types/task";

const router = express.Router();

const taskInfoController = new TaskInfoController();
const userAuthentication = new UserAuthentication();
const userController = new UserController();
const groupUserController = new GroupUserController();

router.post("/task-info", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskId, startDate, endDate, status, priority, comments , groupId  } = request.query;
    const taskInfo = { taskId, startDate, endDate, status, priority, comments } as unknown as TaskInfoCreation;
    const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
    const groupUser = await groupUserController.getUser(groupId as string, user?.id as number) as {id: number; role: string};
    const responseText = await taskInfoController.createTaskInfo(taskInfo, groupUser?.id as number, groupUser?.role as string);
    response.status(201).json({ message: responseText });
})

router.get("/task-info/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const taskInfoId = parseInt(request.params.id);
    const taskInfo = await taskInfoController.getTaskInfo(taskInfoId);
    response.status(200).json(taskInfo);
})

export default router;