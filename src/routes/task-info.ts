import express from "express";
import { Request, Response } from "express";

import TaskInfoController from "../controllers/task-info";
import UserAuthentication from "../middlewares/auth";
import GroupUserController from "../controllers/group-user";
import { TaskInfoCreation, SubtaskCreation, TaskAffilationsCreation } from "../types/task";

const router = express.Router();

const taskInfoController = new TaskInfoController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post("/task-info", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const {
            taskInfo,
            subTasks,
            taskAffilations,
            groupId
        } : {
            taskInfo: TaskInfoCreation,
            subTasks: SubtaskCreation[],
            taskAffilations: TaskAffilationsCreation[],
            groupId: string
        } = request.body;
        const token = request.headers['authorization']?.split(' ')[1] as string;
        const result = await taskInfoController.createTaskInfo(
            taskInfo,
            subTasks,
            taskAffilations,
            groupId,
            token
        );
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.get("/task-info/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const taskInfoId = parseInt(request.params.id);
        const result = await taskInfoController.getTaskInfo(taskInfoId);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.get("/task-info", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupUserId } = request.query;
        const result = await taskInfoController.getTasksInfo(parseInt(groupUserId as string));
        response.status(200).json({
            message: "Tasks info fetched successfully",
            type: "success",
            data: result
        });
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.put("/task-info/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const {name, startDate, endDate, status, priority, comments, groupId } = request.query;
        const taskInfo = { name, startDate, endDate, status, priority, comments } as unknown as TaskInfoCreation;
        const taskInfoId = parseInt(request.params.id);
        const groupUser = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: number, role: string};
        const result = await taskInfoController.editTaskInfo(
            taskInfoId,
            taskInfo,
            groupUser?.role as string
        );
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.delete("/task-info/:id", userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId } = request.query
        const taskInfoId = parseInt(request.params.id);
        const groupUser = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: number, role: string};
        const result = await taskInfoController.deleteTaskInfo(
            taskInfoId,
            groupUser?.role as string
        );
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

export default router;