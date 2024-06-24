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
    const { taskInfoId, title, description, status } = request.query;
    const subTaskData = { taskInfoId, title, description, status } as unknown as SubTaskCreation;
    const groupUser = await groupUserController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as { id: number };
    const responseText = await subTaskController.createSubTask(subTaskData, groupUser.id);
    response.status(201).json({
        message: responseText
     });
})

router.get('/sub-task/:subTaskId', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const subTaskId = request.params.subTaskId;
    const subTask = await subTaskController.getSubTask(Number(subTaskId));
    response.status(200).json({
        subTask: subTask
    });
})

export default router;