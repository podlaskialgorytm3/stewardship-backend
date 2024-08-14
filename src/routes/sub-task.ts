import express from 'express';
import { Request, Response } from 'express';
import SubTaskController from '../controllers/sub-task';
import GroupUserController from '../controllers/group-user';
import UserAuthentication from '../middlewares/auth';
import { SubtaskCreation } from '../types/task';

const router = express.Router();

const subTaskController = new SubTaskController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post('/sub-task', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId, title, description, status, groupId } = request.query;
        const subTaskData = {  title, description, status } as unknown as SubtaskCreation;
        const groupUser = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: string, role: string};
        const result = await subTaskController.createSubTask(subTaskData, groupUser.id, taskInfoId as string);
        response.status(201).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.get('/sub-task/:subTaskId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const subTaskId = request.params.subTaskId;
        const result = await subTaskController.getSubTask(subTaskId);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.get('/sub-task', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId } = request.query as {taskInfoId: string};
        const result = await subTaskController.getSubTasks(taskInfoId);
        response.status(200).json({
            message: "Sub-tasks found",
            type: "success",
            data: result
        });
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.delete('/sub-task/:subTaskId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId } = request.query;
        const subTaskId = request.params.subTaskId;
        const groupUser = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: string, role: string};
        const result = await subTaskController.deleteSubTask(subTaskId, groupUser.id);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.put('/sub-task/:subTaskId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const subTaskId = request.params.subTaskId;
        const { title, description, status, groupId } = request.query as {title: string, description: string, status: string, groupId: string};
        const subTaskData = { title, description, status } as unknown as SubtaskCreation;
        const token = request.headers['authorization']?.split(' ')[1] as string;
        const result = await subTaskController.updateSubTask(subTaskId, subTaskData, token, groupId);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    
    }
})

router.put('/sub-task/change-status/:subTaskId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const subTaskId = request.params.subTaskId;
        const { status } = request.query;
        const result = await subTaskController.changeStatus(subTaskId as string, status as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

export default router;