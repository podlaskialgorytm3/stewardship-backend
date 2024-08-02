import express from 'express';
import { Request, Response } from 'express';
import GroupUserRequestController from '../controllers/group-user-request';
import UserAuthentication from '../middlewares/auth';
import UserController from '../controllers/user';
import GroupUserController from '../controllers/group-user';

const router = express.Router();

const groupUserRequestController = new GroupUserRequestController();    
const userAuthentication = new UserAuthentication();
const userController = new UserController();
const groupUserController = new GroupUserController();

router.post('/group-user-request', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId } = request.body;
        const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
        const result = await groupUserRequestController.addRequest(user?.id as number, groupId as string);
        response.status(201).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})

router.get('/group-user-request', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    try{
        const { groupId, username } = request.query;
        const result = await groupUserRequestController.getRequests(groupId as string, username as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.get('/group-user-request/not-added-users', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    try{
        const { groupId, username } = request.query;
        const result = await groupUserRequestController.getNotAddedUsers(groupId as string, username as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/group-user-request', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    try{
        const { groupId, userId, status } = request.query;
        const groupUser = await groupUserController.getUserByTokenGroup(request.headers['authorization']?.split(' ')[1] as string, groupId as string) as {id: number, role: string};
        const result = await groupUserRequestController.changeStatus(groupId as string, userId as unknown as number,status as string, groupUser.role as string);
        response.status(201).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.delete('/group-user-request', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    try{
        const { groupId } = request.body;
        const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string) as {id: number};
        const result = groupUserRequestController.deleteRequest(groupId as string, user.id as number);
        response.status(201).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})

export default router;