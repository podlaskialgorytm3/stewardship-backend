import express from 'express';
import { Request, Response } from 'express';
import GroupUserRequestController from '../controllers/group-user-request';
import UserAuthentication from '../middlewares/auth';
import UserController from '../controllers/user';
import GroupUserUtils from '../utils/group-user';

const router = express.Router();

const groupUserRequestController = new GroupUserRequestController();    
const userAuthentication = new UserAuthentication();
const userController = new UserController();
const groupUserUtils = new GroupUserUtils();

router.post('/group-user-request', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    try{
        const { groupId } = request.query;
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
        const { groupId } = request.query;
        const result = await groupUserRequestController.getRequests(groupId as string);
        response.status(200).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})
router.put('/group-user-request', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    try{
        const { groupId, userId, status } = request.query;
        const role = await groupUserUtils.getRole(groupId as string, request.headers['authorization']?.split(' ')[1] as string);
        const result = await groupUserRequestController.changeStatus(groupId as string, userId as unknown as number,status as string, role as string);
        response.status(201).json(result);
    }
    catch(error){
        response.status(400).json(error);
    }
})

export default router;