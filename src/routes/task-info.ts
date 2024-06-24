import express from "express";
import { Request, Response } from "express";

import TaskInfoController from "../controllers/task-info";
import UserAuthentication from "../middlewares/auth";
import GroupUserController from "../controllers/group-user";
import { TaskInfoCreation } from "../types/task";

const router = express.Router();

const taskInfoController = new TaskInfoController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post("/task-info", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { taskId, startDate, endDate, status, priority, comments } = request.query;
    const taskInfo = { taskId, startDate, endDate, status, priority, comments } as unknown as TaskInfoCreation;
    const groupUser = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as {id: number, role: string};
    const responseText = await taskInfoController.createTaskInfo(
        taskInfo,
        groupUser?.id as number,
        groupUser?.role as string
    );
    response.status(201).json({ message: responseText });
})

router.get("/task-info/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const taskInfoId = parseInt(request.params.id);
    const taskInfo = await taskInfoController.getTaskInfo(taskInfoId);
    response.status(200).json(taskInfo);
})

router.put("/task-info/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const {taskId, startDate, endDate, status, priority, comments } = request.query;
    const taskInfo = { taskId, startDate, endDate, status, priority, comments } as unknown as TaskInfoCreation;
    const taskInfoId = parseInt(request.params.id);
    const groupUser = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as {id: number, role: string};
    const responseText = await taskInfoController.editTaskInfo(
        taskInfoId,
        taskInfo,
        groupUser?.role as string
    );
    response.status(200).json({ message: responseText });
})

export default router;