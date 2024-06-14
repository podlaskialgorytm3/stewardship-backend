import express from 'express';
import { Request, Response } from 'express';
import GroupUserRequestController from '../controllers/group-user-request';
import UserAuthentication from '../middlewares/auth';
import UserController from '../controllers/user';

const router = express.Router();

const groupUserRequestController = new GroupUserRequestController();    
const userAuthentication = new UserAuthentication();
const userController = new UserController();

router.post('/group-user-request', userAuthentication.authMiddleware, async (request: Request, response: Response) => {
    const { groupId } = request.query;
    const user = await userController.getUserByToken(request.headers['authorization']?.split(' ')[1] as string);
    const responseText = await groupUserRequestController.addRequest(user?.id as number, groupId as string);
    response.status(201).json({ message: responseText });
})

router.get('/group-user-request', userAuthentication.authMiddleware , async (request: Request, response: Response) => {
    const { groupId } = request.query;
    const responseText = await groupUserRequestController.getRequests(groupId as string);
    response.status(201).json({ message: responseText });
})

export default router;