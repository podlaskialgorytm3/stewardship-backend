import express from 'express';
import { Request, Response } from 'express';
import SubTaskController from '../controllers/sub-task';
import GroupUserController from '../controllers/group-user';
import UserAuthentication from '../middlewares/auth';
import { SubTaskCreation } from '../types/sub-task';

const router = express.Router();

const subTaskController = new SubTaskController();
const userAuthentication = new UserAuthentication();
const groupUserController = new GroupUserController();

router.post('/sub-task', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId, title, description, status } = request.query;
        const subTaskData = { taskInfoId, title, description, status } as unknown as SubTaskCreation;
        const groupUser = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as { id: number };
        const result = await subTaskController.createSubTask(subTaskData, groupUser.id);
        response.status(201).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.get('/sub-task/:subTaskId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const subTaskId = request.params.subTaskId;
        const result = await subTaskController.getSubTask(Number(subTaskId));
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.get('/sub-task', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { taskInfoId } = request.query;
        const result = await subTaskController.getSubTasks(Number(taskInfoId));
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
        const subTaskId = request.params.subTaskId;
        const groupUser = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as { id: number };
        const result = await subTaskController.deleteSubTask(Number(subTaskId), groupUser.id);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

router.put('/sub-task/:subTaskId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const subTaskId = request.params.subTaskId;
        const { title, description, status } = request.query;
        const subTaskData = { title, description, status } as unknown as SubTaskCreation;
        const groupUser = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as { id: number };
        const result = await subTaskController.updateSubTask(Number(subTaskId), subTaskData, groupUser.id);
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
        const result = await subTaskController.changeStatus(Number(subTaskId), status as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error)
    }
})

export default router;